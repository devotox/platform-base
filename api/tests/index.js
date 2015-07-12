"use strict";

// TEST INDEX - MAIN FILE

// All Tests should be loaded in this file but broken up into different Modules
// only use util functions as it creates a common api for both node and browser
// Remember to always call `utils.finish(done);` at end of each test block

// After writing tests always check they run and pass in both environments
// using gulp test in the terminal and checking the browser at
// <website-or-intranet>/api/tests

// Further Reading (Chai):  http://chaijs.com/guide/styles/
// Further Reading (Mocha): http://mochajs.org/#getting-started
// Further Reading (Axios): https://github.com/mzabriskie/axios

// ==================================== REQUIRES ==================================================== //

if(typeof window === 'undefined') var utils = require('./utils');

// ==================================== Initial Test / Samples ===================================== //

utils.test_group('Assertion Styles | Samples', function(){
	utils.test( "Assert Using `Expect` Style", function( done ) {
		utils.expect(true).to.be.a("boolean");
		utils.finish(done);
	});

	utils.test( "Assert Using `Should` Style", function( done ) {
		true.should.be.a("boolean");
		utils.finish(done);
	});

	utils.test( "Assert Using `Assert` Style", function( done ) {
		utils.assert.typeOf(true, "boolean");
		utils.finish(done);
	});
});

// ==================================== Functional / Unit Tests ======================================== //

utils.load('./functional/index');

utils.load('./unit/index');
