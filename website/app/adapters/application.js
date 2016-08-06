import Ember from 'ember';

import Adapter from "ember-data/adapters/json-api";

import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default Adapter.extend(DataAdapterMixin, {
	namespace: 'api',
	authorizer: 'authorizer:platform-base-auth',
	urlForFindRecord: function(id, modelName, snapshot) {
		let url = this._super(...arguments);
		let query = Ember.get(snapshot, 'adapterOptions.query');
		if (query) { url = `${url}?${Ember.$.param(query)}`; } // assumes no query params are present already
		return url;
	}
});
