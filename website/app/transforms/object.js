import Ember from 'ember';

import DS from 'ember-data';

// Allows an object Attribute type
export default DS.Transform.extend({
	deserialize: function(serialized) {
		return Ember.isNone(serialized) ? {} : serialized;
	},
	serialize: function(deserialized) {
		return Ember.isNone(deserialized) ? {} : deserialized;
	}
});