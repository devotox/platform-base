import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(ResetScroll, SetupController, AuthenticatedRouteMixin, {
	pageName: 'account',

	global: Ember.inject.service(),

	model() {
		this._super(...arguments);
		this.store.findAll('user');
	},
	setupController() {
		this._super(...arguments);
		this.get('global').getUser().then( user => {
			console.log('ACCOUNT', user);
		});
	}
});
