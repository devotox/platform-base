#!/usr/bin/env node

"use strict";

var __file = process.cwd() + '/api/app.js';

var forever = require('forever-monitor');

var child = new (forever.Monitor)(__file, {
	watch: false,
	silent: false,
	killTree: true,
	minUpTime: 2000,
	spinSleepTime: 2000
});

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