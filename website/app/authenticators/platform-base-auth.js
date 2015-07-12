import Ember from 'ember';

import Base from 'simple-auth/authenticators/base';

export default Base.extend({
	invalidate: function() {
		return new Ember.RSVP.Promise(function(resolve) {
			setTimeout(function(){ resolve(true); }, 1000);
		});
	},
	authenticate: function(data) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			if(data.email !== 'test' && data.password !== 'test') { return reject(false); }
			setTimeout(function(){ resolve(true); }, 1000);
		});
	},
	restore: function(data) {
		data = {email: 'test', password: 'test'};
		return new Ember.RSVP.Promise(function(resolve, reject) {
			if(data.email !== 'test' && data.password !== 'test') { return reject(false); }
			setTimeout(function(){ resolve(true); }, 1000);
		});
	}
});
