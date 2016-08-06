import Ember from 'ember';

export default Ember.Mixin.create({

	pageName: '',

	appController: null,

	afterRenderEvent : Ember.K,

	setupController(controller) {
		this._super(...arguments);
		controller.set('pageName', this.get('pageName'));
		this.set('appController', this.controllerFor('application'));
		Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
	}
});
