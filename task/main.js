var gulp  = require('gulp'),
    debug = require('gulp-debug'),
    mocha = require('gulp-mocha'),

    sequence = require('gulp-sequence'),
    phantom  = require('gulp-mocha-phantomjs'),

    root = '../',
    test = root + 'test/';

gulp.task('default', function() {
    return (
         gulp
            .src(test + '*.mocha.js', {read: false})
            //.pipe(debug())
            .pipe(mocha())
    )
});

gulp.task('test-amd', function() {
    return (
        gulp
            .src(test + 'AMD/test.html', {read: false})
            .pipe(phantom({reporter: 'spec'}))
    );
});

gulp.task('test-commonjs', function() {
    return (
        gulp
            .src(test + 'CommonJS/test.js', {read: false})
            .pipe(mocha())
    );
});

gulp.task('test-global', function() {
    return (
        gulp
            .src(test + 'Global/test.html', {read: false})
            .pipe(phantom({reporter: 'spec'}))
    );
});

gulp.task('test', sequence('test-commonjs', 'test-amd', 'test-global'));