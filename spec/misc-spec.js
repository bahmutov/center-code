var describeIt = require('describe-it');

describeIt(__dirname + '/../index.js', 'widest(lines)', function (extract) {
  var widest;
  before(function () {
    widest = extract();
  });

  it('finds longest line length', function () {
    var found = widest(['foo', 'bar', '12345']);
    la(found === 5, 'widest line', found);
  });
});

describeIt(__dirname + '/../index.js', 'blanks(n)', function (extract) {
  var blanks;
  before(function () {
    blanks = extract();
  });

  it('forms empty string with 5 spaces', function () {
    var str = blanks(5);
    la(str === '     ');
  });
});
