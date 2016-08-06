import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

export default Ember.Route.extend(ResetScroll, {

	queryParams: {
		q: {
			as: 'videos-q',
			refreshModel: true
		},
		local: {
			as: 'videos-local',
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
		videosController.set('search', params.q);
		videosController.set('current', false);

		return this.store.query('video', { local: params.local });
	},
	setupController: function(controller, model) {
		let videosController = this.get('videosController');
		videosController.set('videos', model);
	}
});
