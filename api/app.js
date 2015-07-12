#!/usr/bin/env node

"use strict";

var __cwd			= process.cwd();
var fs				= require('fs');
var https			= require('https');
var _				= require('lodash');
var argv			= require('winston');

var express			= require('express');
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser');
var session			= require('express-session');


// setup the server configuration based on environment / command-line options
var configuration = {
	db_version: "v1",
	host: "localhost",
	model_version: "v1",
	controller_version: "v1",
	session_secret: "session_secret",
	node_port: argv.http || process.env.NODE_PORT || 3000
};

var certificates = {
	private_key_path: __cwd + "/sslcert/server.key",
	certificate_path: __cwd + "/sslcert/server.crt",

	ca1_path: __cwd + "/sslcert/bundle_1.crt",
	ca2_path: __cwd + "/sslcert/bundle_2.crt",
	ca3_path: __cwd + "/sslcert/bundle_3.crt"
}

configuration = _.extend(configuration, certificates);

// define globals defaults (consider refactoring)
global.latest_db_version = configuration.db_version;
global.latest_model_version = configuration.model_version;
global.latest_controller_version = configuration.controller_version;

// create the express framework
var app = express();

// Static Files for Qunit / Mocha testing

app.use('/api/tests', express.static(__dirname + '/tests'));

app.use('/api/assets', express.static(__dirname + '/tests/assets'));

app.use('/api/chai', express.static(__dirname + '/node_modules/chai'));

app.use('/api/axios', express.static(__dirname + '/node_modules/axios/dist'));

app.use('/api/qunit', express.static(__dirname + '/node_modules/qunitjs/qunit'));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: configuration.session_secret, saveUninitialized: true, resave: false }));

app.use(express.query());

app.all('*', function (req, res) {
  res.send('{ "Hello": "World!" }');
});


// configure the SSL certificates
var privateKey	= fs.readFileSync(configuration.private_key_path, 'utf8');
var certificate = fs.readFileSync(configuration.certificate_path, 'utf8');

var certificate_authorities = [
	fs.readFileSync(configuration.ca1_path, 'utf8'),
	fs.readFileSync(configuration.ca2_path, 'utf8'),
	fs.readFileSync(configuration.ca3_path, 'utf8')
];

var credentials = { key: privateKey, cert: certificate, ca: certificate_authorities };

// start the app!
var https_server = module.exports = https.createServer(credentials, app);
https_server.listen( configuration.node_port );

console.info('API started ... (CTRL + C: stop)');
console.info('API listening at https://%s:%s', configuration.host, configuration.node_port);

// handle errors
process.on('uncaughtException', function (error) {
	console.log('\n============================ !!!!! ERROR !!!!! ===============================\n');
	console.error('Uncaught Exception:', error.message);
	console.error(error.stack);
	console.log('\n============================ !!!!! ERROR !!!!! ===============================\n');
	process.exit(1);
});
