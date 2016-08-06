#!/usr/bin/node

'use strict';

var child_process = require('child_process');

var buffer_to_string = function(data) {
	return data.toString('utf8');
};

// Nodemon
var nodemon = child_process.spawn('nodemon', [ '--debug', 'app.js' ]);
nodemon.stdout.on('data', function(data){
	console.log('[ Nodemon ]', buffer_to_string(data));
});

nodemon.stderr.on('data', function(data){
	console.error('[ Nodemon ][ Error ]', buffer_to_string(data));
});

// Node Inspector
var inspector = child_process.spawn('node-inspector', [ '--web-port', '9999' ]);
inspector.stdout.on('data', function(data){
	console.log('[ Node-Inspector ]', buffer_to_string(data));
});

inspector.stderr.on('data', function(data){
	console.error('[ Node-Inspector ][ Error ]', buffer_to_string(data));
});
