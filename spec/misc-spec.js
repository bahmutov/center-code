var describeIt = require('describe-it');
var index = __dirname + '/../index.js';

describeIt(index, 'widest(lines)', function (extract) {
  var widest;
  before(function () {
    widest = extract();
  });

  it('finds longest line length', function () {
    var found = widest(['foo', 'bar', '12345']);
    la(found === 5, 'widest line', found);
  });
});

describeIt(index, 'blanks(n)', function (extract) {
  var blanks;
  before(function () {
    blanks = extract();
  });

  it('forms empty string with 5 spaces', function () {
    var str = blanks(5);
    la(str === '     ');
  });
});

describeIt(index, 'terminalSize(outputStream)', function (extract) {
  var terminalSize;

  before(function () {
    terminalSize = extract();
  });

  it('works under Node', function () {
    var fakeTerminal = {
      columns: 20,
      rows: 10
    };
    var resolution = terminalSize(fakeTerminal);
    la(resolution, 'got resolution object', resolution);
    la(typeof resolution.width === 'number', 'has width', resolution);
    la(typeof resolution.height === 'number', 'has height', resolution);
  });
});
