'use strict';
let utils = require(global.api_path + 'helpers/utils');

module.exports = (server, primus) => {

	primus.on('connection', (socket) => {

		socket.on('ws-api', (data, api_config) => {
			console.info('[ WS API ]', api_config);

			let api_prefix = global.api_prefix;
			utils.request[api_config.method](api_prefix + api_config.path, data)
				.then( data => {
					console.log('[ WS API ] [ Success ]', 'id:', data.data && data.data && data.data.data && data.data.data.id);
					socket.emit('ws-api-response', { success: true, data: data.data && data.data && data.data.data });
				}).catch( error => {
					console.log('[ WS API ] [ Error ]', error.message || '', error.data && error.data.errors && error.data.errors[0], error.data);
					socket.emit('ws-api-response', { error: true, data: error.data && error.data.errors && error.data.errors[0] });
				});
		});
	});
};
