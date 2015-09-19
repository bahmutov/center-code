require('lazy-ass');
var R = require('ramda');
var IO = require('./io');
la(typeof IO === 'function', 'IO should be a function', IO);

describe('IO', function () {
  var ioGlobal = new IO(function unsafeGlobalAccess() {
    return global;
  });

  it('holds an unsafe function', function () {
    la(typeof ioGlobal === 'object', 'created io monad to access global');
  });

  it('can be mapped', function () {
    la(typeof ioGlobal.map === 'function');
  });

  it('wraps global access', function (done) {
    // everything is pure until last line of this test
    function getArguments(glob) {
      return glob.process.argv;
    }

    function checkArgs(args) {
      la(Array.isArray(args), 'arguments is a list', args);
    }

    // create a chain of functions
    // BUT nothing is called yet. Including the "dirty"
    // function unsafeGlobalAccess that returns the global state
    var monad = ioGlobal
      .map(getArguments)
      .map(checkArgs)
      .map(done);

    // start the computation. Now unsafeGlobalAccess runs
    monad.unsafePerformIO();
  });
});

describe('terminal size', function () {
  'use strict';

  function getProcess() {
    return process;
  }

  function terminalSize() {
    return new IO(getProcess)
      .map(R.prop('stdout'))
      .map(function (outputStream) {
        return {
          width: outputStream.columns,
          height: outputStream.rows
        };
      });
  }

  it('works with a monad', function () {
    var verified; // to make sure monad chain ran

    // check the returned size
    var monad = terminalSize()
      .map(function (size) {
        la(size.width === 42);
        la(size.height === 20);
        verified = true;
      });
    // nothing ran yet. Time to prepare the environment!
    process.stdout.columns = 42;
    process.stdout.rows = 20;

    // now start the monad execution
    monad.unsafePerformIO();

    la(verified, 'monad executed');
  });
});
