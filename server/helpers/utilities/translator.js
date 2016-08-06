(function() {
	'use strict';

	var _ = require('lodash');
	var axios = require('axios');
	var Promise = require('bluebird');

	module.exports.Translator = (function() {
		Translator.displayName = 'Translator';
		var defaults, prototype = Translator.prototype;

		defaults = {
			json: true,
			source: 'en',
			target: 'es',
			max_batch: 10,
			max_retries: 1,
			batch_delay: 500,
			max_queries: false,
			translate_key: '',
			br_placeholder: '###',
			translate_api: 'http://www.frengly.com/frengly/data/translate/'
		};

		function Translator(options) {
			var this$ = this instanceof Constructor$ ? this : new Constructor$();

			this$._errors = [];
			options = options || {};
			this.constructor = Translator;
			this$.options = _.defaults(options, defaults);

			return this$;
		} function Constructor$() {} Constructor$.prototype = prototype;

		prototype.get_errors = function() {
			return this._errors;
		};
		prototype._throw_error = function(error, source_word) {
			var error_string, error_replaced;
			this._errors.push(this._finalize_error(error, source_word));
			throw new Error(error != null ? typeof error.toString === 'function' ? (error_string = error.toString()) != null ? typeof error_string.replace === 'function' ? (error_replaced = error_string.replace(/error:/gi, '')) != null ? typeof error_replaced.trim === 'function' ? error_replaced.trim() : void 8 : void 8 : void 8 : void 8 : void 8 : void 8);
		};
		prototype.translate = function(string_to_translate, callback) {
			return Promise.resolve(true).bind(this).then(function() {
				if (!string_to_translate) {
					return this._throw_error('Bad string_to_translate - ' + (string_to_translate || 'No string_to_translate'), string_to_translate);
				}
			}).then(function() {
				return this._translate(this._get_uri(), this._get_string_to_translate(string_to_translate));
			}).then(function(translated_response) {
				var br_placeholder = new RegExp(this.options.br_placeholder, 'g');

				translated_response = this.normalize(translated_response)
						.replace(/(%26|% 26)/g, '&')
						.replace(/(%2B|% 2B)/g, '+')
						.replace(br_placeholder, '<br/>');

				if (typeof callback === 'function') {
					callback(translated_response);
				}
				return translated_response;
			});
		};
		prototype.translate_all = function(array, key, callback) {
			var tasks, results;
			callback = callback || _.identity;
			console.log('Processing records...');
			tasks = [];
			results = [];
			this._errors = [];
			return this.translate_batch(array, key, callback, tasks).bind(this).then(function() {
				var this$ = this;
				return Promise.settle(tasks).filter(function(batch_response) {
					return this$._filter_results(batch_response, results);
				}).then(function() {
					return results;
				});
			});
		};
		prototype.translate_batch = function(array, key, callback, tasks) {
			var batch_array;
			batch_array = array.splice(0, this.options.max_batch);
			if (this.options.max_queries && tasks.length >= this.options.max_queries) {
				return Promise.resolve(true);
			}
			return Promise.resolve(true).bind(this).then(function() {
				var this$ = this;
				return _.each(batch_array, function(string_to_translate, index) {
					tasks.push(this$.translate(key ? string_to_translate[key] : string_to_translate, callback));
					if (this$.options.max_queries && index >= this$.options.max_queries) {
						return false;
					}
				});
			}).then(function() {
				return Promise.settle(tasks);
			}).then(function(result) {
				console.log('Processed: ' + tasks.length + ' records');
				if (!array.length) {
					return result;
				}
				return Promise.delay(this.options.batch_delay).bind(this).then(function() {
					return this.translate_batch(array, key, callback, tasks);
				});
			});
		};
		prototype._translate = function(uri, source_word, retries) {
			retries = retries || 0;
			return Promise.resolve(true).bind(this).then(function() {
				var body = {
					text: source_word,
					srcLang: this.options.source,
					destLang: this.options.target
				};
				return axios.post(uri, body, this.options.json);
			}).catch(function(error) {
				console.error('Error Translating Text...\n', error);
				if (retries >= this.options.max_retries) {
					this._throw_error(error, source_word);
				}
				return this._backoff(function() {
					return this._translate(uri, source_word, retries);
				}, ++retries);
			});
		};
		prototype._random = function() {
			return Math.floor(Math.random() * 3000);
		};
		prototype._backoff = function(callback, retries) {
			retries = retries || 0;
			return Promise.delay(Math.pow(2, retries) * 1000 + this._random()).bind(this).then(callback);
		};
		prototype._get_string_to_translate = function(string_to_translate) {
			string_to_translate = string_to_translate || '';

			//string_to_translate = string_to_translate.replace(/\&/g, encodeURIComponent('&'));
			//string_to_translate = string_to_translate.replace(/\+/g, encodeURIComponent('+'));
			string_to_translate = string_to_translate.replace(/<br\/>/g, this.options.br_placeholder);
			return string_to_translate;
		};
		prototype._get_uri = function() {
			return encodeURI(this.options.translate_api);
		};
		prototype.normalize = function(response) {
			var str = '';
			if (response && response.responseData) {
				str = response.responseData.translatedText;
			} else {
				_.each(response.list, function(obj) {
					str += obj.destWord;
				});
			}
			return str;
		};
		prototype._filter_results = function(string_to_translate, results) {
			switch (string_to_translate.isFulfilled()) {
			case true:
				results.push(string_to_translate.value());
				return true;
			default:
				return false;
			}
		};
		prototype._finalize_error = function(error, source_word) {
			return {
				error: error != null ? typeof error.toString === 'function' ? error.toString() : void 8 : void 8,
				source_word: source_word,
				uri: this._get_uri(source_word)
			};
		};
		return Translator;
	}());
}).call(this);
