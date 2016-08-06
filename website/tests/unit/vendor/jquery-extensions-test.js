import Ember from 'ember';

import { moduleFor, test } from 'ember-qunit';


moduleFor('route:about', 'Extensions | JQuery', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('jquery exists', function(assert) {
  assert.ok(Ember.$);
});

test('redraw', function(assert){
	assert.ok( Ember.$('<div/>').redraw() );
});

test('materialize nav', function(assert){
	assert.ok( Ember.$('<div/>').materialNav() );
});

test('materialize form', function(assert){
	assert.ok( Ember.$('<form/>').materialForm() );
});

test('password reveal', function(assert){
	assert.ok( Ember.$('<input type="password"/>').passwordReveal() );
});
