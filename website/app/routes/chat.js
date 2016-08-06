import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {
	pageName: 'chat',

	crypto: Ember.inject.service(),
	
	setupController(controller) {
		this._super(...arguments);
		let uuid = this.get('crypto').uuid(6);
		controller.set('username', 'user-' + uuid);
	}
});
