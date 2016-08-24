import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
	email: attr(),
	realm: attr(),
	status: attr(),
	created: attr(),
	username: attr(),
	password: attr(),
	challenges: attr(),
	lastupdated: attr(),
	emailverified: attr(),
	profile: belongsTo('profile'),
	// profiles: hasMany('profile'),
	transactions: hasMany('transaction'),
	purchased_locations: hasMany('purchased-location')
});
