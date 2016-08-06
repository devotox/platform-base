/* jshint node: true, browser: false */
/* globals global, require, process, -$ */

'use strict';
// ==================================== REQUIRES ==================================================== //

let gulp = require('gulp');

let path = require('path');

let run_sequence = require('run-sequence');

let $ = require('gulp-load-plugins')({
	camelize: true
});

let exit = function() {
	setTimeout(function() {
		process.exit(0);
	}, 100);
};

global.api_path = path.join(__dirname, '/');


// ==================================== Default Task `gulp` ==================================================== //


gulp.task('default', ['run']);


// ====================================  Serve / Watch Tasks ============================================================ //

// Application Flow
// Production - pm2 -> app.js || server.js (forever) -> app.js
// Development - app-dev.js -> app.js ( nodemon / node inspector )
// server.js - Runs forever monitor and watches for exit codes to restart server
// cluster.js - Runs recluster and sets the amount of workers to use for application based on number of controller_version
// app-dev.js - Runs nodemon and node inspector together
// app.js - Runs actual server application

gulp.task('run', $.shell.task([
	'node app.js'
]));

gulp.task('start', $.shell.task([
	'node server.js'
]));

gulp.task('serve', $.shell.task([
	//'DEBUG=loopback:connector:postgresql nodemon --inspect=9999 --debug app-dev.js'
	'nodemon --inspect=9999 --debug app.js'
	//'node app-dev.js'
]));

gulp.task('start-prod', $.shell.task([
	`pm2 start app.js -i max --no-daemon ||
	 node server.js ||
	 node app.js`
]));

gulp.task('build-start-dev', $.shell.task([
	`(cd ../intranet && ember build dist --environment=development | tee -a /var/log/intranet/intranet.log) &
	 (cd ../website && grunt build | tee -a /var/log/website/website.log) &
	 cd ../api && gulp serve`
]));

gulp.task('build-start-prod', $.shell.task([
	`(cd ../intranet && ember build dist --environment=production | tee -a /var/log/intranet/intranet.log) &
	 (cd ../website && grunt build-prod | tee -a /var/log/website/website.log) &
	 cd ../api && gulp start-prod`
]));

gulp.task('build-start-intranet', $.shell.task([
	`(cd ../intranet && ember build dist --environment=production | tee -a /var/log/intranet/intranet.log) &
	 cd ../api && gulp start-prod`
]));

gulp.task('build-start-website', $.shell.task([
	`(cd ../website && grunt build-prod | tee -a /var/log/website/website.log) &
	 cd ../api && gulp start-prod`
]));

// ====================================  Test ============================================================ //

gulp.task('clean-test-reports', $.shell.task([
	'test -d test-reports && rm -rf test-reports || echo "[ Clean Test Reports ] No Test Reports Folder"',
	'test -d test-coverage && rm -rf test-coverage || echo "[ Clean Test Coverage ] No Test Coverage Folder"'
]));

gulp.task('istanbul', function () {
	return gulp.src(['./**/*.js',
		'!./index.js', '!./gulpfile.js',
		'!./{test-coverage,test-coverage/**}',
		'!./bower_components/**',
		'!./node_modules/**'])
		.pipe($.istanbul({ includeUntested: true }))
		.pipe($.istanbul.hookRequire());
});

gulp.task('jsinspect', function () {
	return gulp.src(['./**/*.js','!./tests/**',
		'!./{test-coverage,test-coverage/**}',
		'!./bower_components/**',
		'!./node_modules/**'])
		.pipe($.jsinspect({
			'suppress': 0,
			'threshold': 50,
			'identifiers': true
		}));
});

gulp.task('lint', function() {
	return gulp.src(['./**/*.js',
		'!./{test-coverage,test-coverage/**}',
		'!./bower_components/**',
		'!./node_modules/**'])
		.pipe( $.jshint() )
		.pipe( $.jshint.reporter('jshint-stylish') )
		.pipe( $.jshint.reporter('fail') );
});

gulp.task('lint-jenkins', function() {
	return gulp.src(['./**/*.js',
		'!./{test-coverage,test-coverage/**}',
		'!./bower_components/**',
		'!./node_modules/**'])
		.pipe( $.jshint() )
		.pipe( $.jshint.reporter('gulp-checkstyle-jenkins-reporter', {
			filename:'./test-reports/api-jshint-tests-report.xml'
		}) );
});

gulp.task('mocha', function(){
	return gulp.src('tests/index.js')
		.pipe( $.shell(['export NODE_TLS_REJECT_UNAUTHORIZED=0']) )
		.pipe( gulp.src('tests/index.js', { read: false }) )
		.pipe( $.mocha({ reporter: 'spec', timeout: 20000 }) )
		.pipe( $.istanbul.writeReports({dir: './test-coverage'}) )
		.on('end', function(){ return gulp.start('clean-test-reports'); });
});

gulp.task('mocha-jenkins', function(){
	return gulp.src('tests/index.js')
		.pipe( $.shell(['export NODE_TLS_REJECT_UNAUTHORIZED=0']) )
		.pipe( gulp.src('tests/index.js', { read: false }) )
		.pipe( $.mocha({
			timeout: 20000,
			reporter: 'mocha-jenkins-reporter',
			reporterOptions: {
				junit_report_stack: 1,
				junit_report_name: 'API Tests',
				junit_report_path: './test-reports/api-mocha-tests-report.xml'
			}
		}) )
		.pipe( $.istanbul.writeReports({
			dir: './test-coverage',
			reporters: [ 'lcov', 'json', 'text', 'text-summary', 'cobertura' ]
		}) )
		.pipe($.istanbul.enforceThresholds({ thresholds: { global: 0 } }));
});

gulp.task('test', function(done) {
	return run_sequence('istanbul', 'jsinspect', 'lint', 'mocha', function() {
		exit(); done();
	});
});

gulp.task('test-jenkins', function(done){
	return run_sequence('clean-test-reports', 'istanbul', 'jsinspect', 'lint-jenkins', 'mocha-jenkins', function() {
		exit(); done();
	});
});
