import Ember from 'ember';

import AfterRender from 'platform-base/mixins/after-render';

export default Ember.Component.extend(AfterRender, {

	valign: true,

	chevron: true,

	editableMaxLength: 100,

	editableClass: 'content',

	global: Ember.inject.service(),

	editMode: Ember.computed.alias('global.editMode'),

	baseLanguage: Ember.computed.alias('global.baseLanguage'),

	afterRenderEvent() {
		this.$().on('click', '.content[contenteditable="true"]', event => {
			this.$(event.target).selectText();
			event.stopImmediatePropagation();
		});
	},
	actions: {
		endEdit(contentEditable, event) {
			event.preventDefault();
			contentEditable.element.blur();
			window.getSelection().removeAllRanges();
		},
		selectAll(contentEditable, event) {
			console.log(event.target);
		},
		itemEdited(item) {
			Ember.run.cancel(this.edit_timeout);
			this.edit_timeout = Ember.run.later(this, () => { this.sendAction('item-edited', item); }, 1000);
		},
		itemClicked(item) {
			Ember.run.cancel(this.click_timeout);
			this.click_timeout = Ember.run.later(this, () => { this.sendAction('item-clicked', item); }, 0);
		},
		audioRecorded(item, meta) {
			Ember.run.cancel(this.audio_timeout);
			this.audio_timeout = Ember.run.later(this, () => { this.sendAction('audio-recorded', item, meta); }, 0);
		}
	}
});
