var la = require('lazy-ass');
var check = require('check-more-types');
var describeIt = require('describe-it');
var join = require('path').join;
var index = join(__dirname, '..', 'index.js');

describeIt(index, 'startsWithShebang(text)', function (extract) {
  var isShebang;
  before(function () {
    isShebang = extract();
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

describeIt(index, 'highlight(filename, text)', function (extract) {
  var highlight;
  before(function () {
    highlight = extract();
  });

  it('is a function', function () {
    la(check.fn(highlight));
  });

  it('highlights a piece of code', function () {
    var source = 'var foo = 42;';
    var text = highlight('foo.js', source);
    la(check.unemptyString(text), text);
  });

  it('highlights a piece of code with shebang', function () {
    var text = highlight('foo.js', '#!/usr/bin/env node\n\nvar foo = 42;');
    la(check.unemptyString(text), text);
  });

  xit('keeps the shebang', function () {
    // depends on
    // https://github.com/thlorenz/cardinal/issues/10
    var text = highlight('foo.js', '#!/usr/bin/env node\n\nvar foo = 42;');
    la(text.indexOf('env node') !== -1, 'keeps the shebang', text);
  });

  it('cannot handle spaces in front of shebang', function () {
    la(check.raises(function () {
      highlight('foo.js', '  #!/usr/bin/env node\n\nvar foo = 42;');
    }));
  });

  it('cannot handle lines in front of shebang', function () {
    la(check.raises(function () {
      highlight('foo.js', '\n#!/usr/bin/env node\n\nvar foo = 42;');
    }));
  });
});

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

describeIt(index, 'terminalSize()', function (extract) {
  var terminalSize;

  before(function () {
    terminalSize = extract();
  });

  it('works with a monad', function () {
    var verified; // to make sure monad chain ran

    var monad = terminalSize()
      .map(function checkTerminal(size) {
        la(size.width === 42);
        la(size.height === 20);
        verified = true;
      });
    // nothing ran yet. Time to prepare the environment!
    process.stdout.columns = 42;
    process.stdout.rows = 20;
    // now start the monad execution
    monad.unsafePerformIO();
    la(verified, 'monad executed');
  });

  xit('works under Node', function () {
    var fakeTerminal = {
      columns: 20,
      rows: 10
    };
    var resolution = terminalSize(fakeTerminal);
    la(resolution, 'got resolution object', resolution);
    la(resolution.width === fakeTerminal.columns, 'has width', resolution);
    la(resolution.height === fakeTerminal.rows, 'has height', resolution);
  });
});
