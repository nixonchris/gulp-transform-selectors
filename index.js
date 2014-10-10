'use strict';

var es = require('event-stream'),
	postcss = require('postcss');


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
			wait;
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
			file.contents = new Buffer(transformSelector.process(file.contents).css);
		}

		callback(null, file);
	});
};
