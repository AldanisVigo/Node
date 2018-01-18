const gulp = require('gulp')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var nodemon = require('gulp-nodemon')
var notify = require('gulp-notify')
var livereload = require('gulp-livereload')
var wait = require('gulp-wait')

var nodemonitor

//Compile SASS files to CSS
gulp.task('sass', function(){
	gulp.src('src/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('public/css'))
				.pipe(livereload())
})

//Minify Javascript Source Files
gulp.task('minifyjs', function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
			.pipe(gulp.dest('public/js'))
})

//Watch CSS
gulp.task('watch_css', function(){
	gulp.watch('src/sass/*.scss',['sass'])
})

//Reload JSX
gulp.task('jsx', function(){
	//nodemonitor.emit('restart')

	gulp.src('views/**/*.jsx')
		.pipe(livereload())
			.pipe(notify("JSX Change.."))
})

//Watch JSX
gulp.task('watch_jsx', function(){
	gulp.watch('views/**/*.jsx',['jsx'])
})

//Reload JS
gulp.task('js', function(){
	nodemonitor.emit('restart')
})

//Watch JS
gulp.task('watch_js', function(){
	gulp.watch('index.js',['js'])
	gulp.watch('routes/*.js',['js'])
})

//Setup nodemon and livereload
gulp.task('monitor', function(){
	//Listen for changes
	livereload.listen();

	//Configure nodemon
	nodemonitor = nodemon({
		script: 'index.js',
		ext: 'js jsx scss',
		delay: "10ms"
	}).on('restart', function(){		
		gulp.src('index.js')
			.pipe(wait(20))
				.pipe(livereload())
					.pipe(notify("Reloading page, please wait..."));

	})
})

gulp.task('default',['watch_css','watch_jsx','watch_js','monitor'])