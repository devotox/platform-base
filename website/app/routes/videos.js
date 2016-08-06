import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {
	pageName: 'videos',

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
	}
});
