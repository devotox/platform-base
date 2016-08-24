import Ember from 'ember';

import Promise from 'npm:bluebird';

import LocalForage from 'npm:localforage';

export default Ember.Service.extend({

	editMode: false,

	baseLanguage: 'en',

	init() {
		this._super(...arguments);
		this.set('delay', 1500);
		Ember.run.later( () => { this.set('delay', 0); }, this.get('delay'));
		LocalForage.getItem('editMode').then(this.setEditMode.bind(this));
		LocalForage.getItem('baseLanguage').then(this.setBaseLanguage.bind(this));
	},

	getEditMode() {
		return Promise.delay(this.get('delay')).then( () => this.get('editMode'));
	},

	getBaseLanguage() {
		return Promise.delay(this.get('delay')).then( () => this.get('baseLanguage'));
	},

	setEditMode(mode) {
		mode = mode || false;
		this.set('editMode', mode);
		return LocalForage.setItem('editMode', mode);
	},

	setBaseLanguage(lang) {
		lang = lang || 'en';
		this.set('baseLanguage', lang);
		return LocalForage.setItem('baseLanguage', lang);
	}
});
