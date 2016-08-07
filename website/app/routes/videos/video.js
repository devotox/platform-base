import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {
	pageName: 'videos',

	queryParams: {
		q: {
			refreshModel: true
		},
		local: {
			refreshModel: true
		}
	},

	model(params) {
		this.store.findRecord('video', params.id, {
			adapterOptions: {
				query: {
					local: params.local
				}
			}
		}).then( (model) => {
			this.controllerFor('videos.video').set('current', model);
		});

		return this.store.query('video', { local: params.local });
	},
	setupController(controller, model, transition) {
		this._super(...arguments);
		controller.set('search', transition.queryParams.q);
	}
});
