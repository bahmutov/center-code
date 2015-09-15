var log = require('debug')('center');

function centerCode(options) {
  options = options || {};
  options.filename = options.filename || options.name;
  log('showing in the center %s', options.filename);
}

module.exports = centerCode;

if (!module.parent) {
  centerCode({
    filename: __filename
  });
}
