/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
	isProduction = EmberApp.env() === 'production',
	isDevelopment = !isProduction;

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
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


  // CSS IMPORTS
  app.import('bower_components/select2/dist/css/select2.css');
  app.import("bower_components/font-awesome/css/font-awesome.css");
  //app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/materialize/dist/css/materialize.css');
  //app.import('bower_components/select2-bootstrap-css/select2-bootstrap.css');

  // JS IMPORTS
  app.import('bower_components/lodash/lodash.js');
  app.import('bower_components/velocity/velocity.js');
  app.import('bower_components/jquery/dist/jquery.js');

  app.import('bower_components/select2/dist/js/select2.js');
  app.import('bower_components/socket.io-client/socket.io.js');
  //app.import('bower_components/bootstrap/dist/js/bootstrap.js');
  app.import('bower_components/bluebird/js/browser/bluebird.js');
  app.import('bower_components/materialize/dist/js/materialize.js');

  // Vendor, Polyfill & Utils Import
  app.import('vendor/jquery-extensions.js');
  app.import('vendor/lodash-extensions.js');
  app.import('vendor/side-nav-material.js');
  app.import('vendor/request-animation-frame.js');

  // FONTS IMPORTS

  var mergeTrees = require('broccoli-merge-trees');
  var getFiles = require('broccoli-static-compiler');

  var fontawesome = getFiles('bower_components/font-awesome/fonts', {
	  srcDir: '/',
	  destDir: '/fonts'
  });

  var materialize = getFiles('bower_components/materialize/dist/font', {
	  srcDir: '/',
	  destDir: '/font'
  });

  return mergeTrees([ fontawesome, materialize, app.toTree() ]);
};
