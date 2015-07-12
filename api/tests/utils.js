"use strict";

// This file creates a common API for testing between node and the browser

// Further Reading (Chai):  http://chaijs.com/guide/styles/
// Further Reading (Mocha): http://mochajs.org/#getting-started
// Further Reading (Axios): https://github.com/mzabriskie/axios

/* ============================================================================================================== //
//
//    utils.isNode - Flag for node environment
//    utils.isBrowser - Flag for browser environment
//    utils.test - runs test in both Mocha and QUnit
//    utils.test_group - Mocha describe / Qunit module
//    utils.assert - chai assert
//    utils.expect - chai expect
//    utils.should - chai should - still use like regular should style
//
//    utils.login - call this function before you try and hit an api that needs authentication you can authenticate as a patient or specialist
//    utils.finish - calls finish function for tests in node and browser
//    utils.load - runs require if within node, within browser the file will be dynamically loaded as a script
//
//    utils.create_auth_headers - use this in third argument of utils.request to pass in auth headers to authenticate api calls
//    utils.create_url - create a url using your defined scheme and host
//    utils.create_api_url - create an api url using your defined scheme, host, and api prefix
//
//    utils.create_api_error - create error from api response
//    utils.create_caught_api_error - create error from api error response in .catch
//
//    utils.cache.set - store any data globally to be used in other places or files
//    utils.cache.get - retrieve any data set with utils.cache.set
//
// ================================================================================================================ */


// ==================================== Set Config as initial utils  ============================================== //

var utils = (typeof window === 'undefined') ? require('./config') : window.config || {};
utils.isNode = (typeof window === 'undefined') ? true : false;
utils.isBrowser = (utils.isNode) ? false : true;

// ==================================== Exported 3rd Party Functions  ============================================== //

if(utils.isNode) {
	utils.test = it;
	module.exports = utils;
	utils._describe = describe;
	utils.chai = require('chai');
	utils.request = require('axios');
} else {
	window.utils = utils;
	utils.test = QUnit.test;
	utils.chai = window.chai;
	utils.request = window.axios;
	utils._describe = QUnit.module;
	window.utils.web.host = window.location.host + '/';
}

// ==================================== Assertion Styles  =========================================================== //

utils.assert = utils.chai.assert;
utils.expect = utils.chai.expect,
utils.should = utils.chai.should();

// ==================================== Helper Functions For Both Environments ======================================= //

utils.cache = utils.cache || { data: {} };

utils.cache.set = function(key, data) {
	return utils.cache.data[key] = data;
}

utils.cache.get = function(key) {
	return utils.cache.data[key];
}

utils.load = function(module) {
	if(utils.isNode) return require(module);

	function addScript( src ) {
		var s = document.createElement( 'script' );
		s.setAttribute( 'src', src );
		document.body.appendChild( s );
	}

	return addScript(module.replace(/\.js$/, '') + '.js');
}

utils.login = function(type){
	var logout_url = utils.create_api_url("auth/logout");
	var login_url = utils.create_api_url("auth/login");

	return utils.request.get(logout_url).then(function(){
		return utils.request.post(login_url, {
			"name": utils.auth[type || 'intranet'].email,
			"password": utils.auth[type || 'intranet'].password
		});
	}).then(function(response){
		return utils.cache.set('auth_token', response.data.auth_token);
	}).catch(function(response){
		console.warn('\tLogin Error:', response.data);
		return utils.cache.set('auth_token', '');
	});
}

utils.finish = function(done, async, message) {
	if(typeof async === 'string') {
		message = async;
		async = undefined;
	}

	var pass = (message) ? false : true;
	if(utils.isBrowser) done.ok(pass, message);
	else done( message ? new Error(message) : null );
	if(async) async();
}

utils.async = function(done) {
	if(utils.isNode) return null;
	return done.async();
}

utils.test_group = function(description, tests){
	if(utils.isNode) return utils._describe(description, tests);
	 utils._describe(description); tests();
}

utils.create_auth_headers = function() {
	return { headers: {
		auth_token: utils.cache.get('auth_token')
	} };
}

utils.create_search_params = function() {
	return { params: {
		specialty: 2,
		filter: null,
		pagesize: 20,
		pageoffset: 0,
		sortorder: 'asc'
	} };
}

utils.create_autocomplete_params = function() {
	return { params: {
		records: 5,
		types: 'all',
		filter: 'francis'
	} };
}

utils.create_review_params = function() {
	return { params: {
		status_filter: 'created,flagged'
	} };
}

utils.create_url = function(url, insecure, host) {
	return ( insecure ? "http://" : utils.web.scheme ) +
		   ( host || utils.web.host ) + url + utils.web.port;
}

utils.create_api_url = function(api, insecure, host) {
	return ( insecure ? "http://" : utils.web.scheme ) +
		   ( host || utils.web.host ) + utils.web.api_prefix + api + utils.web.port;
}

utils.create_api_error = function(message, response) {
	var status = ( response && response.status || response.status === 0) ? "[ " + response.status + " ] " : "";
	var message = message || ( response && response.code ) || "Unknown Error";
	return status + message;
}

utils.create_caught_api_error = function(response, message) {
	message = message || ( response && response.statusText ) ? response.statusText : "";
	message = message || ( response && response.code ) ? response.code : "";
	message = message || JSON.stringify({ response: response }, null, 2)
	return utils.create_api_error(message, response);
}

utils.test_object_keys = function(obj, keys) {
	var pass = true;
	keys.forEach(function(key){
		if( !obj[key] ) return pass = false;
	});
	return pass;
}

utils.merge = function(target, source) {

	/* Merges two (or more) objects,
	   giving the last one precedence */

	if ( typeof target !== 'object' ) {
		target = {};
	}

	for (var property in source) {

		if ( source.hasOwnProperty(property) ) {

			var sourceProperty = source[ property ];

			if ( typeof sourceProperty === 'object' ) {
				target[ property ] = utils.merge( target[ property ], sourceProperty );
				continue;
			}

			target[ property ] = sourceProperty;

		}

	}

	for (var a = 2, l = arguments.length; a < l; a++) {
		merge(target, arguments[a]);
	}

	return target;
};
