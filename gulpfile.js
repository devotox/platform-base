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


gulp.task('default', ['start-dev']);


// ==================================== Update App Version ==================================================== //


gulp.task('set-version', function(){
	gulp.src('./package.json')
		.pipe($.bump({ indent: 2, key: 'version', version: '1.0.0' }))
		.pipe(gulp.dest('./'));

	gulp.src('./bower.json')
		.pipe($.bump({ indent: 2, key: 'version', version: '1.0.0' }))
		.pipe(gulp.dest('./'));
});

gulp.task('update-version-patch', function(){
	gulp.src('./package.json')
		.pipe($.bump({ indent: 2, key: 'version', type: 'patch' }))
		.pipe(gulp.dest('./'));

	gulp.src('./bower.json')
		.pipe($.bump({ indent: 2, key: 'version', type: 'patch' }))
		.pipe(gulp.dest('./'));
});

gulp.task('update-version-minor', function(){
	gulp.src('./package.json')
		.pipe($.bump({ indent: 2, key: 'version', type: 'minor' }))
		.pipe(gulp.dest('./'));

	gulp.src('./bower.json')
		.pipe($.bump({ indent: 2, key: 'version', type: 'minor' }))
		.pipe(gulp.dest('./'));
});

gulp.task('update-version-major', function(){
	gulp.src('./package.json')
		.pipe($.bump({ indent: 2, key: 'version', type: 'major' }))
		.pipe(gulp.dest('./'));

	gulp.src('./bower.json')
		.pipe($.bump({ indent: 2, key: 'version', type: 'major' }))
		.pipe(gulp.dest('./'));
});


// ==================================== Install Global NPM Modules ==================================================== //


gulp.task('install-globals', $.shell.task([
	'test -d /usr/local/bin/npm && npm install -g npm || echo "[ Install Globals ] npm installed"',
	'test -d /usr/local/bin/gulp && npm install -g gulp || echo "[ Install Globals ] gulp installed"',
	'test -d /usr/local/bin/bower && npm install -g bower || echo "[ Install Globals ] bower installed"',
	'test -d /usr/local/bin/ember && npm install -g ember-cli || echo "[ Install Globals ] ember cli installed"',
	'test -d /usr/local/bin/grunt && npm install -g grunt-cli || echo "[ Install Globals ] grunt cli installed"',
	'test -d /usr/local/bin/broccoli && npm install -g broccoli-cli || echo "[ Install Globals ] broccoli cli installed"',

	'test -d /usr/local/bin/cordova && npm install -g cordova || echo "[ Install Globals ] cordova installed"',
	'test -d /usr/local/bin/forever && npm install -g forever || echo "[ Install Globals ] forever installed"',
	'test -d /usr/local/bin/nodemon && npm install -g nodemon || echo "[ Install Globals ] nodemon installed"',
	'test -d /usr/local/bin/phantomjs && npm install -g phantomjs || echo "[ Install Globals ] phantom js installed"',
	'test -d /usr/local/bin/node-inspector && npm install -g node-inspector || echo "[ Install Globals ] node inspector installed"'
]));

gulp.task('update-globals', $.shell.task([
	'npm update -g || echo "[ Update Globals ] Error while updating globals"',
]));


// ==================================== Build Tasks (Development) ==================================================== //


gulp.task('build-website', $.shell.task([
	'test -d website && cd website && rm -rf dist && EMBER_CLI_CORDOVA=0 ember build dist --environment=development || echo "[ Build Dev ] No Website Folder"'
]));

gulp.task('build-app', $.shell.task([
	'test -d app && cd app && rm -rf dist && EMBER_CLI_CORDOVA=0 ember build dist --environment=development || echo "[ Build Dev ] No App Folder"'
]));

gulp.task('build-intranet', $.shell.task([
	'test -d intranet && cd intranet && rm -rf dist && EMBER_CLI_CORDOVA=0 ember build dist --environment=development || echo "[ Build Dev ] No Intranet Folder"'
]));

gulp.task('build', ['build-website'/*, 'build-app', 'build-intranet'*/], function() {
	exit();
});


