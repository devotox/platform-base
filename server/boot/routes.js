'use strict';

module.exports = (server) => {
	let router = server.loopback.Router();
	let restApiRoot = server.get('restApiRoot');

	require('require-all')({
		recursive: true,
		dirname: `${__dirname}/routes`,
		resolve: (route) => { route(server, router, restApiRoot); }
	});

	return server.use(router);
};
