import Ember from 'ember';
import config from './config/environment';
import googlePageview from './mixins/google-pageview';

const Router = Ember.Router.extend(googlePageview, {
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function() {
	/* Index */
	// All Index Routes should go to home page
	this.route('home', { path: 'index' });
	this.route('home', { path: 'home' });
	this.route('home', { path: '' });

	/* The Pride and Joy */
	this.route('search', { path: 'search' });

	/* Authentication Pages */
	this.route('login', { path: 'login' });
	this.route('sign-up', { path: 'sign-up' });
	this.route('forgot-details', { path: 'forgot-details' });
	this.route('reset-password', { path: 'reset-password' });

	/* Account Pages */
	this.route('account', { path: 'account' });

	/* Development */
	this.route('tests', { path: 'tests' });
	this.route('readme', { path: 'readme' });
	this.route('licenses', { path: 'licenses' });

	/* Contact Us */
	this.route('press', { path: 'press' });
	this.route('social', { path: 'social' });
	this.route('contact-us', { path: 'contact-us' });

	/* The Company */
	this.route('about', { path: 'about' });
	this.route('devonte', { path: 'devonte' });
	this.route('careers', { path: 'careers' });
	this.route('mission', { path: 'mission' });

	/* Legal */
	this.route('privacy-policy', { path: 'privacy-policy' });
	this.route('trust-and-safety', { path: 'trust-and-safety' });
	this.route('terms-and-conditions', { path: 'terms-and-conditions' });

	/* Media */
	this.route('chat', { path: 'chat' });
	this.route('videos',  { path: 'videos' }, function() {
		this.route('video', { path: ':id' });
	});
});

export default Router;
