var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('angular', function () {
    gulp.src('node_modules/angular/angular.min.js').pipe(gulp.dest('src/js'));
});