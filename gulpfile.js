'use strict';

var gulp = require('gulp');
  var connect = require('gulp-connect');
  gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

gulp.task('serveprod', function() {
  connect.server({
    root: '',
    port: process.env.PORT || 5000, // localhost:5000
    livereload: false
  });
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
