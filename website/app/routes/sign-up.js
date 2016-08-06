import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(ResetScroll, SetupController, UnauthenticatedRouteMixin, {
	pageName: 'sign-up',

	actions: {
		success() {
			this.transitionTo('home');
			this.send('apiMessage', {
				timeout: 6000,
				type: 'success',
				text: '<b>Sign Up Successful!</b><div>Check your email for the verification link</div>'
			});
		}
	}
});
