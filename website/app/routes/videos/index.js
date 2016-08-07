import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {

	queryParams: {
		q: {
			refreshModel: true
		},
		local: {
			refreshModel: true
		}
	},

	model(params) {
		return this.store.query('video', { local: params.local });
	},
	setupController(controller, model, transition) {
		this._super(...arguments);
		controller.set('search', transition.queryParams.q);
	}
});
