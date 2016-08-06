/* globals it, describe, window, document */

// This file creates a common API for testing between node and the browser

// Further Reading (Chai):  http://chaijs.com/guide/styles/
// Further Reading (Mocha): http://mochajs.org/#getting-started
// Further Reading (Axios): https://github.com/mzabriskie/axios

/* ============================================================================================================== //
//
//    MochaUnit.is_node - Flag for node environment
//    MochaUnit.is_browser - Flag for browser environment
//    MochaUnit.test - runs test in both Mocha and QUnit
//    MochaUnit.test_group - Mocha describe / Qunit module
//    MochaUnit.assert - chai assert
//    MochaUnit.expect - chai expect
//    MochaUnit.should - chai should - still use like regular should style
//
//    MochaUnit.login - call this function before you try and hit an api that needs authentication you can authenticate as a patient or specialist
//    MochaUnit.finish - calls finish function for tests in node and browser
//    MochaUnit.load - runs require if within node, within browser the file will be dynamically loaded as a script
//
//    MochaUnit.create_auth_header - use this in third argument of MochaUnit.request to pass in auth headers to authenticate api calls
//    MochaUnit.create_url - create a url using your defined scheme and host
//    MochaUnit.create_api_url - create an api url using your defined scheme, host, and api prefix
//
//    MochaUnit.create_api_error - create error from api response
//    MochaUnit.create_caught_api_error - create error from api error response in .catch
//
//    MochaUnit.cache.set - store any data globally to be used in other places or files
//    MochaUnit.cache.get - retrieve any data set with MochaUnit.cache.set
//
// ================================================================================================================ */

// ==================================== Set Config as initial MochaUnit  ============================================== //
(function() {
	'use strict';

	var MochaUnit = {};

	try {
		MochaUnit.config = (typeof window === 'undefined') ? require('./config') : (window.config || {});
	} catch (error) {}

	MochaUnit.is_node = (typeof window === 'undefined') ? true : false;
	MochaUnit.is_browser = (MochaUnit.is_node) ? false : true;

	// ==================================== Exported 3rd Party Functions  ============================================== //

	if (MochaUnit.is_node) {
		MochaUnit._test = it;
		module.exports = MochaUnit;
		MochaUnit._describe = describe;
		MochaUnit._ = require('lodash');
		MochaUnit.chai = require('chai');
		MochaUnit.request = require('axios');
		MochaUnit.promise = require('bluebird');
	} else {
		MochaUnit._ = window._;
		window.MochaUnit = MochaUnit;
		MochaUnit.chai = window.chai;
		MochaUnit.request = window.axios;
		MochaUnit.promise = window.Promise;
		MochaUnit._test = window.QUnit.test;
		MochaUnit._describe = window.QUnit.module;
		window.MochaUnit.config.web.host = window.location.host + '/';
	}

	// ==================================== Assertion Styles  =========================================================== //

	MochaUnit.assert = MochaUnit.chai.assert;
	MochaUnit.expect = MochaUnit.chai.expect;
	MochaUnit.should = MochaUnit.chai.should();

	// ==================================== Helper Functions For Both Environments ======================================= //

	MochaUnit.cache = MochaUnit.cache || { data: {} };

	MochaUnit.cache.set = function(key, data) {
		return MochaUnit.cache.data[key] = data;
	};

	MochaUnit.cache.get = function(key) {
		return MochaUnit.cache.data[key];
	};

	MochaUnit.timeout = function(time, command) {
		return setTimeout(command, time);
	};

	MochaUnit.random = function(low, high) {
		low = low || 0; high = high || 10;
		return Math.floor(Math.random() * (high - low + 1) + low);
	};

	MochaUnit.test = function(name, command, time) {
		if (!time || MochaUnit.is_node) {
			return MochaUnit._test(name, command);
		}

		if (time && time.promise) {
			return time.promise.then(function() {
				MochaUnit._test(name, command);
			});
		}

		MochaUnit.timeout(time, function() {
			MochaUnit._test(name, command);
		});
	};

	MochaUnit.test_group = function(description, tests, time) {
		if (!time || MochaUnit.is_node) {
			return MochaUnit._test_group(description, tests);
		}

		if (time && time.promise) {
			return time.promise.then(function() {
				MochaUnit._test_group(description, tests);
			});
		}

		MochaUnit.timeout(time, function() {
			MochaUnit._test_group(description, tests);
		});
	};

	MochaUnit._test_group = function(description, tests) {
		if (MochaUnit.is_node) {
			return MochaUnit._describe(description, tests);
		} else {
			MochaUnit._describe(description); tests();
		}
	};

	MochaUnit.test_object_keys = function(obj, keys) {
		var pass = true;
		MochaUnit._.forEach(keys, function(key) {
			if (MochaUnit._.isNull(obj[key]) ||
				MochaUnit._.isUndefined(obj[key])) { return pass = false; }
		});
		return pass;
	};

	MochaUnit.load = function(module) {
		if (MochaUnit.is_node) { return require(module); }

		function addScript(src) {
			var s = document.createElement('script');
			document.body.appendChild(s);
			s.setAttribute('src', src);
		}

		return addScript(module.replace(/\.js$/, '') + '.js');
	};

	MochaUnit.finish = function(done, async, message) {
		if (typeof async === 'string') {
			message = async;
			async = undefined;
		}

		var pass = message ? false : true;
		if (MochaUnit.is_browser) { done.ok(pass, message); }
		else { done(message ? new Error(message) : null); }
		if (async) { async(); }
	};

	MochaUnit.async = function(done) {
		if (MochaUnit.is_node) { return null; }
		return done.async();
	};

	MochaUnit.create_url = function(url, insecure, host) {
		return (insecure ? 'http://' : MochaUnit.config.web.scheme) +
				(host || MochaUnit.config.web.host) + url + MochaUnit.config.web.port;
	};

	MochaUnit.create_api_url = function(api, insecure, host) {
		return (insecure ? 'http://' : MochaUnit.config.web.scheme) +
				(host || MochaUnit.config.web.host) + MochaUnit.config.web.api_prefix + api + MochaUnit.config.web.port;
	};

	MochaUnit.create_api_error = function(message, response) {
		var status = (response && response.status || response.status === 0) ? '[ ' + response.status + ' ] ' : '';
		message = message || (response && response.code) || 'Unknown Error';
		return status + message;
	};

	MochaUnit.create_caught_api_error = function(response, message) {
		message = message || (response && response.statusText) ? response.statusText : '';
		message = message || (response && response.code) ? response.code : '';
		message = message || JSON.stringify({ response: response }, null, 2);
		return MochaUnit.create_api_error(message, response);
	};

	MochaUnit.create_auth_header = function(user_type) {
		var token_name = ((user_type || 'account') + '_auth_token').replace(/^\_/, '');
		return { headers: {
			auth_token: MochaUnit.cache.get(token_name)
		} };
	};

	MochaUnit.create_referer_header = function() {
		if (MochaUnit.is_browser) { return {}; }
		return { headers: {
			referer: MochaUnit.config.web.referer
		} };
	};
}).call(this);
