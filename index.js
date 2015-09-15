var log = require('debug')('center');

function terminalSize() {
  return {
    width: process.stdout.columns,
    height: process.stdout.rows
  };
}

function getSource(filename) {
  var read = require('fs').readFileSync;
  return read(filename, 'utf-8');
}

function widest(lines) {
  return lines.reduce(function (columns, line) {
    return columns > line.length ? columns : line.length;
  }, 0);
}

function centerCode(options) {
  options = options || {};
  options.filename = options.filename || options.name;
  log('showing in the center %s', options.filename);
  var size = terminalSize();
  log('terminal %d x %d', size.width, size.height);
  var source = getSource(options.filename);
  var lines = source.split('\n');
  var columns = widest(lines);
  log('source size %d x %d', columns, lines.length);
}

module.exports = centerCode;

if (!module.parent) {
  centerCode({
    filename: __filename
  });
}