// ==================================== Build Tasks (Production) ==================================================== //


gulp.task('build-website-prod', $.shell.task([
	'test -d website && cd website && rm -rf dist && EMBER_CLI_CORDOVA=0 ember build dist --environment=production || echo "[ Build Prod ] No Website Folder"'
]));

gulp.task('build-app-prod', $.shell.task([
	'test -d app && cd app && rm -rf dist && EMBER_CLI_CORDOVA=0 ember build dist --environment=production || echo "[ Build Prod ] No App Folder"'
]));

gulp.task('build-intranet-prod', $.shell.task([
	'test -d intranet && cd intranet && rm -rf dist && EMBER_CLI_CORDOVA=0 ember build dist --environment=production || echo "[ Build Prod ] No Intranet Folder"'
]));

gulp.task('build-prod', ['build-website-prod'/*, 'build-app-prod', 'build-intranet-prod'*/], function() {
	exit();
});


// ==================================== Serve && Watch ==================================================== //


gulp.task('alert-build', $.shell.task([
	"osascript -e 'display notification \"Building Application...\" with title \"Application Server\"'",
]));

gulp.task('serve-website', $.shell.task([
	'test -d website && cd website && rm -rf dist && EMBER_CLI_CORDOVA=0 ember serve || echo "[ Serve ] No Website Folder"'
]));

gulp.task('serve-app', $.shell.task([
	'test -d app && cd app && rm -rf dist && EMBER_CLI_CORDOVA=0 ember serve || echo "[ Serve ] No App Folder"'
]));

gulp.task('serve-intranet', $.shell.task([
	'test -d intranet && cd intranet && rm -rf dist && EMBER_CLI_CORDOVA=0 ember serve || echo "[ Serve ] No Intranet Folder"'
]));

gulp.task('serve', ['alert-build', 'serve-website'/*, 'serve-app', 'serve-intranet'*/], function() {
	exit();
});


// ==================================== Test ==================================================== //


gulp.task('test-api', $.shell.task([
	'test -d api && cd api && gulp test || echo "[ API ] No API Folder"'
]));

gulp.task('test-website', $.shell.task([
	'test -d website && cd website && rm -rf dist && EMBER_CLI_CORDOVA=0 ember test || echo "[ Test ] No Website Folder"'
]));

gulp.task('test-app', $.shell.task([
	'test -d app && cd app && rm -rf dist && EMBER_CLI_CORDOVA=0 ember test || echo "[ Test ] No App Folder"'
]));

gulp.task('test-intranet', $.shell.task([
	'test -d intranet && cd intranet && rm -rf dist && EMBER_CLI_CORDOVA=0 ember test || echo "[ Test ] No Intranet Folder"'
]));

gulp.task('test', ['test-api', 'test-website'/*, 'test-app', 'test-intranet'*/], function() {
	exit();
});


// ==================================== Link ==================================================== //


gulp.task('link-app', $.shell.task([
	'test -d app && cd app && ln -sf ../node_modules node_modules && ln -sf ../bower_components bower_components || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../.watchmanconfig .watchmanconfig || echo "[ Link ] No App Folder"',
	'test -d app && cd app/public && ln -sf ../../humans.txt humans.txt || echo "[ Link ] No App Folder"',
	'test -d app && cd app/tests  && ln -sf ../../.jshintrc .jshintrc || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../.editorconfig .editorconfig || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../package.json package.json || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../testem.json testem.json || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../.travis.yml .travis.yml || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../bower.json bower.json || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../.jshintrc .jshintrc || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../.bowerrc .bowerrc || echo "[ Link ] No App Folder"',
	'test -d app && cd app && ln -sf ../.jscsrc .jscsrc || echo "[ Link ] No App Folder"',

	'test -d app && cd app && rm -rf bower_components/bower_components || echo "[ Link ] No App Folder"',
	'test -d app && cd app && rm -rf node_modules/node_modules || echo "[ Link ] No App Folder"'
]));

