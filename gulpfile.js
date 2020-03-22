var gulp = require('gulp');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var nunjucks = require('gulp-nunjucks');
var htmlbeautify = require('gulp-html-beautify');
var browserSync = require('browser-sync');

//less
function less__compile() {
	return gulp.src('app/less/*.less')
		.pipe(less())
		.pipe(prefix({
            browsers: ['>0.1%']
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());;

}


//Nunjucks
function nunjucks_compile() {
    return gulp.src('app/nunjucks/*.html')
        .pipe(nunjucks.compile())
        .pipe(htmlbeautify({
            "preserve_newlines": false,
        }))
        .pipe(gulp.dest('app'));
}


//Вотчер
function watch() {
	less__compile();
	nunjucks_compile();

	browserSync.init({
        server: {
            baseDir: "app"
        }
    });

	gulp.watch('app/js/*.js').on('change', browserSync.reload);
	//gulp.watch('img/**/*').on('change', browserSync.reload);
	gulp.watch('app/img/**/*',browserSync.reload);
    gulp.watch('app/less/*.less', less__compile);
    gulp.watch('app/nunjucks/**/*.html', nunjucks_compile).on('change', browserSync.reload);

}

gulp.task('watch',watch);




//=======================Сборка====================//
function html__build() {
	return gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
}

function js__build() {
	return gulp.src('app/js/*.js')
		.pipe(gulp.dest('dist/js'));
}
function css__build() {
	return gulp.src('app/css/*.css')
		.pipe(gulp.dest('dist/css'));
}
function img__build() {
	return gulp.src('app/img/*.*')
		.pipe(gulp.dest('dist/img'));
}
function fonts__build() {
	return gulp.src('app/fonts/*.*')
		.pipe(gulp.dest('dist/fonts'));
}
function build__func() {
	html__build();
	js__build();
	css__build();
	img__build();
	fonts__build();
}

gulp.task('build', build__func);
//=======================END Сборка======================//
