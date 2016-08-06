import Ember from 'ember';

export function lookup([object, key]/*, hash*/) {
	key = key === undefined ? '' : key + '';
	return Ember.get(object, key);
}

export default Ember.Helper.helper(lookup);
