import Ember from 'ember';

import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR, requestOptions) {
	  return new Ember.RSVP.Promise(function(resolve) {
		resolve({ email: 'devonte', password: 'devonte', data: [jqXHR, requestOptions] });
	});
  }
});
