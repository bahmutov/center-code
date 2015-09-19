// taken from
// https://github.com/MostlyAdequate/mostly-adequate-guide
var R = require('ramda');
console.assert(typeof R.compose === 'function', 'has R.compose');

var IO = function(f) {
  this.unsafePerformIO = f;
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}

IO.prototype.map = function(f) {
  return new IO(R.compose(f, this.unsafePerformIO));
}

module.exports = IO;
