import Ember from 'ember';

import axios from 'npm:axios';

import Promise from 'npm:bluebird';

export default Ember.Service.extend({
	API_KEY: '',
	url: 'https://maps.googleapis.com/maps/api/geocode/json',
	geocode(search) {
		return new Promise( (resolve, reject) => {
			let request_config = {
				method: 'GET',
				url: this.get('url'),
				params: {
					address: search,
					API_KEY: this.get('API_KEY')
				}
			};
			return axios(request_config)
			.then( (result) => {
				resolve(result.data.results);
			})
			.catch( (result) => {
				reject(new Error(result.data.error));
			});
		});
	}
});
