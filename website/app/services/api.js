import Ember from 'ember';

import axios from 'npm:axios';

import Promise from 'npm:bluebird';

import LocalForage from 'npm:localforage';

let request_functions = {
	jquery: Ember.$.ajax,
	axios: axios
};

// Use Ember.get('this', <property-name>)
// Due to the fact that this.get being overriden
// For API Requests
export default Ember.Service.extend({
	api_url: null,
	namespace: null,
	request_function: 'axios',

	store: Ember.inject.service(),
	session: Ember.inject.service(),

	put() { return this.request('put', ...arguments); },
	get() { return this.request('get', ...arguments); },
	post() { return this.request('post', ...arguments); },
	head() { return this.request('head', ...arguments); },
	patch() { return this.request('patch', ...arguments); },
	delete() { return this.request('delete', ...arguments); },

	logout() {
		if(!this.isLoggedIn()) { return; }
		Ember.get(this, 'session').invalidate();
		Ember.get(this, 'session').set('isAuthenticated', false);
	},

	isLoggedIn() {
		return Ember.get(this, 'session').get('isAuthenticated');
	},

	request(method, api, data = {}, headers = {}, contentType = 'application/json; charset=utf-8'){
		return this.getAccessToken().then( access_token => {
			return new Promise( (resolve, reject, onCancel) => {
				let request_function = this.getRequestFunction();

				let request_config = this.createRequestConfig(
					access_token, method,
					api, data, headers,
					contentType
				);

				let request = request_function(request_config);

				request.then(this.createRequestSuccess(resolve));

				request.catch(this.createRequestError(reject));

				onCancel(this.createAbort(request));

				return request;
			});
		});
	},

	getAccessToken() {
		return Promise.resolve(
			Ember.get(this, 'access_token') || (() => {
				return LocalForage.getItem('user').then( login_data => {
					let data = ( login_data && login_data.data ) || login_data;
					let access_token = data && ( data.access_token || data.id );
					Ember.set(this, 'access_token', access_token);
					return access_token;
				});
			})()
		);
	},

	getRequestFunction() {
		let function_name = this.getRequestFunctionName();
		return request_functions[function_name];
	},

	getRequestFunctionName()  {
		let request_function = Ember.get(this, 'request_function');
		let function_name = Object.keys(request_functions)
							.indexOf(request_function) ?
							request_function : 'jquery';

		return function_name;
	},

	createApiUrl(api){
		let store = Ember.get(this, 'store');
		let api_url = Ember.get(this, 'api_url');
		let namespace = store && store.adapterFor('application').get('namespace');

		if(!api) {
			return Promise.reject('No API Specified');
		} else if(namespace){
			api = api.replace(new RegExp(`^(\/+)?(${namespace})?(\/+)?`), '');
		}

		api_url = api_url || namespace;
		if(api_url) { api_url = api_url.replace(/\/$/); }

		return api_url ? `${api_url}/${api}` : api;
	},

	createRequestConfig(access_token, method, api, data, headers, contentType) {
		let function_name = this.getRequestFunctionName();

		access_token = access_token || undefined;

		let request_config = {
			url: this.createApiUrl(api),
			method: method.toUpperCase(),
			headers: Object.assign({
				'Authorization': access_token,
				'Content-Type': contentType
			}, headers)
		};

		return {
			axios: Object.assign({}, request_config, {
				[ ( method.toLowerCase() !== 'get' ) ? 'data' : 'params' ]: data
			}),
			jquery: Object.assign({}, request_config, {
				contentType: contentType,
				data: ( method.toLowerCase() !== 'get' ) ? JSON.stringify(data) : data
			})
		}[ function_name ];
	},

	createRequestSuccess(resolve) {
		let function_name = this.getRequestFunctionName();

		return function(data) {
			let success = {
				jquery: data,
				axios: data.data
			}[function_name];

			resolve(success);
		};
	},

	createRequestError(reject) {
		let function_name = this.getRequestFunctionName();

		return (error) => {
			if(error.status === 401) { this.logout(); }
			if(error.statusText === 'abort') { return null; }

			error.responseText = {
				jquery: error.responseText,
				axios: JSON.stringify(error.data)
			}[function_name];

			let reject_error = new Error(error.responseText);
			reject_error.status = error.status;
			reject(reject_error);

			console.error('======== API ERROR =======');
			console.error(error);
		};
	},

	createAbort(request) {
		return () => {
			return request.abort && request.abort();
		};
	}
});
