/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/


var gulp = require("gulp");
var $ = require('gulp-load-plugins')();

var config = {
    src: {
        root: './',
        js: ['./scripts/*.js', '!./scripts/*.min.js'],
        css: ['./content/css/*.css', '!./content/css/*.min.css'],
        html: './*.html'
    },
    dest: {
        js: './scripts/',
        css: './content/css/'
    }
}


/*
 * Add vendor prefixes to CSS rules, bundle, minimize, and generate source map for the final css file
 */
gulp.task('css:dest', function () {
    return gulp.src(config.src.css)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.concat('styles.min.css'))
        .pipe($.cleanCss())
        .pipe($.sourcemaps.write("./"))
        .pipe(gulp.dest(config.dest.css))       
});


/*
 * transpile  js files, uglify, and add source map to them
 */
gulp.task('js:dest', function () {
    return gulp.src(config.src.js)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.uglify())
        .pipe($.concat('app.min.js'))
        .pipe($.sourcemaps.write("./"))
        .pipe(gulp.dest(config.dest.js))
});


/*
 * monitor any change to re-run the tasks
 */
gulp.task('watch', function () {
    gulp.watch([config.src.css], ['css:dest']);
    gulp.watch([config.src.js], ['js:dest']);
});

gulp.task('copy:dest', ['css:dest', 'js:dest']);


//Set a default tasks
gulp.task('default', ['copy:dest', 'watch'], function () {
    // place code for your default task here
});
