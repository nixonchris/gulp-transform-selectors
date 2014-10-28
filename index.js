'use strict';

var es = require('event-stream'),
	postcss = require('postcss'),
	applySourceMap = require('vinyl-sourcemaps-apply'),
	gutil = require('gulp-util');


module.exports = function (fn, options) {
	var transformSelector;

	if (!options) {
		options = {};
	}

	transformSelector = postcss(function (css) {
		css.eachRule(function (rule) {
			if (!options.splitOnCommas) {
				rule.selector = fn(rule.selector);
			} else {
				rule.selectors = rule.selectors.map(fn);
			}
		});
	});

	return es.map(function (file, callback) {
		var through,
			wait,
			result;

		if(file.isNull()) {

			callback(null, file);
			return

		} else if (file.isStream()) {

			through = es.through();
			wait = es.wait(function (err, contents) {
				through.write(transformSelector.process(contents).css);
				through.end();
			});

			file.contents.pipe(wait);
			file.contents = through;

		} else if (file.isBuffer()) {

			if (file.sourceMap) {
	      options.makeSourceMaps = true;
	    }

			try {
				result = transformSelector.process(file.contents.toString(), {
					map: file.sourceMap ? {annotation: false} : false,
					from: file.relative,
					to: file.relative
				});

				file.contents = new Buffer(result.css);

				if (result.map && file.sourceMap) {
					applySourceMap(file, result.map.toString());
				}
			} catch (err) {
				callback(new gutil.PluginError('gulp-transform-selectors', err, {fileName: file.path}));
				return;
			}

		}

		callback(null, file);
	});
};
