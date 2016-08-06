// TEST INDEX - MAIN FILE

// All Tests should be loaded in this file but broken up into different Modules
// only use util functions as it creates a common api for both node and browser
// Remember to always call `MochaUnit.finish(done);` at end of each test block

// After writing tests always check they run and pass in both environments
// using gulp test in the terminal and checking the browser at
// <website-or-intranet>/server/tests

// Further Reading (Chai):  http://chaijs.com/guide/styles/
// Further Reading (Mocha): http://mochajs.org/#getting-started
// Further Reading (Axios): https://github.com/mzabriskie/axios

// ==================================== REQUIRES ==================================================== //

if (typeof window === 'undefined') { var MochaUnit = require('./MochaUnit'); }

// ==================================== Initial Test / Samples ===================================== //

MochaUnit.test_group('Assertion Styles | Samples', function() {
	'use strict';

	MochaUnit.test('Assert Using `Expect` Style', function(done) {
		MochaUnit.expect(true).to.be.a('boolean');
		MochaUnit.finish(done);
	});

	MochaUnit.test('Assert Using `Should` Style', function(done) {
		true.should.be.a('boolean');
		MochaUnit.finish(done);
	});

	MochaUnit.test('Assert Using `Assert` Style', function(done) {
		MochaUnit.assert.typeOf(true, 'boolean');
		MochaUnit.finish(done);
	});
});

// ==================================== Functional / Unit Tests ======================================== //

MochaUnit.load('./unit/index');

MochaUnit.load('./model/index');

MochaUnit.load('./functional/index');
