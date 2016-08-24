import Ember from 'ember';

import Promise from 'npm:bluebird';

import config from '../config/environment';

import AfterRender from '../mixins/after-render';

export default Ember.Component.extend(AfterRender, {
	error: null,
	timeout: null,
	loginFailed: false,
	isProcessing: false,
	isSlowConnection: false,
	loginAfterCreation: false,
	slowConnectionTimeout: 3000,
	store: Ember.inject.service(),
	session: Ember.inject.service(),

	authenticator: config['ember-simple-auth'].authenticator,

	afterRender(){
		this.$().materialForm();
	},

	_destroyed() {
		return this.get('isDestroyed') || this.get('isDestroying');
	},

	_success() {
		this.sendAction('success');
	},

	_failure(error) {
		//this.sendAction('failure');
		error = typeof error === 'string' ? error : undefined;
		this.set('error', error || 'There was a problem with your sign up');
	},

	_reset(resetError) {
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
		//this.sendAction('validate');
		let error = null, credentials = {},
			login_object = { email: 'Email Address', username: 'Username', password: 'Password' };

		Object.keys(login_object).every( key => {
			if(this.get(key)) { return credentials[key] = this.get(key); }
			error = [ 'Please Enter', login_object[key] ].join(' ');
			return false;
		});

		if(error) { this._failure(error); return false; }
		return credentials || true;
	},

	_createUser(credentials) {
		//this.sendAction('createUser');
		return new Promise( (resolve, reject) => {

			let createUser = this.get('store').createRecord('user', {
				email: credentials.email,
				username: credentials.username,
				password: credentials.password
			}).save();

			let createProfile = createUser.then( (user) => {
				return this.get('store').createRecord('profile', {
					firstname: credentials.firstname || credentials.username,
					lastname: credentials.lastname || '',
					birthdate: credentials.birthdate,
					gender: credentials.gender,
					image: credentials.image || '/assets/images/default/user-image.png',
					email: credentials.email,
					phone: credentials.phone,
					user: user
				}).save();
			});

			return createProfile.then(resolve).catch(reject);
		});
	},

	actions: {
		'sign-up'() {
			this._reset(true);
			this.set('isProcessing', true);

			let credentials = this._validate();
			if(!credentials) { return; }

			let user = this._createUser(credentials);

			if(!this.get('loginAfterCreation')) {
				return user.then(this._success.bind(this)).catch(this._failure.bind(this)).finally(this._reset.bind(this));
			}

			user.then( () => {
				let authenticator = this.get('authenticator');
				this.set('timeout', setTimeout(() => { this._slowConnection(); }, this.get('slowConnectionTimeout')));

				let request = this.get('session').authenticate(authenticator, credentials);
				return request.then(this._success.bind(this)).catch(this._failure.bind(this)).finally(this._reset.bind(this));
			}).catch(this._failure.bind(this)).finally(this._reset.bind(this));
		},
		reset() {
			this._reset(true);
		}
	}

});
