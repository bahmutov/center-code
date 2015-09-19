// taken from
// https://github.com/MostlyAdequate/mostly-adequate-guide
var compose = require('lodash.compose');
console.assert(typeof compose === 'function');

var IO = function(f) {
  this.unsafePerformIO = f;
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}

IO.prototype.map = function(f) {
  return new IO(compose(f, this.unsafePerformIO));
}

module.exports = IO;
