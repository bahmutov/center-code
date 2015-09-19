require('lazy-ass');
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
