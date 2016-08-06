import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {
	pageName: 'videos',

	queryParams: {
		q: {
			as: 'video-q',
			refreshModel: true
		},
		local: {
			as: 'video-local',
			refreshModel: true
		}
	},

	videosController: null,

	pageRoute: 'videos',

	beforeModel: function() {
		this._super(...arguments);
		this.set('videosController', this.controllerFor(this.get('pageRoute')));
	},

	model: function(params) {
		let videosController = this.get('videosController');
		videosController.set('search', '');

		return this.store.findRecord('video', params.id, {
			adapterOptions: {
				query: {
					local: params.local
				}
			}
		});
	},
	setupController: function(controller, model) {

		let videosController = this.get('videosController');
		videosController.set('current', model);

		this.store.query('video', {
			local: videosController.get('local')
		}).then(data => {
			videosController.set('videos', data);
		});
	}
});
