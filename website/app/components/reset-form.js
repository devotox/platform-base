import Ember from 'ember';

import Promise from 'npm:bluebird';

import config from '../config/environment';

import AfterRender from '../mixins/after-render';

export default Ember.Component.extend(AfterRender, {
	stage: 1,
	error: null,
	timeout: null,
	loginFailed: false,
	isProcessing: false,
	isSlowConnection: false,
	slowConnectionTimeout: 3000,
	api: Ember.inject.service(),
	device: Ember.inject.service(),
	session: Ember.inject.service(),
	_timeout: Ember.inject.service('timeout'),
	authenticator: config['ember-simple-auth'].authenticator,

	afterRenderEvent: function(){
		Ember.$( this.get('element') ).materialForm();
	},

	_destroyed() {
		return this.get('isDestroyed') || this.get('isDestroying');
	},

	_success() {
		//this.sendAction('success');

		let values = this.get('stage') !== 2 ? {
			message: 'Password Reset Email Sent Successfully!',
			redirect: 'home',
			timeout: 3000
		} : {
			message: 'Password Reset Successful!',
			redirect: 'login',
			timeout: 3000
		};

		this.set('message', values.message);
		this.get('_timeout').wait(values.timeout, () => {
			if(this._destroyed()) { return; }
			this.get('router').transitionTo(values.redirect);
		});
	},

	_failure: function(error) {
		//this.sendAction('failure');
		error = typeof error === 'string' ? error : undefined;
		this.set('error', error || 'Incorrect Reset Details');
	},

	_reset: function(resetError) {
		clearTimeout(this.get('timeout'));
		if(this._destroyed()) { return; }
		this.setProperties({
			error: resetError === true ? null : this.get('error'),
			isSlowConnection: false,
			isProcessing: false,
			timeout: null
		});
	},

	_slowConnection() {
		if(this._destroyed()) { return; }
		this.set('isSlowConnection', true);
	},

	_validate() {
		let error = null, credentials = {},
		login_object = this.get('stage') !== 2 ?
						{ email: 'Email Address' } :
						{ password: 'New Password'};

		Object.keys(login_object).every( key => {
			if(this.get(key)) { return credentials[key] = this.get(key); }
			error = [ 'Please Enter', login_object[key] ].join(' ');
			return false;
		});

		if(error) { this._failure(error); return false; }
		return credentials || true;
	},

	_sendResetEmail(credentials) {
		return new Promise( (resolve, reject) => {
			this.get('api').post('users/reset', {
				email: credentials.email
			}).then(resolve).catch(reject);
		});
	},

	_resetUser(credentials) {
		let access_token = this.get('device').query('access_token');

		return new Promise( (resolve, reject) => {
			this.get('api').post('users/change-password', {
				data: {
					type: 'user',
					attributes: {
						password: credentials.password
					}
				}
			}, {
				Authorization: access_token
			}).then(resolve).catch(reject);
		});
	},

	actions: {
		'reset-submit'() {
			this._reset(true);
			this.set('isProcessing', true);

			let credentials = this._validate();
			if(!credentials) { return; }

			let user = this.get('stage') !== 2 ?
						this._sendResetEmail(credentials) :
						this._resetUser(credentials);

			this.set('timeout', setTimeout(() => { this._slowConnection(); }, this.get('slowConnectionTimeout')));
			user.then(this._success.bind(this)).catch(this._failure.bind(this)).finally(this._reset.bind(this));
		},
		reset() {
			this._reset(true);
		}
	}

});
