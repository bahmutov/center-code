var IO = require('./io');
require('lazy-ass');

describe('IO', function () {
  var io_global;

  beforeEach(function () {
    la(typeof IO === 'function');
    io_global = new IO(function(){ return global; });
  });

  it('holds an unsafe function', function () {
    la(typeof io_global === 'object', 'created io monad to access global');
  });

  it('can be mapped', function () {
    la(typeof io_global.map === 'function');
  });

  it('wraps global access', function () {
    function getArguments(glob) {
      console.log('returning arguments, global', global);
      return glob.process.argv;
    }
    io_global.map(getArguments).map(function (args) {
      la(Array.isArray(args), 'arguments is a list', args);
    });
  });

});
