import Ember from 'ember';

import Store from 'ember-data/store';

export default Store.extend({
	init() {
		this._super(...arguments);

		this.modelSlugCache = Ember.MapWithDefault.create({
			defaultValue() { return Ember.Map.create(); }
		});
	},
	// NOTE: This function uses private methods and could break in a future upgrade
	// But is used to make the code more readable, maintainable and allows no need to change adapter code
	_getRecords(modelName, id) {
		let model = this.modelFor(modelName);
		let records = this.typeMapFor(model);
		records = records && records.idToRecord;
		return id ? ( records && records[id] ) : records;
	},
	_unloadSlug(modelName, idOrSlug) {
		let record = this._getRecords(modelName, idOrSlug);
		return record && record.unloadRecord();
	},
	findRecord(modelName, idOrSlug, ...args) {
		let slugCache = this.modelSlugCache.get(modelName);
		let id = slugCache.get(`${idOrSlug}`);

		return id ? this._super(modelName, id, ...args) :
		this._super(...arguments)
		.then((record) => {
			id = record.get('id');
			slugCache.set(id, id);

			if(idOrSlug !== id) {
				slugCache.set(idOrSlug, id);
				this._unloadSlug(modelName, idOrSlug);
			}

			return record;
		});
	},
	queryOne() {
		return this.query.apply(this, arguments)
		.then((results) => {
			return results.objectAt(0);
		});
	},
	queryWhere(modelName, where) {
		return this.query(modelName, {
			filter: { where: where }
		});
	},
	queryRecordBy(modelName, id, by = 'slug') {
		return this.query(modelName, {
			filter: { where: { [by]: id } }
		});
	},
	queryOneRecordBy(modelName, id, by = 'slug') {
		return this.queryOne(modelName, {
			filter: { where: { [by]: id } }
		});
	},
});
