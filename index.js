var log = require('debug')('center');

function terminalSize() {
  return {
    width: process.stdout.columns,
    height: process.stdout.rows
  };
}

function centerCode(options) {
  options = options || {};
  options.filename = options.filename || options.name;
  log('showing in the center %s', options.filename);
  var size = terminalSize();
  log('terminal %d x %d', size.width, size.height);
}

module.exports = centerCode;

if (!module.parent) {
  centerCode({
    filename: __filename
  });
}
