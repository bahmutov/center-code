require('lazy-ass');
var IO = require('./io');
la(typeof IO === 'function', 'IO should be a function', IO);

describe('IO', function () {
  var ioGlobal = new IO(function(){ return global; });

  it('holds an unsafe function', function () {
    la(typeof ioGlobal === 'object', 'created io monad to access global');
  });

  it('can be mapped', function () {
    la(typeof ioGlobal.map === 'function');
  });

  it('wraps global access', function (done) {
    function getArguments(glob) {
      return glob.process.argv;
    }

    function checkArgs(args) {
      la(Array.isArray(args), 'arguments is a list', args);
    }

    var monad = ioGlobal
      .map(getArguments)
      .map(checkArgs)
      .map(done);

    // start the computation
    monad.unsafePerformIO();
  });

});
