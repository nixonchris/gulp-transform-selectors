/*global describe, it*/
'use strict';

var fs = require('fs'),
	es = require('event-stream'),
	should = require('should'),
	sourcemaps = require('gulp-sourcemaps');

require('mocha');

delete require.cache[require.resolve('../')];

var gutil = require('gulp-util'),
	transformSelectors = require('../');

function testTransformation(selector) {
	return '.scope ' + selector;
}

describe('gulp-require-convert', function () {

	var expectedFile = new gutil.File({
		path: 'test/expected/main.css',
		cwd: 'test/',
		base: 'test/expected',
		contents: fs.readFileSync('test/expected/main.css')
	});

	it('should produce expected file via buffer', function (done) {

		var srcFile = new gutil.File({
			path: 'test/fixtures/main.css',
			cwd: 'test/',
			base: 'test/fixtures',
			contents: fs.readFileSync('test/fixtures/main.css')
		});

		var stream = transformSelectors(testTransformation, {
			splitOnCommas: true
		});

		stream.on('error', function (err) {
			should.not.exist(err);
			done(err);
		});

		stream.on('data', function (newFile) {

			should.exist(newFile);
			should.exist(newFile.contents);
			String(newFile.contents).should.equal(String(expectedFile.contents));
			done();
		});

		stream.write(srcFile);
		stream.end();
	});

	it('should produce expected file via stream', function (done) {

		var srcFile = new gutil.File({
			path: 'test/fixtures/main.css',
			cwd: 'test/',
			base: 'test/fixtures',
			contents: fs.createReadStream('test/fixtures/main.css')
		});

		var stream = transformSelectors(testTransformation, {
			splitOnCommas: true
		});

		stream.on('error', function (err) {
			should.not.exist(err);
			done();
		});

		stream.on('data', function (newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);

			newFile.contents.pipe(es.wait(function (err, data) {
				should.not.exist(err);
				String(data).should.equal(String(expectedFile.contents));
				done();
			}));
		});

		stream.write(srcFile);
		stream.end();
	});

	it('should generate source maps', function (done) {

		var init = sourcemaps.init();
		var write = sourcemaps.write();

		var srcFile = new gutil.File({
			path: 'test/fixtures/main.css',
			cwd: 'test/',
			base: 'test/fixtures',
			contents: fs.readFileSync('test/fixtures/main.css')
		});

		init
			.pipe(transformSelectors(testTransformation, {
				splitOnCommas: true
			}))
			.pipe(write);

		write.on('data', function (newFile) {
			var contents = newFile.contents.toString();
			should(/sourceMappingURL=data:application\/json;base64/.test(contents)).ok;
			done();
		});

		init.write(srcFile);
		init.end();
	});
});
