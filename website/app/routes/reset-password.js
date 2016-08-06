import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(ResetScroll, SetupController, UnauthenticatedRouteMixin, {
	pageName: 'reset-password'
});
