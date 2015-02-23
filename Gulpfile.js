/*jshint node: true */
'use strict';

var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var refresh = require('gulp-livereload');
var sass = require('gulp-sass');
var gp = require('gulp-protractor');
var transform = require('vinyl-transform');
var server = require('./server/index');

gulp.task('clean', function (done) {
  del(['.tmp', 'public'], done);
});

gulp.task('serve', function() {
  server.run();
});

// e2e testing
gulp.task('e2e',['views', 'styles', 'lint', 'browserify','serve'], function() {
  gulp.src(['e2e/bootstrap.js', 'e2e/**/*.page.js','e2e/**/*.spec.js'])
    .pipe(gp.protractor({
        configFile: './protractor.conf.js',
        args: ['--baseUrl', 'http://localhost:8080' ]
      }))
    .on('end', function() {
      server.close();
    });
});


// Dev task
gulp.task('dev', ['views', 'styles', 'assets', 'lint', 'browserify', 'watch'], function () {});

// JSLint task
gulp.task('lint', function () {
  gulp.src(['client/app/*.js', 'client/app/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Assets task
gulp.task('assets', function () {
  gulp.src('client/images/**/*')
    .pipe(gulp.dest('public/images'));
});

 // Styles task
gulp.task('styles', function () {
  // gulp.src('client/styles/*.scss')
  gulp.src(['client/app/app.scss'])
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(sass({ errLogToConsole: true }))
  // move to public
  .pipe(gulp.dest('public/'));
});

// Browserify the web application
gulp.task('browserify', function () {
  return gulp
    .src('client/app/app.js')
    .pipe(transform(function (filename) {
      return browserify(filename).bundle();
    }))
    .pipe(gulp.dest('public/js/'));
});

// Views task
gulp.task('views', function () {
  // Get our index.html
  gulp.src('client/index.html')
  // And put it in the public folder
  .pipe(gulp.dest('public/'));

  var LOCALS = {};
  // Any other view files from client views
  gulp.src('client/app/**/*.jade')
    .pipe(jade({
      locals: LOCALS
    }))
    // Will be put in the public/views folder
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', ['serve', 'lint'], function () {
  // Start live reload server
  refresh.listen();

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['client/app/*.js', 'client/app/**/*.js'], [
    'lint',
    'browserify'
  ]);

  // Watch our sass files
  gulp.watch(['client/app/*.scss','client/app/**/*.scss'], [
    'styles'
  ]);

  // Watch view files
  gulp.watch(['client/app/**/*.jade'], [
    'views'
  ]);

  gulp.watch('./public/**').on('change', refresh.changed);

});

gulp.task('default', ['dev']);
