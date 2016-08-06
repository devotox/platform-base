// UNIT TESTS

// only use util functions as it creates a common api for both node and browser
// Remember to always call `MochaUnit.finish(done);` at end of each test block

// Unit tests should only need to run in node as they can never be run on the browser

// Further Reading (Chai):  http://chaijs.com/guide/styles/
// Further Reading (Mocha): http://mochajs.org/#getting-started
// Further Reading (Axios): https://github.com/mzabriskie/axios

// ==================================== REQUIRES ==================================================== //

if (typeof window === 'undefined') { var MochaUnit = require('../MochaUnit'); }

// ==================================== Tests ================================================== //

MochaUnit.test_group('Unit Test Stub 1 | Samples', function() {
	'use strict';

	MochaUnit.test('Unit Test 1', function(done) {
		MochaUnit.expect(true).to.be.a('boolean');
		MochaUnit.finish(done);
	});
});
