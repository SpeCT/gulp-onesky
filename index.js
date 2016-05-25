'use strict';
var crypto = require('crypto');
var querystring = require('querystring');

var gutil = require('gulp-util');
var path = require('path');
var request = require('request');
var through = require('through');

module.exports = function (opts) {
  opts = opts || {};

  if (!opts.publicKey || !opts.secretKey)
    throw new gutil.PluginError('gulp-onesky', 'please specify public and secret keys');

  if (!opts.projectId)
    throw new gutil.PluginError('gulp-onesky', 'please specify project id');

  if (!opts.sourceFile)
    throw new gutil.PluginError('gulp-onesky', 'please specify source file name');

  if (!opts.outputFile)
    opts.outputFile = opts.sourceFile + '.i18n.json';

  var stream = through(function (file, enc, cb) {
    this.push(file);
    cb();
  });

  getMultilangual(opts, function (err, body) {
    if (err) {
      stream.emit('error', err);
      return;
    }

    if (opts.locales)
      Object.keys(body).forEach(function(lang) {
        stream.queue(new gutil.File({
          path: path.join(opts.outputDir, lang.split('-')[0], 'messages.json'),
          contents: new Buffer(JSON.stringify(body[lang], null, 2))
        }));
      });
    else
      stream.queue(new gutil.File({
        path: opts.outputFile,
        contents: new Buffer(JSON.stringify(body, null, 2))
      }));
    stream.emit('end');
  });

  return stream;
};


function getMultilangual(opts, cb) {
  var time = Math.floor(Date.now() / 1000);
  var hash = crypto.createHash('md5').update('' + time + opts.secretKey).digest('hex');
  var url = 'https://platform.api.onesky.io/1/projects/' + opts.projectId +
    '/translations/multilingual?' + querystring.stringify({
      'api_key': opts.publicKey,
      'timestamp': time,
      'dev_hash': hash,
      'file_format': 'I18NEXT_MULTILINGUAL_JSON',
      'source_file_name': opts.sourceFile
    });

  request({ url: url, encoding: null, json: true }, function (err, res, body) {
    if (err) {
      err = new gutil.PluginError('gulp-onesky', err.message || err.toString());
    } else if (body.meta) {
      if (body.meta.status !== 200) {
        err = new gutil.PluginError('gulp-onesky', body.meta.message);
      } else {
        body = body.meta.data;
      }
    }
    cb(err, body);
  });
}

module.exports.locales = function (opts) {
  opts.locales = true;
  return module.exports(opts);
};
