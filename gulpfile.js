// grab our packages
var gulp   = require('gulp'),
		del = require('del'),
    sass   = require('gulp-sass'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    merge = require('merge-stream'),
    runSequence = require('run-sequence'),
		browserSync = require('browser-sync').create(),
		reload = browserSync.reload,
    ghPages = require('gulp-gh-pages');

gulp.task('build-js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('build-css', function() {
  return gulp.src([
  		'src/scss/**/*.scss',
  		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
  		'./node_modules/normalize.css/normalize.css'
  	])
    .pipe(sass().on('error', sass.logError))
    .pipe(sass())
    .pipe(gulp.dest('dist/assets/stylesheets'));
});

gulp.task('build-html', function() {
    return gulp.src('src/**/*.html')
        .pipe(inject(gulp.src(['./src/partials/head/*.html']), {
            starttag: '<!-- inject:head:{{ext}} -->',
            transform: function (filePath, file) {
                // return file contents as string
                return file.contents.toString('utf8')
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-resources', function() {
  var js = gulp.src([
  	'./node_modules/bootstrap/dist/js/bootstrap.min.js',
  	'./node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
    './node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
    './node_modules/gsap/src/minified/TweenMax.min.js',
  	'./node_modules/gsap/src/minified/jquery.gsap.min.js',
  	'./node_modules/jquery/dist/jquery.min.js'
  	])
    .pipe(gulp.dest('dist/vendors'));

  var img = gulp.src('src/assets/img/**/*')
    .pipe(gulp.dest('dist/assets/img'));

  var video = gulp.src('src/assets/video/**/*')
    .pipe(gulp.dest('dist/assets/video'));

  var pdf = gulp.src('src/assets/pdf/**/*')
    .pipe(gulp.dest('dist/assets/pdf'));

  var fonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'));

  var data = gulp.src('src/data/**/*')
    .pipe(gulp.dest('dist/data'));

  return merge(js, img, video, pdf, fonts, data);
});

gulp.task('clean', function() {
  del.sync(['.tmp/', 'dist/']);
});

gulp.task('clean-js', function() {
   del.sync('dist/js');
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// Static server
gulp.task('build', function() {
	browserSync.init({
		notify: false,
		port: 9000,
    server: {
        baseDir: './dist'
    },
    reloadDelay: 100,
    browser: 'google chrome'
  });

		gulp.watch('src/**/*.html').on('change', function(){
       runSequence('build-html', reload);
    });
	
    gulp.watch('src/scss/**/*.scss').on('change', function(){
      del('dist/assets/stylesheets');
      runSequence('build-css', reload);
    });
	
    gulp.watch('src/js/**/*.js').on('change', function(){
      runSequence('clean-js', 'build-js', reload);
    });
});

// define the default task and add the watch task to it
gulp.task('default', ['clean','copy-resources','build-html','build-css','build-js','build']);

