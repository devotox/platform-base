import Ember from 'ember';

import Transform from 'ember-data/transform';

// Allows an object Attribute type
export default Transform.extend({
	deserialize: function(value) {
		return Ember.isNone(value) ? {} : value;
	},
	serialize: function(value) {
		return Ember.isNone(value) ? {} : value;
	}
});
