"use strict";

// ==================================== REQUIRES ==================================================== //

var gulp = require('gulp');
var pkg = require('./package.json');

var $ = require('gulp-load-plugins')({
	camelize: true
});

var handleError = function(err) {
	console.log(err.toString());
	this.emit('end');
}

var exit = function() {
	setTimeout(function() {
		process.exit(0);
	}, 100);
}

// ==================================== Default Task `gulp` ==================================================== //


gulp.task('default', ['watch']);


// ====================================  All Tasks ============================================================ //


gulp.task('serve', $.shell.task([
	'cd .. && node api/app.js'
]));

gulp.task('watch', $.shell.task([
	'cd .. && nodemon api/app.js --watch api --delay 0ms'
]));

gulp.task('test', function(){
	return gulp.src('')
		.pipe( $.shell(['export NODE_TLS_REJECT_UNAUTHORIZED=0']) )
		.pipe( gulp.src('tests/index.js', { read: false }) )
		.pipe( $.mocha({ reporter: 'spec', timeout: 20000 }) );
});
