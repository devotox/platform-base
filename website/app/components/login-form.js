import Ember from 'ember';

import config from '../config/environment';

import AfterRender from '../mixins/after-render';

export default Ember.Component.extend(AfterRender, {
	error: null,
	timeout: null,
	loginFailed: false,
	isProcessing: false,
	isSlowConnection: false,
	slowConnectionTimeout: 3000,
	session: Ember.inject.service(),

	authenticator: config['ember-simple-auth'].authenticator,

	afterRender: function(){
		this.$().materialForm();
	},

	_destroyed: function() {
		return this.get('isDestroyed') || this.get('isDestroying');
	},

	_success: function() {
		//this.sendAction('success');
		this.get('session').set('isAuthenticated', true);
	},

	_failure: function(error) {
		//this.sendAction('failure');
		this.get('session').set('isAuthenticated', false);
		error = typeof error === 'string' ? error : undefined;
		this.set('error', error || 'Incorrect Username or Password');
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

	_slowConnection: function() {
		if(this._destroyed()) { return; }
		this.set('isSlowConnection', true);
	},

	_validate: function() {
		//this.sendAction('validate');
		let error = null, credentials = {},
			login_object = {  email: 'Email Address', username: 'Username', password: 'Password' };

		Object.keys(login_object).every( key => {
			let _key = key === 'email' ? 'username' : key;
			if(this.get(_key)) { return credentials[key] = this.get(_key); }
			error = [ 'Please Enter', login_object[key] ].join(' ');
			return false;
		});
		if( credentials.email && credentials.email.indexOf('@') < 0 ) {
			delete credentials.email;
		}
		if(error) { this._failure(error); return false; }
		return credentials || true;
	},

	actions: {
		login: function() {
			this._reset(true);
			this.set('isProcessing', true);

			let credentials = this._validate();
			if(!credentials) { return; }

			let authenticator = this.get('authenticator');
			this.set('timeout', setTimeout(() => { this._slowConnection(); }, this.get('slowConnectionTimeout')));

			let request = this.get('session').authenticate(authenticator, credentials);
			request.then(this._success.bind(this)).catch(this._failure.bind(this)).finally(this._reset.bind(this));
		},
		reset: function() {
			this._reset(true);
		}
	}
});