gulp.task('link-intranet', $.shell.task([
	'test -d intranet && cd intranet && ln -sf ../node_modules node_modules && ln -sf ../bower_components bower_components || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../.watchmanconfig .watchmanconfig || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet/public && ln -sf ../../humans.txt humans.txt || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet/tests  && ln -sf ../../.jshintrc .jshintrc || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../.editorconfig .editorconfig || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../package.json package.json || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../testem.json testem.json || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../.travis.yml .travis.yml || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../bower.json bower.json || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../.jshintrc .jshintrc || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../.bowerrc .bowerrc || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && ln -sf ../.jscsrc .jscsrc || echo "[ Link ] No Intranet Folder"',

	'test -d intranet && cd intranet && rm -rf bower_components/bower_components || echo "[ Link ] No Intranet Folder"',
	'test -d intranet && cd intranet && rm -rf node_modules/node_modules || echo "[ Link ] No Intranet Folder"'
]));

gulp.task('link-website', $.shell.task([
	'test -d website && cd website && ln -sf ../node_modules node_modules && ln -sf ../bower_components bower_components || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../.watchmanconfig .watchmanconfig || echo "[ Link ] No Website Folder"',
	'test -d website && cd website/public && ln -sf ../../humans.txt humans.txt || echo "[ Link ] No Website Folder"',
	'test -d website && cd website/tests  && ln -sf ../../.jshintrc .jshintrc || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../.editorconfig .editorconfig || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../package.json package.json || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../testem.json testem.json || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../.travis.yml .travis.yml || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../bower.json bower.json || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../.jshintrc .jshintrc || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../.bowerrc .bowerrc || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && ln -sf ../.jscsrc .jscsrc || echo "[ Link ] No Website Folder"',

	'test -d website && cd website && rm -rf bower_components/bower_components || echo "[ Link ] No Website Folder"',
	'test -d website && cd website && rm -rf node_modules/node_modules || echo "[ Link ] No Website Folder"'
]));

gulp.task('link-api', $.shell.task([
	'test -d api && cd api && ln -sf ../node_modules node_modules && ln -sf ../bower_components bower_components || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../.watchmanconfig .watchmanconfig || echo "[ Link ] No API Folder"',
	'test -d api && cd api/tests  && ln -sf ../../.jshintrc .jshintrc || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../.editorconfig .editorconfig || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../package.json package.json || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../testem.json testem.json || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../.travis.yml .travis.yml || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../bower.json bower.json || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../.jshintrc .jshintrc || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../.bowerrc .bowerrc || echo "[ Link ] No API Folder"',
	'test -d api && cd api && ln -sf ../.jscsrc .jscsrc || echo "[ Link ] No API Folder"',

	'test -d api && cd api && rm -rf bower_components/bower_components || echo "[ Link ] No API Folder"',
	'test -d api && cd api && rm -rf node_modules/node_modules || echo "[ Link ] No API Folder"'
]));


gulp.task('link', ['link-api', 'link-website'/*, 'link-app', 'link-intranet'*/], function() {
	exit();
});


// ==================================== Stop Node ==================================================== //


gulp.task('stop', $.shell.task([
	'sudo killall -9 node || killall -9 node || echo "[ Stop Node ] No Node Process to Kill"',
	'watchman shutdown-server || echo "[ Stop Watchman ] No Watchman Server to Kill"'
]));


// ==================================== Start API ==================================================== //


gulp.task('start-api', $.shell.task([
	'node api/server.js || node api/app.js'
]));

gulp.task('start-api-dev', $.shell.task([
	'nodemon api/app.js --watch api --delay 0ms || node api/app.js'
]));

gulp.task('start-api-prod', $.shell.task([
	'forever start --verbose --minUptime 100 --spinSleepTime 100 -a -o /var/log/forever/stdout.log -e /var/log/forever/stderr.log -l /var/log/forever/forever.log --pidFile /var/run/forever.pid api/app.js || node api/app.js'
]));

// ==================================== Start Application ==================================================== //


gulp.task('start', ['start-api']);

gulp.task('start-dev', ['serve', 'start-api-dev']);

gulp.task('start-prod', ['build-prod', 'start-api-prod']);
