#!/usr/bin/node

'use strict';

// Configure PM2 Keymetrics ( must come before requiring any http modules )
let pmx 			= require('pmx').init({ http : true });

let fs				= require('fs');
let path			= require('path');
let http			= require('http');
let https			= require('https');
let helmet			= require('helmet');
let express			= require('express');
let Promise 		= require('bluebird');
let loopback		= require('loopback');
let bodyParser		= require('body-parser');
let compression		= require('compression');
let boot			= require('loopback-boot');

// Configure PG (allow named parameters in stored procedures)
require('pg-spice').patch(require('pg'));

// Configure Bluebird Promise Library
Promise.config({
	warnings: true,
	monitoring: false,
	cancellation: true,
	longStackTraces: true
});

// Configure DNS
// require(path.join(__dirname, 'dns-cache.js'));

// Configure Max Listeners
// require('events').EventEmitter.prototype._maxListeners = -1;

// setup the server configuration based on environment / command-line options
let configuration = {
	version: '1',
	host: 'localhost',
	node_port: parseInt( process.env.NODE_PORT ) || 3000
};

let certificates = {
	private_key_path: path.join(__dirname, '../sslcert/server.key'),
	certificate_path: path.join(__dirname, '../sslcert/server.crt'),

	ca1_path: path.join(__dirname, '../sslcert/bundle_1.crt'),
	ca2_path: path.join(__dirname, '../sslcert/bundle_2.crt'),
	ca3_path: path.join(__dirname, '../sslcert/bundle_3.crt')
};

// configure the SSL certificates
let privateKey	= fs.readFileSync(certificates.private_key_path, 'utf8');
let certificate = fs.readFileSync(certificates.certificate_path, 'utf8');

let certificate_authorities = [
	fs.readFileSync(certificates.ca1_path, 'utf8'),
	fs.readFileSync(certificates.ca2_path, 'utf8'),
	fs.readFileSync(certificates.ca3_path, 'utf8')
];

let credentials = {
	key: privateKey,
	cert: certificate,
	ca: certificate_authorities
};

// define global paths
global.website_path 	= path.join(__dirname, '../', 'website/');
global.platform_path 	= path.join(__dirname, '../');
global.api_path 		= path.join(__dirname, '/');

global.configuration = configuration;
global.version = configuration.version;

/* LOOPBACK APP */
let app = module.exports = loopback();

// Protect against known vulnerabilities
app.use(helmet());
app.use(helmet.noCache());

// Common Middleware
app.use(compression());
app.use(express.query());
app.set('view engine', 'hbs');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(loopback.token({ model: app.models.accessToken, currentUserLiteral: 'me' }));

// Static Files for Qunit / Mocha testing
app.use(app.get('restApiRoot') || '' + '/tests', express.static(__dirname + '/tests'));
app.use(app.get('restApiRoot') || '' + '/assets', express.static(__dirname + '/tests/assets'));

// Attach PMX
app.use(pmx.expressErrorHandler());

app.start = () => {
	let host		= app.get('host');
	let port		= app.get('apiPort');
	let httpOnly	= app.get('httpOnly');
	let restApiRoot = app.get('restApiRoot');

	let socket_paths = {
		sockets: global.api_path + 'sockets',
		client: global.website_path + 'vendor',
		server: global.api_path + 'socket-server'
	};

	// Create Servers
	module.exports.server = httpOnly ? http.createServer(app) : https.createServer(credentials, app);
	module.exports.socket_server = require(socket_paths.server)(module.exports.server, socket_paths);

	// start the web server
	return module.exports.server.listen(port, () => {
		let baseUrl = (httpOnly ? 'http://' : 'https://') + host + ':' + port;
		console.info('Web server listening at: %s', baseUrl);
		global.api_prefix = baseUrl + restApiRoot;
		app.emit('API Started...');

		if (app.get('loopback-component-explorer')) {
			let explorerPath = app.get('loopback-component-explorer').mountPath;
			console.info('Browse your REST API at %s%s', baseUrl, explorerPath);
		}
	});
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, err => {
	if (err) { throw err; }

	// start the server if `$ node server.js`
	if (require.main === module) { app.start(); }
});

// handle errors
process.on('uncaughtException', function (error) {
	console.log('\n============================ !!!!! ERROR !!!!! ===============================\n');
	console.error('Uncaught Exception:', error.message);
	console.error(error.stack);
	console.log('\n============================ !!!!! ERROR !!!!! ===============================\n');

	pmx.notify(error);
	process.exit(1);
});
