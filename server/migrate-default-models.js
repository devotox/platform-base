#!/usr/bin/node

'use strict';

let source = process.argv[2] || 'platform';

let server = require('./app');
let ds = server.dataSources[source];
let models = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];

ds.automigrate(models, function(error) {
	if (error){ throw error; }
	console.log(`Loopback tables [${models}] created in ${ds.adapter.name}`);
	ds.disconnect();
});
