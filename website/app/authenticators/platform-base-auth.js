import Ember from 'ember';

import Promise from 'npm:bluebird';

import LocalForage from 'npm:localforage';

import Base from 'ember-simple-auth/authenticators/base';

let auth_utils = {
	get_user(login_data = {}) {
		let data = ( login_data && login_data.data ) || login_data;
		let access_token = data && ( data.access_token || data.id );
		if(!access_token) { return Promise.reject(new Error('No Access Token')); }
		return Promise.all([
			access_token,
			this.get('api').get('users/me', null, {
				Authorization: access_token
			})
		]);
	},
	set_user([access_token, user = {}]) {
		let data = ( user && user.data ) || user;
		data.access_token = access_token;

		return LocalForage.setItem('user', data).then( () => {
			if(user && user.data && user.data.type){
				user.data.type = 'user';
				this.get('store').push(user);
				this.get('user').setUser(data);
			}
			return { access_token: access_token, user: data };
		});
	},
	remove_user(data) {
		this.get('user').removeUser();
		return LocalForage.removeItem('user').then( () => data );
	},
	error(error) {
		LocalForage.removeItem('user');
		console.error('Authentication', error);
		return Promise.reject(new Error(( error && error.responseText ) || error));
	}
};

export default Base.extend({
	api: Ember.inject.service(),
	user: Ember.inject.service(),
	store: Ember.inject.service(),
	invalidate() {
		return this.get('api')
			.post('users/logout')
			.then(auth_utils.remove_user.bind(this))
			.catch(auth_utils.error.bind(this));
	},
	authenticate(data) {
		return this.get('api')
			.post('users/login', data)
			.then(auth_utils.get_user.bind(this))
			.then(auth_utils.set_user.bind(this))
			.catch(auth_utils.error.bind(this));
	},
	restore() {
		return LocalForage.getItem('user')
			.then(auth_utils.get_user.bind(this))
			.then(auth_utils.set_user.bind(this))
			.catch(auth_utils.error.bind(this));
	}
});
