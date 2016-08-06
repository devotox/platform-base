import Ember from 'ember';

export default Ember.Component.extend({

	global: Ember.inject.service(),

	device: Ember.inject.service(),

	session: Ember.inject.service(),

	editMode: null,

	setEditMode() {
		this.get('global').getEditMode().then( (editMode) => {
			this.set('editMode', editMode ? 'EDIT' : 'VIEW');
		});
	},

	actions: {
		logout() {
			this.get('session').invalidate();
			this.get('session').set('isAuthenticated', false);
		},
		toggleEdit(modeObject) {
			if(!modeObject.oldValue) { return this.setEditMode(); }
			let editMode = modeObject.newValue === 'EDIT';
			this.set('editMode', modeObject.newValue);
			this.get('global').setEditMode(editMode);
		}
	}
});
