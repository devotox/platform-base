/* jshint node:true */
/* global require, module */

'use strict';

let EmberApp 			= require('ember-cli/lib/broccoli/ember-app'),
	getFiles 			= require('broccoli-static-compiler'),
	removeFile			= require('broccoli-file-remover'),
	mergeTrees 			= require('broccoli-merge-trees'),
	isProduction 		= EmberApp.env() === 'production',
	manifest 			= require('broccoli-manifest'),
	isDevelopment 		= !isProduction;

console.info('ENVIRONMENT:', EmberApp.env());

module.exports = function(defaults) {
	let app = new EmberApp(defaults, {
		tests: isDevelopment,
		hinting: isDevelopment,
		wrapInEval: isDevelopment,
		storeConfigInMeta: isDevelopment,

		minifyCSS: {
			enabled: isProduction
		},
		minifyJS: {
			enabled: isProduction
		},
		sourcemaps: {
			enabled: isDevelopment
		},
		fingerprint: {
			enabled: isProduction
		},
		"inject-head": {
			"template": "app/templates/site-components/head/head.hbs",
			"context": {
				"title": "Zenunu",
				"site_name": "Zenunu",
				"twitter": "@d-tox.ltd",
				"social_url": "//dtox.noip.me",
				"description": "Help Your Kid's Language Skills Today",
				"social_image_logo": "//dtox.noip.me/assets/images/brand/brand-image-dark.png"
			}
		}
	});

	// Use `app.import` to add additional libraries to the generated
	// output files.
	//
	// If you need to use different assets in different
	// environments, specify an object as the first parameter. That
	// object's keys should be the environment name and the values
	// should be the asset to use in that environment.
	//
	// If the library that you are including contains AMD or ES6
	// modules that you would like to import into your application
	// please specify an object with the list of modules as keys
	// along with the exports of each module as its value.

	// CHOOSE BETWEEN MATERIALIZE AND BOOTSTRAP ... DON'T USE BOTH!

	// CSS IMPORTS
	app.import('bower_components/animate.css/animate.css');
	app.import('bower_components/normalize-css/normalize.css');
	app.import('bower_components/select2/dist/css/select2.css');
	app.import('bower_components/sweetalert/dist/sweetalert.css');
	app.import('bower_components/font-awesome/css/font-awesome.css');
	//app.import('bower_components/bootstrap/dist/css/bootstrap.css');
	app.import('bower_components/materialize/dist/css/materialize.css');

	// Shims
	app.import('bower_components/es5-shim/es5-shim.js');
	app.import('bower_components/es5-shim/es5-sham.js');
	app.import('bower_components/es6-shim/es6-shim.js');
	app.import('bower_components/es6-shim/es6-sham.js');

	// Polyfills
	app.import('bower_components/base64/base64.js');
	app.import('bower_components/json3/lib/json3.js');
	app.import('bower_components/console-polyfill/index.js');
	app.import('bower_components/animation-frame/AnimationFrame.js');

	// JS IMPORTS
	app.import('bower_components/typed.js/js/typed.js');
	app.import('bower_components/select2/dist/js/select2.js');
	app.import('bower_components/sweetalert/dist/sweetalert-dev.js');

	//app.import('bower_components/bootstrap/dist/js/bootstrap.js');
	app.import('bower_components/materialize/dist/js/materialize.js');

	// Vendor Imports
	app.import('vendor/primus.js');
	app.import('vendor/recorder.js');
	app.import('vendor/modernizr-custom.js');

	// JQuery extensions
	app.import('vendor/jquery-extensions.js');
	app.import('vendor/jquery-material-extensions.js');

	// Font Imports
	let fontawesome = getFiles('bower_components/font-awesome/fonts', {
		srcDir: '/',
		destDir: '/fonts'
	});

	let materialize = getFiles('bower_components/materialize/dist/fonts', {
		srcDir: '/',
		destDir: '/fonts'
	});

	// Build Trees
	let appTree = app.toTree();
	let completeTree = mergeTrees([ fontawesome, materialize, appTree ], { overwrite: true });

	// Remove specific files from tree
	let minimizedTree = removeFile(completeTree, { paths: [ ] });
	let manifestTree = manifest(minimizedTree);

	// Create final tree
	let finalTree = mergeTrees([ minimizedTree, manifestTree ], { overwrite: true });

	// Return Merged Trees
	return finalTree;
};
