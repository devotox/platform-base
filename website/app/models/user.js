import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	email: attr(),
	realm: attr(),
	status: attr(),
	created: attr(),
	username: attr(),
	password: attr(),
	challenges: attr(),
	lastUpdated: attr(),
	emailVerified: attr(),
});
