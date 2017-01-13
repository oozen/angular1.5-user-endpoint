var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('angular', function () {
    gulp.src('node_modules/angular/angular.min.js').pipe(gulp.dest('src/js/vendor'));
});

gulp.task('concatScripts', function () {
    gulp.src(['src/js/main.module.js','src/js/users/*.js']).pipe(concat('app.js')).pipe(gulp.dest('src/js'));
});