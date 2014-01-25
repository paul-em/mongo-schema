var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var mocha = require('gulp-mocha');

gulp.task('default', function(){
  gulp.src('./lib/*.js')
    .pipe(concat('mongo-schema.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./lib'));
});

gulp.task('watch', function(){
  gulp.watch('./lib/*.js', function(){
    gulp.run('default');
  })
});

gulp.task('watchTest', function(){
  gulp.watch('./lib/*.js', function(){
    gulp.run('test');
  })
});

gulp.task('test', function(){
  gulp.src('test/mongo-schema_test.js')
    .pipe(mocha({reporter: 'nyan'}));
});