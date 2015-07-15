"use strict";

// ==================================== REQUIRES ==================================================== //

var gulp = require('gulp');
var pkg = require('./package.json');
var current_directory = process.cwd();

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

var ucfirst = function(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
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

var linkModules = function(directory){
	var config = {
		tests: ['.jshintrc'],
		public: ['humans.txt'],
		remove: ['bower_components/bower_components', 'node_modules/node_modules'],
		root: ['node_modules', 'bower_components', 'package.json', 'bower.json', '.editorconfig', '.watchmanconfig', '.travis.yml', 'testem.json', '.jscsrc', '.jshintrc', '.bowerrc']
	}
	var arr = [];

	var addLink = function(file, destination, cmd){
		cmd = cmd || 'ln -sf';
		var path = [ current_directory, '/', file ].join('');
		destination = [ directory, destination || ''].join('');

		arr.push([ 'test -d', directory, '&& cd', destination, '&&', cmd, path, file, '|| echo "[ Link ]" No', ucfirst(directory), 'Folder' ].join(' '));
	};

	config.root.forEach(function(file){
		addLink(file);
	});

	config.public.forEach(function(file){
		addLink(file, '/public');
	});

	config.tests.forEach(function(file){
		addLink(file, '/tests');
	});

	config.remove.forEach(function(file){
		addLink(file, null, 'rm -rf');
	});

	return arr;
};

gulp.task('link-api', $.shell.task(linkModules('api')));

gulp.task('link-app', $.shell.task(linkModules('app')));

gulp.task('link-website', $.shell.task(linkModules('website')));

gulp.task('link-intranet', $.shell.task(linkModules('intranet')));

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
