#!/usr/bin/node

'use strict';

let path = require('path'),
	forever = require('forever-monitor'),
	__file = path.join(__dirname, 'app.js');

var child = new (forever.Monitor)(__file, {
	max: 1000,
	watch: false,
	silent: false,
	killTree: true,
	minUpTime: 5000,
	spinSleepTime: 3000
});

// Forever Monitor Events
child.on('watch:restart', function(info) {
	console.info('Restaring server because ' + info.file + ' changed' + '\n');
});

child.on('restart', function() {
	console.info('Forever restarting ' + __file + ' for ' + child.times + ' times(s)' + '\n');
});

child.on('exit:code', function(code) {
	console.error('Forever detected ' + __file + ' exited with code ' + code + '\n');
});

child.on('exit', function () {
	console.error(__file + ' has exited after ' + child.times + ' restart(s)' + '\n');
});

child.start();
