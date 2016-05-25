# gulp-onesky [![Build Status](https://travis-ci.org/SpeCT/gulp-onesky.svg?branch=master)](https://travis-ci.org/SpeCT/gulp-onesky)

> My classy gulp plugin


## Install

```
$ npm install --save-dev gulp-onesky
```


## Usage

```js
var gulp = require('gulp');
var onesky = require('gulp-onesky');

gulp.task('i18n:multilangual-json', () => {
  onesky({
    publicKey: '<onesky account public key>',
    secretKey: '<onesky account secret key>',
    projectId: '<your project id>',
    sourceFile: '<onesky source filename>'
  }))
  .pipe(gulp.dest('src'))
);


gulp.task('i18n:web-extension-locales', () => {
  onesky.locales({
    publicKey: '<onesky account public key>',
    secretKey: '<onesky account secret key>',
    projectId: '<your project id>',
    sourceFile: '<onesky source filename>'
  }))
  .pipe(gulp.dest('src'))
);
```


## License

MIT © [Iurii Proshchenko](https://github.com/spect)
