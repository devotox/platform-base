import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {
	pageName: 'devonte',

	utils: Ember.inject.service(),

	device: Ember.inject.service(),

	setupController: function(){
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, this.afterRender);
	},
	afterRender: function() {
		Ember.$('title').text('Devonte');
		Ember.$('.external-contact-card').hide();

		if(this.get('device').viewport().width < 993)  {
			return this.contact_card(this.mantra.bind(this));
		} else {
			this.mantra(this.contact_card.bind(this));
		}
	},
	mantra: function(callback) {
		let $tagline = Ember.$('.tagline');
		let $element = $tagline.find('p');

		$element.typed({
			typeSpeed: -20,
			showCursor: false,
			strings: [ $element.text() ],
			callback: () => {
				$tagline.removeAttr('style');
				if(this.get('utils').isFunction(callback)) { callback(); }
			},
			preStringTyped: function(){
				$tagline.css('min-height', $tagline.css('height'));
				$tagline.find('h2').hide().fadeIn(6000);
				$tagline.removeClass('invisible');
			}
		  });
	},
	contact_card: function(callback, $elements, index){
		index = index || 0;
		$elements = $elements || Ember.$('.contact-card li span');

		let self = this,
			$element = $elements.eq(index),
			$typed = $element.find('a').length ? $element.find('a') : $element;

		$typed.typed({
			typeSpeed: -20,
			showCursor: false,
			strings: [ $element.text() ],
			callback: () => {
				if($elements.length > (index + 1)) {
					self.contact_card(callback, $elements, ++index);
				} else {
					Ember.$('.external-contact-card').slideDown(500);
					if(this.get('utils').isFunction(callback)) { callback(); }
				}
			},
			preStringTyped: function(){
				$element.removeClass('invisible');
			}
		});
	}
});
