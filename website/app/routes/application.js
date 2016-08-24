import Ember from 'ember';

import noty from 'npm:noty';

import SetupController from 'platform-base/mixins/setup-controller';

import LoadingSliderMixin from 'platform-base/mixins/loading-slider';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(LoadingSliderMixin, SetupController, ApplicationRouteMixin, {

	global: Ember.inject.service(),

	device: Ember.inject.service(),

	matrix: Ember.inject.service(),

	timeout: Ember.inject.service(),

	session: Ember.inject.service(),

	configure: Ember.inject.service(),

	init() {
		// Runs init in each service
		this._super(...arguments);
		this.get('configure');
		this.get('global');
		this.get('matrix');
	},

	beforeModel() {
		this._super(...arguments);
		this.setupGlobalErrorHandler();
	},
	afterRender() {
		Ember.$('#hamburger').materialSideNav();
		Ember.$('.fixed-action-btn').materialFAB();
		this.get('timeout').wait(350, () => Ember.$(window).scrollTop(0) );
	},
	APISuccessMessage(data) {
		this.send('apiMessage', {
			data: data,
			type: 'success',
			text: 'Successful!'
		});
	},
	APIErrorMessage(error) {
		this.send('apiMessage', {
			error: error,
			type: 'error',
			text: 'There was an error processing your request.'
		});
	},
	setupGlobalErrorHandler() {
		Ember.RSVP.on('error', error => {
			if(error && error.message === "TransitionAborted") { return; }
			this.APIErrorMessage(error);
		});
	},
	primus() {
		return this.get('_primus') || ( () => {
			this.set('_primus', new window.Primus());
			return this.get('_primus').on('ws-api-response', response => {
				if(response.success) { this.APISuccessMessage(response.data); }
				if(response.error) { this.APIErrorMessage(response.data); }
			});
		})();
	},
	createAPIData(data, options) {
		return Object.assign({}, {
			"data": {
				"id": data.id,
				"type": data.type,
				"attributes": {
					"label": data.label || '',
					"description": data.description || '',
					"media": {
						"image": data.media.image || '',
						"video": data.media.video || '',
						"audio": data.media.audio || ''
					}
				}
			}
		}, options);
	},
	actions: {
		apiMessage(options={}) {
			if(options.error) { console.error('API Message', options.error); }
			noty(Object.assign({}, {
				timeout: 3000,
				type: 'alert',
				layout: 'topRight',
				text: 'API Information',
				animation: {
					open: 'animated bounceInRight', // Animate.css class names
					close: 'animated bounceOutRight', // Animate.css class names
					easing: 'swing', // unavailable - no need
					speed: 500 // unavailable - no need
				}
			}, options));
		},
		apiRequest(item={}, type='languages', method='patch', options={}) {
			let data = item.toJSON ? item.toJSON() : item;
			data.id = item.get ? item.get('id') : item.id;
			data.type = type;

			this.primus().emit('ws-api', this.createAPIData(data, options), {
				method: method, path: `/${type}/${data.id}`
			});
		}
	}
});
