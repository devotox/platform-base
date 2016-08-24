import Ember from 'ember';

export default Ember.Service.extend({
	promiseProxy(promise) {
		let ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
		return ObjectPromiseProxy.create({ promise: promise });
	},
});
