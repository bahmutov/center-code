'use strict';

var la = require('lazy-ass');
var is = require('check-more-types');
var join = require('path').join;
var index = join(__dirname, '..', 'index.js');
var utils = require('./utils');

describe('startsWithShebang', function () {
  var isShebang = utils.startsWithShebang;

  it('is a function', function () {
    la(is.fn(isShebang));
  });

  it('detects the shebang line', function () {
    la(isShebang('#!/usr/bin/env node\n\nvar foo = 42;'));
  });

  it('ignores if no shebang', function () {
    la(!isShebang('var foo = 42;'));
  });

  it('ignores if has spaces', function () {
    la(!isShebang('  #!/usr/bin/env node\n\nvar foo = 42;'));
  });

  it('ignores if has empty lines', function () {
    la(!isShebang('\n#!/usr/bin/env node\n\nvar foo = 42;'));
  });
});

describe('highlight(filename, text)', function () {
  var highlight = utils.highlight;

  it('is a function', function () {
    la(is.fn(highlight));
  });

  it('highlights a piece of code', function () {
    var source = 'var foo = 42;';
    var text = highlight('foo.js', source);
    la(is.unemptyString(text), text);
  });

  it('highlights a piece of code with shebang', function () {
    var text = highlight('foo.js', '#!/usr/bin/env node\n\nvar foo = 42;');
    la(is.unemptyString(text), text);
  });

  xit('keeps the shebang', function () {
    // depends on
    // https://github.com/thlorenz/cardinal/issues/10
    var text = highlight('foo.js', '#!/usr/bin/env node\n\nvar foo = 42;');
    la(text.indexOf('env node') !== -1, 'keeps the shebang', text);
  });

  it('cannot handle spaces in front of shebang', function () {
    la(is.raises(function () {
      highlight('foo.js', '  #!/usr/bin/env node\n\nvar foo = 42;');
    }));
  });

  it('cannot handle lines in front of shebang', function () {
    la(is.raises(function () {
      highlight('foo.js', '\n#!/usr/bin/env node\n\nvar foo = 42;');
    }));
  });
});
