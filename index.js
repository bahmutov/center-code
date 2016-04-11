'use strict';

var log = require('debug')('center');
var R = require('ramda');
var la = require('lazy-ass');
var check = require('check-more-types');
var Promise = require('bluebird');
var utils = require('./src/utils');

function highlightMarkdown(text) {
  var marked = require('marked');
  var TerminalRenderer = require('marked-terminal');
  marked.setOptions({
    renderer: new TerminalRenderer()
  });
  return marked(text);
}

function getProcess() { return process; }

function terminalSize() {
  var IO = require('./src/io');
  return new IO(getProcess)
    .map(R.prop('stdout'))
    .map(function (outputStream) {
      return {
        width: outputStream.columns,
        height: outputStream.rows
      };
    });
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

function padVertically(terminal, text) {
  var sourceLines = text.split('\n');
  var rows = sourceLines.length;
  var blankLines = Math.floor((terminal.height - rows) / 2);
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

function padHorizontally(terminal, text, columns) {
  if (check.not.number(columns)) {
    columns = textSize(text).columns;
  }
  la(check.number(columns), 'missing number of columns', text);

  var lines = text.split('\n');
  var blankColumns = Math.floor((terminal.width - columns) / 2);
  var blankPrefix = blanks(blankColumns);
  log('blank prefix "%s" %d columns', blankPrefix, blankPrefix.length);

  var padded = lines.map(function (line) {
    return blankPrefix + line;
  });

  return padded.join('\n');
}

function textSize(text) {
  var lines = text.split('\n');
  var columns = widest(lines);
  return {
    columns: columns,
    rows: lines.length
  };
}

function centerText(options, source) {
  var monad = terminalSize()
    .map(function (size) {
      log('terminal %d x %d', size.width, size.height);

      var sourceSize = textSize(source);
      log('source size %d x %d', sourceSize.columns, sourceSize.rows);

      var highlighted = utils.highlight(options.filename, source);

      var paddedHorizontally = padHorizontally(size, highlighted, sourceSize.columns);
      var paddedVertically = padVertically(size, paddedHorizontally);
      console.log(paddedVertically);
    });
  // nothing has happened yet - no functions executed, just composed
  // now run them (including unsafe ones)
  monad.unsafePerformIO();
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
    }).catch(console.error.bind(console));
}

module.exports = centerCode;

if (!module.parent) {
  console.log('running directly');
  centerCode({
    filename: __dirname + '/example/small.js'
  });
}
