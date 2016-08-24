import Ember from 'ember';

import AfterRender from '../mixins/after-render';

export default Ember.Component.extend(AfterRender, {

	modalId: '',

	okText: 'ok',

	cancelText: 'cancel',

	modalTypeClass: 'bottom-sheet',

	crypto: Ember.inject.service(),

	init() {
		this._super(...arguments);

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);

		let id = this.get('crypto').uuid(6);
		this.set('modalId', `modal-${id}`);
	},

	afterRender() {
		this._super(...arguments);

		this.$().materialForm();
		this.action('modal-load');

		if(this.get('start-open')) {
			this.open();
		}
	},

	getModal() {
		let modalId = this.get('modalId');
		return this.$(`#${modalId}`);
	},

	open(modalContext) {
		if(modalContext) {
			this.set('modalContext', modalContext);
			Ember.run.later(() => { this.$().materialForm(); }, 100);
		}

		this.getModal()
		.scrollTop(0)
		.openModal();
	},

	close() {
		this.getModal()
		.closeModal();
	},

	action(action) {
		this.sendAction(action, this, this.get('modalContext'));
	},

	actions: {
		ok() {
			this.close();
			this.action('modal-ok');
		},
		cancel() {
			this.close();
			this.action('modal-cancel');
		}
	},
});
