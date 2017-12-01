var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref'); // gulp-useref concatenates CSS and JS from specified blocks in the HTML head


// gulp.task('task-name', function(){
//     Do stuff here...
// });

gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch'],
      callback
    )
});

/* SASS Compile */
gulp.task('sass', function(){
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

/* Watch */
gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('app/*.html', browserSync.reload);           // HTML
    gulp.watch('app/scss/**/*.scss', ['sass']);             // SASS   
    gulp.watch('app/js/**/*.js', browserSync.reload);       // JS
});

/* Browser-Sync */
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
        baseDir: 'app'
        },
    })
});

/* Dist Tasks */

/* Useref */
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

/* Images */
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'));
});

/* Fonts */
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

/* Clean:dist */
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

/* Cache:clear */
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

/* Build */
gulp.task('build', function (callback) {
    runSequence('clean:dist', 
      ['sass', 'useref', 'images', 'fonts'],
      callback
    )
});