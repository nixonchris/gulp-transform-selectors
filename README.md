# gulp-transform-selectors
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> Gulp plugin to transform css selectors


## Usage

First, install `gulp-transform-selectors` as a development dependency:

```shell
npm install --save-dev gulp-transform-selectors
```

Then, add it to your `gulpfile.js`:

```javascript
var transformSelectors = require("gulp-transform-selectors");

gulp.src("./src/*.css")
    .pipe(transformSelectors(function (selector) {
        return '.ie8 ' + selector;
    }))
    .pipe(gulp.dest("./dist"));
```

## Options

A hash of options may be passed to the transform selectors function as the second parameter;

### splitOnCommas

While the plugin will normally run the passed in function once for each selector, it's sometimes preferable to run it once for each comma seperated group within each selector.

```css
h1, h2, h3, h4, h5, h6 {
    margin: 10px 0;
    font-family: inherit;
    font-weight: bold;
    line-height: 20px;
    color: inherit;
    text-rendering: optimizelegibility;
}
```
With splitOnCommas set to false (default), the function would receive "h1, h2, h3, h4, h5, h6" as an argument. When true, h1, h2, h3, h4, h5 and h6 would each be passed as arguments and transformed individually.

Example config:

```javascript
var transformSelectors = require("gulp-transform-selectors");

gulp.src("./src/*.css")
    .pipe(transformSelectors(function (selector) {
        return '.ie8 ' + selector;
    }, {
        splitOnCommas: true
    }))
    .pipe(gulp.dest("./dist"));
```




## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-transform-selectors
[npm-image]: https://badge.fury.io/js/gulp-transform-selectors.png

[travis-url]: http://travis-ci.org/nixonchris/gulp-transform-selectors
[travis-image]: https://secure.travis-ci.org/nixonchris/gulp-transform-selectors.png?branch=master

[coveralls-url]: https://coveralls.io/r/nixonchris/gulp-transform-selectors
[coveralls-image]: https://coveralls.io/repos/nixonchris/gulp-transform-selectors/badge.png

[depstat-url]: https://david-dm.org/nixonchris/gulp-transform-selectors
[depstat-image]: https://david-dm.org/nixonchris/gulp-transform-selectors.png
