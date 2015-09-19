var log = require('debug')('center');
var cardinal = require('cardinal');

function isNumber(x) {
  return typeof x === 'number';
}

function terminalSize(outputStream) {
  if (outputStream &&
    isNumber(outputStream.columns) &&
    isNumber(outputStream.rows)) {
    return {
      width: outputStream.columns,
      height: outputStream.rows
    };
  }
}

function isJavaScript(filename) {
  return /\.js$/.test(filename);
}

function isJson(filename) {
  return /\.json$/.test(filename);
}

function getSource(filename) {
  var read = require('fs').readFileSync;
  return read(filename, 'utf-8');
}

function toPromise(value) {
  return new Promise(function (resolve) {
    resolve(value);
  });
}

function widest(lines) {
  return lines.reduce(function (columns, line) {
    return columns > line.length ? columns : line.length;
  }, 0);
}

function padVertically(terminal, sourceSize, sourceLines) {
  var blankLines = Math.floor((terminal.height - sourceSize.rows) / 2);
  if (blankLines < 1) {
    blankLines = 0;
  }
  log('blank lines on the top %d', blankLines);
  var k;
  for (k = 0; k < blankLines; k += 1) {
    sourceLines.unshift('');
  }
  // need to leave 1 or 2 lines at the bottom for the prompt
  for (k = 0; k < blankLines - 1; k += 1) {
    sourceLines.push('');
  }

  return sourceLines.join('\n');
}

function blanks(n) {
  var k, space = '';
  for (k = 0; k < n; k += 1) {
    space += ' ';
  }
  return space;
}

function padHorizontally(terminal, sourceSize, source) {
  var lines = source.split('\n');
  var blankColumns = Math.floor((terminal.width - sourceSize.columns) / 2);
  var blankPrefix = blanks(blankColumns);
  log('blank prefix "%s"', blankPrefix)
  var padded = lines.map(function (line) {
    return blankPrefix + line;
  });

  return padded.join('\n');
}

function centerText(options, source) {
  var size = terminalSize(process.stdout);
  log('terminal %d x %d', size.width, size.height);
  var lines = source.split('\n');
  var columns = widest(lines);
  var sourceSize = {
    columns: columns,
    rows: lines.length
  };
  log('source size %d x %d', sourceSize.columns, sourceSize.rows);
  var paddedHorizontally = padHorizontally(size, sourceSize, source);
  var paddedVertically = padVertically(size, sourceSize, paddedHorizontally.split('\n'));

  var highlighted = paddedVertically;
  if (isJavaScript(options.filename)) {
    highlighted = cardinal.highlight(paddedVertically);
  } else if (isJson(options.filename)) {
    highlighted = cardinal.highlight(paddedVertically, { json: true });
  }
  console.log(highlighted);
}

function grabInput(options) {
  if (options.filename) {
    log('showing in the center %s', options.filename);
    return toPromise(getSource(options.filename));
  }

  log('reading input from STDIN');
  var stdin = require('get-stdin-promise');
  return stdin;
}

function centerCode(options) {
  options = options || {};
  options.filename = options.filename || options.name;

  grabInput(options)
    .then(function (source) {
      centerText(options, source);
    });
}

module.exports = centerCode;

if (!module.parent) {
  centerCode({
    filename: __dirname + '/example/small.js'
  });
}
