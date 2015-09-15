#!/usr/bin/env node

if (process.argv.length < 3) {
  console.error('center <filename>');
  process.exit(-1);
}
var filename = process.argv[process.argv.length - 1];
var centerCode = require('..');
centerCode({ filename: filename });
