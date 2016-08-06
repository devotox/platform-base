'use strict';

let _ = require('lodash');
let glob = require('glob');
let path = require('path');
let Primus = require('primus');

let default_paths = {
	client: 'website',
	sockets: 'sockets',
	server: 'socket-server'
};

let boot = (server, primus, paths) => {

	_.forEach(paths, (path, i) => {
		paths[i] = path.replace(/\/$/, '') + '/';
	});

	primus.plugin('emit', require('primus-emit'));
	primus.plugin('rooms', require('primus-rooms'));
	primus.plugin('multiplex', require('primus-multiplex'));

	if (paths.client) { try { primus.save(paths.client + 'primus.js'); } catch (e) {} }

	glob.sync(paths.sockets + '**/*.js').forEach(file => {
		require(path.resolve(file))(server, primus);
	});
};

let connect = (primus) => {
	return primus.on('connection', (socket) => {
		console.info('Primus User Connected.');

		socket.on('disconnection', () => {
			console.info('Primus User Disconnected.');
		});
	});
};

module.exports = (server, paths) => {
	let primus = new Primus(server, {
		transformer: 'uws',
		parser: 'binary'
	});

	paths = _.defaults(paths, default_paths);

	console.info('Booting sockets from ' + paths.sockets);
	boot(server, primus, paths);
	connect(primus);

	return primus;
};
