import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(ResetScroll, SetupController, AuthenticatedRouteMixin, {
	pageName: 'account',

	user: Ember.inject.service(),

	model() {
		return this.get('user').getUser(true, true);
	}
});
