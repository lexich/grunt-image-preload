'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.image_preload = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {  
    var actual = grunt.file.read('tmp/index.html');
    test.ok(actual.indexOf("http://example.com/2.png") > 0 );
    test.ok(actual.indexOf("http://example.com/7151.jpg") > 0 ); 
    test.ok(actual.indexOf("http://example.com/thumbkoshki3912.jpg") > 0 );
    test.ok(actual.indexOf("index.html") > 0 );

    actual = grunt.file.read('tmp/index2.html');
    test.ok(actual.indexOf("index2.html") > 0 );

    test.done();
  },
  
};
