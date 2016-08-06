import Ember from 'ember';

import Promise from 'npm:bluebird';

import LocalForage from 'npm:localforage';

export default Ember.Service.extend({

	editMode: false,

	baseLanguage: 'en',

	init() {
		this._super(...arguments);
		LocalForage.getItem('editMode').then(this.setEditMode.bind(this));
		LocalForage.getItem('baseLanguage').then(this.setBaseLanguage.bind(this));
	},

	getUser() {
		return Promise.resolve(
			LocalForage.getItem('user')
		);
	},

	getEditMode() {
		return LocalForage.getItem('editMode');
	},

	getBaseLanguage() {
		return LocalForage.getItem('baseLanguage');
	},

	setEditMode(mode = false) {
		this.set('editMode', mode);
		return LocalForage.setItem('editMode', mode);
	},

	setBaseLanguage(lang = 'en') {
		this.set('baseLanguage', lang);
		return LocalForage.setItem('baseLanguage', lang);
	}
});
