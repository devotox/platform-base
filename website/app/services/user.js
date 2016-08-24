import Ember from 'ember';

import Promise from 'npm:bluebird';

import LocalForage from 'npm:localforage';

export default Ember.Service.extend({

	currentUser: null,

	store: Ember.inject.service(),

	emberUtils: Ember.inject.service(),

	getUser(getModel, proxy) {
		let promise = Promise.resolve(
			LocalForage.getItem('user')
		);

		if(getModel) {
			promise = promise.then( user => {
				let id = user && user.id;
				let record = id ? this.get('store').peekRecord('user', id) : null;
				return record;
			});
		}

		if(proxy) {
			promise = this.get('emberUtils').promiseProxy(promise);
		}

		return promise;
	},

	setUser(user) {
		let model = this.get('store').peekRecord('user', user.id);
		LocalForage.setItem('user', user);
		this.set('currentUser', model);
	},

	removeUser() {
		this.get('currentUser').deleteRecord();
		LocalForage.removeItem('user');
		this.set('currentUser', null);
	}
});
