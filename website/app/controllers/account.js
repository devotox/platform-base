import Ember from 'ember';

export default Ember.Controller.extend({

	modalClass: '',
	modalHeader: 'Update Account Details',
	modalTemplate: 'modals/update-account',
	store: Ember.inject.service(),
	staticContext: {
		account: false,
		profile: true,
		genders: [
			{ label: 'Female', value: 'F' },
			{ label: 'Male', value: 'M' }
		]
	},
	actions: {
		initModal(modal) {
			this.set('modal', modal);
		},
		openModal() {
			let model = this.get('model');
			this.get('modal').open(model);
		},
		saveProfile() {
			let user = this.get('model');
			user.get('profile').then( (profile) => {
				profile.save();
				user.save();
			});
		}
	}
});
