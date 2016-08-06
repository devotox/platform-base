import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	i18n: Ember.inject.service(),
	locales: Ember.computed('i18n.locales', function() {
		const i18n = this.get('i18n');

		return this.get('i18n.locales').map(function(locale_id) {
			return {
				id: locale_id,
				label: i18n.t('components.locale-select.locale.' + locale_id)
			};
		});
	}).property('i18n.locale')
});
