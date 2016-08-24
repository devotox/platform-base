import Ember from 'ember';

export default Ember.Controller.extend({
	user: Ember.inject.service(),

	global: Ember.inject.service(),

	device: Ember.inject.service(),

	session: Ember.inject.service()
});
