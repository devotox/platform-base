// FUNCTIONAL TESTS

// only use util functions as it creates a common api for both node and browser
// Remember to always call `MochaUnit.finish(done);` at end of each test block

// After writing tests always check they run and pass in both environments
// using gulp test in the terminal and checking the browser at
// <website-or-intranet>/api/tests

// Further Reading (Chai):  http://chaijs.com/guide/styles/
// Further Reading (Mocha): http://mochajs.org/#getting-started
// Further Reading (Axios): https://github.com/mzabriskie/axios

// ==================================== REQUIRES ============================================================== //

if (typeof window === 'undefined') { var MochaUnit = require('../MochaUnit'); }

// ==================================== Tests ================================================== //

MochaUnit.test_group('Functional Test Stub 1 | Samples', function() {
	'use strict';

	MochaUnit.test('Functional Test 1', function(done) {
		MochaUnit.expect(true).to.be.a('boolean');
		MochaUnit.finish(done);
	});
});
