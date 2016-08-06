'use strict';

let broadcast = (message_type, primus, message, user) => {
	primus.forEach(function(socket) {
		socket.emit(message_type, message, user);
	});
};

module.exports = (server, primus) => {

	primus.on('connection', (socket) => {
		broadcast('broadcast', primus, 'new user connected!', 'broadcast');

		socket.on('chat-message', (message, user) => {
			console.info('[ chat ]', user, ':', message);
			broadcast('chat-broadcast', primus, message, user);
		});
	});
};
