import Ember from 'ember';

import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
	session: Ember.inject.service(),
	authorize(data, setHeader) {
		let accessToken = data && data.access_token;
		if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
			setHeader('Authorization', accessToken);
		}
	}
});
