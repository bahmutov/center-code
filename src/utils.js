'use strict';

var log = require('debug')('center');
var check = require('check-more-types');
var la = require('lazy-ass');
var cardinal = require('cardinal');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');

function highlightMarkdown(text) {
  marked.setOptions({
    renderer: new TerminalRenderer()
  });
  return marked(text);
}

function isJavaScript(filename) {
  return /\.js$/.test(filename);
}

function isJson(filename) {
  return /\.json$/.test(filename);
}

function isMarkdown(filename) {
  return /\.md$/.test(filename) ||
    /\.markdown$/.test(filename);
}

function startsWithShebang(text) {
  return /^#!/.test(text);
}

function highlight(filename, text) {
  la(check.unemptyString(text), 'missing text to highlight');

  var highlighted = text;

  if (startsWithShebang(text)) {
    log('%s starts with shebang, cannot highlight', filename);
    return highlighted;
  }

  if (isJavaScript(filename)) {
    log('highlighting javascript file', filename);
    highlighted = cardinal.highlight(text);
  } else if (isJson(filename)) {
    log('highlighting json file', filename);
    highlighted = cardinal.highlight(text, { json: true });
  } else if (isMarkdown(filename)) {
    log('highlighting Markdown file', filename);
    highlighted = highlightMarkdown(text);
  }
  return highlighted;
}

module.exports = {
  startsWithShebang: startsWithShebang,
  highlight: highlight
};
