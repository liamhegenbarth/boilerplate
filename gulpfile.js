
'use strict';

/**
 * Assign gulp and dependancies to variables
 * 
 */

var	project		= require('./package'),
	gulp 		= require('gulp'),
	browserify 	= require('browserify'),
	babelify 	= require('babelify'),

	fs 			= require('fs'),
	source 		= require('vinyl-source-stream'),
	stream 		= require('event-stream'),
	through 	= require('through2'),
	buffer 		= require('vinyl-buffer'),
	glob 		= require('glob'),

	sass 		= require('gulp-sass'),
	sassImport 	= require('gulp-sass-import'),
	prefix 		= require('gulp-autoprefixer'),
	sourcemap  	= require('gulp-sourcemaps'),
	gmmq 		= require('gulp-merge-media-queries'),
	minify 		= require('gulp-minify-css'),

	uglify 		= require('gulp-uglify'),
	rename 		= require('gulp-rename'),
	sprite 		= require('gulp-svg-sprites'),

	// run 		= require('gulp-run'),
	notify 		= require('gulp-notify'),
	plumber 	= require('gulp-plumber'),
	
	browserSync = require('browser-sync').create();


/*
 * Site object for re-usable variable paths etc
 * 
 */

var Site = {

	name 		: project.name,

	builder 	: project.author || process.env.USER,

	domain 		: 'localhost:3000',

	paths : {

		javascript : {

			dist  		:   'public/assets/js/',
			js 			: 	'resources/js/compile/*.js',
			watch       :   'resources/js/**/**/**/**/**/*.js'
		},

		styles : {

			dist		:   'public/assets/css/',
			sass 		:   'resources/sass/compile/*.scss',
			watch 		:   'resources/sass/**/**/**/**/**/*.scss'
		},

		images : {

			icons       :   'public/assets/images/icons/',
			library     :   'public/assets/images/icons/library/*.svg',
			svg         :   'icon-library.svg'

		}
	}
};


/*
 * Our Default gulp task
 * 
 */


// Errors function
var onError = function(err) {
	notify.onError({
		title       : 'Gulp Error - Compile Failed',
		subtitle    : Site.name,
		message     : 'Error: <%= error.message %>'
	})(err);

	this.emit('end');
};

// Compile our Sass with Sourcemaps for our test sites
// Called first in our parent 'sass' task (below)
gulp.task('sass-dev', function() {
	return gulp.src(Site.paths.styles.sass)
		.pipe(plumber({ errorHandler : onError }))
		.pipe(sassImport())
		.pipe(sourcemap.init())
		.pipe(sass())
		.pipe(prefix({ cascade : false }))
		.pipe(sourcemap.write())
		.pipe(rename({
			extname : '.css'
		}))
		.pipe(gulp.dest(Site.paths.styles.dist))
		.pipe(notify({
			title:    'Gulp Sass - Compile Success',
			subtitle: Site.name,
			message:  'File: <%= file.relative %>'
		}));
});


// Minify our Sass and combine the media queries for livesites
// Call our 'sass-dev' compile task first (above)
gulp.task('sass', ['sass-dev'], function() {
	return gulp.src(Site.paths.styles.sass)
		.pipe(plumber({ errorHandler : onError }))
		.pipe(sassImport())
		.pipe(sass())
		.pipe(gmmq())
		.pipe(prefix({ cascade : false }))
		.pipe(minify())
		.pipe(rename({
			extname : '.min.css'
		}))
		.pipe(gulp.dest(Site.paths.styles.dist))
		.pipe(notify({
			title       : 'Gulp Sass - Minify Success',
			subtitle    : Site.name,
			message     : 'File: <%= file.relative %>'
		})); 
});


gulp.task('scripts', function(done) {
	glob(Site.paths.javascript.js, function(err, files) {

		if (err) done(err)

		var tasks = files.map(function(entry) {

			return browserify({ entries : [entry] })
				.transform(babelify, { 
					presets : ['es2015'], 
					plugins: [
					'transform-es2015-block-scoping',
				      [ 'transform-es2015-classes', { loose : true } ],
				      'transform-proto-to-assign',
      				]
				})
				.bundle()
				.on('error', function(err) {
					err.name = 'Error';
					notify.onError({
						title       : 'Gulp Error - Compile Failed',
						subtitle    : Site.name,
						message     : err.toString()
					})(err);
					this.emit('end');
				})
				.pipe(plumber({ errorHandler : onError }))
				.pipe(source(entry.split('/').reverse()[0]))
				.pipe(rename({
					extname : '.js'
				}))
				.pipe(gulp.dest(Site.paths.javascript.dist))
				.pipe(rename({
					extname : '.min.js'
				}))
				.pipe(buffer())
				.pipe(uglify())
				.pipe(gulp.dest(Site.paths.javascript.dist))
				.pipe(notify({
					title       : 'Gulp Javascript - Compile Success',
					subtitle    : Site.name,
					message     : 'File: <%= file.relative %>'
				}));
			});

		stream.merge(tasks).on('end', done);
	});
});


/*
 * Our Gulp task triggers
 * 
 */

// Create and compile our SVG icon library
// Called first in our parent 'icons' task (below)
gulp.task('library', function () {
	return gulp.src(Site.paths.images.library)
		.pipe(sprite({
			mode    : 'symbols',
			svgId   : 'icon-%f',
			svg     : { symbols : Site.paths.images.svg },
			preview : false
		}))
		.pipe(gulp.dest(Site.paths.images.icons));
});

// Remove the fill attribute on <paths> so we can style in our Sass
// Call our 'libary' compile task first (above)
gulp.task('icons', ['library'], function() {
	
	var data        = fs.readFileSync(Site.paths.images.icons + Site.paths.images.svg, 'utf-8'),
		removeFill  = data.replace(/fill="#[(a-z)(A-Z)(0-9)]{6}"/g, '');

	fs.writeFileSync(Site.paths.images.icons + Site.paths.images.svg, removeFill, 'utf-8');
});


gulp.task('watch-sass',     ['sass'],       function() { browserSync.reload(); });
gulp.task('watch-scripts',  ['scripts'],    function() { browserSync.reload(); });


// Watch our files for any changes
gulp.task('watch', function() {
	gulp.watch(Site.paths.styles.watch,     ['watch-sass']);
	gulp.watch(Site.paths.javascript.watch,	['watch-scripts']);
});


/*
 * Our Gulp task triggers
 * 
 */

// Default Task - use as for project initialisation
gulp.task('default', ['watch', 'sass', 'scripts'], function() {
	browserSync.init({
		proxy : Site.domain
	});
});
