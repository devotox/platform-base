import Ember from 'ember';

import ResetScroll from 'platform-base/mixins/reset-scroll';

import SetupController from 'platform-base/mixins/setup-controller';

export default Ember.Route.extend(ResetScroll, SetupController, {
	pageName: 'home',

	global: Ember.inject.service(),

	device: Ember.inject.service(),

	timeout: Ember.inject.service(),

	setupController(controller) {
		this._super(...arguments);
		controller.set('device', this.get('device'));
	},

	afterRender() {
		let wait_time = 50,
			timeout_id = null,
			$window = Ember.$(window),
			change_point = wait_time * 8,
			$nav = Ember.$('#navigation'),
			timeout = this.get('timeout'),
			parallax_class = "page-parallax",
			isTouch = this.get('device').isTouch,
			isSafari = this.get('device').isSafari,
			parallax_init_class = "page-parallax-init",
			$banner_video = Ember.$('#banner-video').find('video'),
			$bannerComponents = Ember.$('#banner-text, #banner-button');

		let parallax = () => {
			Ember.$(document).ready( () => {
				Ember.$('.parallax').parallax();
			});
		};

		let opacifyText = () => {
			let $top = $window.scrollTop();
			$bannerComponents.css({
				opacity: 1 - Math.max($top / change_point)
			});
		};

		let checkPage = () => {
			let hasClass = $nav.hasClass(parallax_class),
				passedChangePoint = $window.scrollTop() >= change_point;

			if(timeout_id) {
				timeout.cancel(timeout_id);
				timeout_id = null;
			}

			if( !(isTouch || passedChangePoint) ) {
				timeout.wait(0, opacifyText);
			}

			$nav.removeClass(parallax_init_class);

			if(hasClass && passedChangePoint) {
				$nav.removeClass(parallax_class);
			} else if(!hasClass && !passedChangePoint) {
				$nav.addClass(parallax_class);
			}
		};

		let initPage = () =>  {
			timeout.wait(0, parallax);
			if(isSafari) { $banner_video.removeAttr('poster'); }
			$nav.addClass(parallax_class + ' ' + parallax_init_class);

			$window.bind('scroll.home', () =>  {
				if(timeout_id) { return; }
				timeout_id = timeout.wait(wait_time, checkPage);
			});
		};

		initPage();
	},
	actions: {
		willTransition() {
			let $window = Ember.$(window),
				$nav = Ember.$('#navigation'),
				parallax_class = 'page-parallax',
				$bannerComponents = Ember.$('#banner-text, #banner-button');

			// Revert and unbind animations
			$window.unbind('scroll.home');
			$nav.removeClass(parallax_class);
			$bannerComponents.css('opacity', 1);
		},
		"sign-up-updates"() {
			let $email_input = Ember.$('#newsletter-email');
			let email_address = $email_input.val();
			$email_input.siblings('label')
				.removeClass('active')
				.end().val('');

			console.log(email_address);
		}
	}
});
