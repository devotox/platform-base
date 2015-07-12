#!/usr/bin/env node

"use strict";

var pm2 = require('pm2');
pm2.connect(function(){
	pm2.start("api/server.js", {
		"cwd": __dirname,

		"name": "API Server",
		"script": "api/server.js",

		"max_restarts": 5,
		"max_memory_restart": "100M",

		"instances": 0,
		"exec_interpreter": "node",
		"exec_mode": "cluster_mode",

		"pid_file": "/var/run/pm2.pid",
		"error_file": "/var/log/pm2.log",
		"out_file": "/var/log/pm2.out.log",

		"merge_logs": true,
		"autorestart": true,
		"cron_restart": "1 0 * * *",
		"log_date_format": "YYYY-MM-DD HH:mm Z",

		"watch": false,
		"ignore_watch": ["[\\/\\\\]\\./", "node_modules"]
	});
});
