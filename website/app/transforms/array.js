import Ember from 'ember';

import Transform from 'ember-data/transform';

// Allows an object Attribute type
export default Transform.extend({
	deserialize: function(value) {
		return Ember.isArray(value) ? Ember.A(value) : Ember.A();
	},
	serialize: function(value) {
		return Ember.isArray(value) ? Ember.A(value) : Ember.A();
	}
});
