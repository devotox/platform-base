(function(){
	'use strict';

	var _ = require('lodash');
	var axios = require('axios');
	var Promise = require('bluebird');

	module.exports.Geocoder = (function(){
		Geocoder.displayName = 'Geocoder';
		var defaults, prototype = Geocoder.prototype;

		function Geocoder(options){
			var this$ = this instanceof Constructor$ ? this : new Constructor$();

			this$._errors = [];
			options = options || {};
			this.constructor = Geocoder;
			this$.options = _.defaults(options, defaults);

			return this$;
		} function Constructor$(){} Constructor$.prototype = prototype;

		defaults = {
			json: true,
			max_batch: 10,
			max_retries: 1,
			batch_delay: 500,
			max_queries: false,
			account_types: ['practice'],
			maps_api: 'https://maps.googleapis.com/maps/api/geocode/json?',
			maps_key: process.env.NODE_ENV === 'production' ? '' : '', // Enter Maps Key here
			components: [
				{
					name: 'street',
					return_name: 'route'
				}, {
					name: 'city',
					return_name: 'locality'
				}, {
					name: 'country',
					return_name: 'country'
				}, {
					name: 'premise',
					return_name: 'premise'
				}, {
					name: 'area',
					return_name: 'neighborhood'
				}, {
					name: 'postcode',
					return_name: 'postal_code'
				}, {
					name: 'number',
					return_name: 'street_number'
				}, {
					name: 'postal_town',
					return_name: 'postal_town'
				}, {
					name: 'county',
					return_name: 'administrative_area_level_2'
				}
			]
		};

		prototype.get_errors = function(){
			return this._errors;
		};
		prototype._throw_error = function(error, old_address){
			var error_string, error_replaced;
			this._errors.push(this._finalize_error(error, old_address));
			throw new Error(error !== null ? typeof error.toString === 'function' ? (error_string = error.toString()) !== null ? typeof error_string.replace === 'function' ? (error_replaced = error_string.replace(/error:/gi, '')) !== null ? typeof error_replaced.trim === 'function' ? error_replaced.trim() : null : null : null : null : null : null);
		};
		prototype.geocode = function(address, callback){
			return Promise.resolve(true).bind(this).then(function(){
				if (!address) {
					return this._throw_error('Bad Address - ' + (address || 'No Address'), address);
				}
			}).then(function(){
				return this._geocode(this._get_uri(address), address);
			}).then(function(geocode_response){
				if (typeof callback === 'function') {
					callback(geocode_response);
				}
				return geocode_response;
			});
		};
		prototype.geocode_all = function(array, key, callback){
			var tasks, results;
			callback = callback || _.identity;
			console.log('Processing records...');
			tasks = [];
			results = [];
			this._errors = [];
			return this.geocode_batch(array, key, callback, tasks).bind(this).then(function(){
				var this$ = this;
				return Promise.settle(tasks).filter(function(batch_response){
					return this$._filter_results(batch_response, results);
				}).then(function(){
					return results;
				});
			});
		};
		prototype.geocode_batch = function(array, key, callback, tasks){
			var batch_array;
			batch_array = array.splice(0, this.options.max_batch);
			if (this.options.max_queries && tasks.length >= this.options.max_queries) {
				return Promise.resolve(true);
			}
			return Promise.resolve(true).bind(this).then(function(){
				var this$ = this;
				return _.each(batch_array, function(address, index){
					tasks.push(this$.geocode(key ? address[key] : address, callback));
					if (this$.options.max_queries && index >= this$.options.max_queries) {
						return false;
					}
				});
			}).then(function(){
				return Promise.settle(tasks);
			}).then(function(result){
				console.log('Processed: ' + tasks.length + ' records');
				if (!array.length) {
					return result;
				}
				return Promise.delay(this.options.batch_delay).bind(this).then(function(){
					return this.geocode_batch(array, key, callback, tasks);
				});
			});
		};
		prototype._geocode = function(uri, old_address, retries){
			retries = retries || 0;
			return Promise.resolve(true).bind(this).then(function(){
				return axios.get(uri, this.options.json);
			}).then(function(response){
				return this._standardize_address(response.data, old_address);
			}).caught(function(error){
				if (retries >= this.options.max_retries) {
					this._throw_error(error, old_address);
				}
				return this._backoff(function(){
					return this._geocode(uri, old_address, retries);
				}, ++retries);
			});
		};
		prototype._random = function(){
			return Math.floor(Math.random() * 3000);
		};
		prototype._backoff = function(callback, retries){
			retries = retries || 0;
			return Promise.delay(Math.pow(2, retries) * 1000 + this._random()).bind(this).then(callback);
		};
		prototype._get_uri = function(address){
			address = address || '';
			address = address !== null ? typeof address.replace === 'function' ? address.replace(/к/g, '') : null : null;
			return encodeURI(this.options.maps_api + 'key=' + this.options.maps_key + '&address=' + address);
		};
		prototype._filter_results = function(address, results){
			switch (address.isFulfilled()) {
			case true:
				results.push(address.value());
				return true;
			default:
				return false;
			}
		};
		prototype._get_address = function(address){
			var get_type, addresses, sum;
			if (!address) {
				return null;
			}
			get_type = function(type){
				return function(loc){
					return loc.geometry.location_type === type;
				};
			};
			addresses = {
				rooftop: _.filter(address, get_type('ROOFTOP')),
				approximate: _.filter(address, get_type('APPROXIMATE')),
				geometric_center: _.filter(address, get_type('GEOMETRIC_CENTER')),
				range_interpolated: _.filter(address, get_type('RANGE_INTERPOLATED'))
			};
			sum = _.reduce(_.keys(addresses), function(result, key){
				return result.concat(addresses[key]);
			});
			if (!sum.length) {
				throw new Error('No Best Address - ' + (address || 'No Address'));
			}
			if (addresses.rooftop.length) {
				return addresses.rooftop[0];
			} else if (addresses.range_interpolated.length) {
				return addresses.range_interpolated[0];
			} else if (addresses.geometric_center.length) {
				return addresses.geometric_center[0];
			} else if (addresses.approximate.length) {
				return addresses.approximate[0];
			}
		};
		prototype._standardize_address = function(address, old_address){
			address = address || {};
			if (address.error_message) {
				throw new Error(address.error_message);
			}
			if (!(address = this._get_address(address !== null ? address.results : null))) {
				throw new Error('Bad Address - No Address Result Returned');
			}
			return this._finalize_address(address, old_address);
		};
		prototype._filter_components = function(return_name, components){
			var found, found_first;
			found = _.filter(components, function(component){
				return _.includes(component.types, return_name);
			});

			return found && found.length ? (found_first = found[0]) ? found_first.long_name : null : null;
		};
		prototype._finalize_address = function(address, old_address){
			var final_address, this$ = this;
			address = address || {};

			final_address = {
				old_address: old_address,
				place_id: address.place_id,
				coordinates: address.geometry.location,
				formatted_address: address.formatted_address,
				geolocation: {
					type: 'point',
					coordinates: [ address.geometry.location.lng, address.geometry.location.lat ]
				}
			};
			_.each(this.options.components, function(component){
				return final_address[component.name] = this$._filter_components(component.return_name, address.address_components) || '';
			});
			final_address._address = [ final_address.number, final_address.street ].join(' ').trim();

			return final_address;
		};
		prototype._finalize_error = function(error, old_address){
			return {
				error: error !== null ? typeof error.toString === 'function' ? error.toString() : null : null,
				old_address: old_address,
				uri: this._get_uri(old_address)
			};
		};

		return Geocoder;
	})();
}).call(this);

var address = require('../../models/v2/address.js');

// export the schemas from the model for use in documentation
exports.schemas = {
	'GeoJSON': address.geojson_schema,
	'Address': address.address_schema,
	'AddressMinimum': address.address_minimum_schema
};
