import Ember from 'ember';

//Can only be used in components
export default Ember.Mixin.create({
	afterRenderEvent : Ember.K,

	// This hook is guaranteed to be executed
	// when the root element  of this view has been inserted into the DOM.

	didInsertElement : function(){
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
	}
});
