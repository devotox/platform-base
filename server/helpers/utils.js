var net			= require('net');
var _			= require('lodash');

var internal_ip = process.env.INTERNAL_IP || '';

exports.request = require('axios');

/**
 * Checks the passed in ip to see if it is an internal platform ip address or originating from
 * the dev testing evironment.
 * The platform internal ip is read from an environment variable and if none is set
 * the function assumes that this is not an internal ip. The function also expects that both
 * ip addresses are specified in the ipv4 format.
 * @param {string} ip the ip address to check
 * @returns true if the first three numbers of the ip matches the first three numbers of the ip
 * set as the platform internal ip
 */
exports.is_internal_ip = function (ip) {
	var localhost = ['127.0.0.1', 'localhost', 'server'];
	if (localhost.indexOf(ip) > -1) {
		return false;
	}
	if (net.isIP(ip) === 4 && net.isIP(internal_ip) === 4) {
		//simple checking for now by dropping the last part of the ip address and checking if the rest is the same
		return internal_ip.substr(0, internal_ip.lastIndexOf('.')) === ip.substr(0, ip.lastIndexOf('.'));
	} else {
		return false;
	}
};

// Pass in the host and it validates if the request
// originated directly from a docker container using its networking feature
exports.is_docker_request = function(host) {
	return host.match(/^server$/);
};

// Pass in the host and it validates that the request is coming from the intranet
// Get host from express by using request.get('host');
exports.is_intranet = function(host, referer) {
	if (!host){ return false; }

	host = ('' + host).split(':')[0];
	host = ('' + host).replace(/^www\./, '');

	referer = referer || '';
	referer = ('' + referer).split('?')[0];
	referer = ('' + referer).split(':')[0];
	referer = ('' + referer).replace(/^http(s)?\:\/\//, '');
	referer = ('' + referer).replace(/^www\./, '');

	return 	( exports.is_docker_request(host) && !referer.match( /^platform(-beta)?\./ ) ) ||
			( host.match( /(platform|elasticbeanstalk)\.(local\.)?co(m|\.uk)$/ ) &&
			  host.match( /^intranet(-beta)?\./ ) ) ?
			  true : false;
};

exports.is_intranet_test_page = function(host, referer) {
	if (!host || !referer){ return false; }

	referer = ('' + referer).replace(/^http(s)?\:\/\//, '');

	referer = referer.replace(host, '');
	referer = referer.split('?')[0];

	return exports.is_intranet(host) &&
		   _.includes([ '/api/tests', '/api/tests/' ], referer);
};

exports.is_testing = function() {
	return _.includes([true, 'true'], process.env.TESTING) ? true : false;
};

// Pass in the case and a object of cases with _default being your default case
exports.switch_case = function(_case, cases) {

	cases = _.defaults(cases || {}, {
		__default__: function() {
			console.warn('** API WARNING ** - unhandled default called for case', _case);
		}
	});
	return cases[_case] ? ( _.isFunction(cases[_case]) ? cases[_case]() : cases[_case] )
						: ( _.isFunction(cases.__default__) ? cases.__default__() : cases.__default__ );
};

// Converts a string into boolean
exports.string_to_boolean = function(value){
	value = value && value.toString().toLowerCase().trim();
	exports.switch_case(value, {
		'1': true,
		'on': true,
		'yes': true,
		'true': true,
		__default__: false
	});
};

// Changes strings to title case
exports.titleize = function(title){
	if(!title){ return ''; }

	var small = '(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)';
	var punct = '([!\"\'#$%&()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)';

	function lower(word) {
		return word.toLowerCase();
	}

	function upper(word) {
		return word.substr(0, 1).toUpperCase() + word.substr(1);
	}

	function testPunctuation(all, punct, word) {
		return punct + upper(word);
	}

	function testUpper(all) {
		return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
	}

	var parts = [], index = 0,
		split = /[:.;?!] |(?: |^)["Ò]/g;

	while (true) {
		var m = split.exec(title);

		parts.push(title.substring(index, m ? m.index : title.length)
			.replace(/\b([A-Za-z][a-z.Õ]*)\b/g, testUpper)
			.replace(new RegExp('\\b' + small + '\\b', 'ig'), lower)
			.replace(new RegExp('^' + punct + small + '\\b', 'ig'), testPunctuation)
			.replace(new RegExp('\\b' + small + punct + '$', 'ig'), upper));

		index = split.lastIndex;

		if (m) { parts.push(m[0]); }
		else{ break; }
	}

	return parts.join('').replace(/ V(s?)\. /ig, ' v$1. ');
};

// builds strings through a common interface
exports.string_builder = function() {
	this.data = [];
	this.counter = 0;

	// adds string s to the stringbuilder
	this.append = function () {
		var args = Array.prototype.slice.call(arguments);
		this.data[this.counter++] = args.join(' ').trim(); return this;
	};
	// removes j elements starting at i, or 1 if j is omitted
	this.remove = function (i, j) { this.data.splice(i, j || 1); return this; };
	// inserts string s at i
	this.insert = function (i, s) { this.data.splice(i, 0, s); return this; };
	// builds the string
	this.toString = function (s) { return this.data.join(s || ''); };

	return this;
};

// Ends execution time started with `process.hrtime()` and converts it into milliseconds
exports.get_execution_time = function(start, precision) {
	if(!_.isArray(start)) { return 0; }
	var end = process.hrtime(start);
	var execution_time = (end[0] * 1000) + (end[1] / 1000000);
	return execution_time.toFixed(precision || 3);
};

// Converts an error object to a string
exports.get_error = function(error) {
	return error && error.toString().replace('error:', '').trim();
};

// Checks if a value exists
exports.exists = function(value) {
	return ( value || value === false || value === 0 ) && ( value !== null && typeof value !== 'undefined' );
};

// Create a tree from flat array with parent ids
exports.create_hierarchy = function(rows) {
	var tree = [];

	var heirarchy_map = rows.reduce(function(map, node) {
		map[node.id || node.name] = node;
		return map;
	}, {});

	_.forEach(rows, function(node) {
		var parent = heirarchy_map[node.parent_id || node.parent_name];
		if (parent) {
			( parent.children || ( parent.children = [] ) ).push(node);
		} else {
			tree.push(node);
		}
	});

	return tree;
};

exports.run_shell_command = function(cmd, args, buffer_callback, buffer_error_callback, buffer_end_callback) {
	var spawn = require('child_process').spawn;
	var child = spawn(cmd, args);
	var response = '';
	var error = '';

	child.stderr.on('data', function (buffer) {
		var data = buffer.toString();
		error += data;
		return buffer_error_callback && buffer_error_callback(data);
	   });

	child.stdout.on('data', function (buffer) {
		var data = buffer.toString();
		error += data;
		return buffer_callback && buffer_callback(data);
	});

	child.stdout.on('end', function() {
		return buffer_end_callback && buffer_end_callback(response);
	});

	return null;
};

// gets the permission set as an object
exports.get_permission_set = function(permission_bit) {
	var owner_flag = 4;  // 100 === 100
	var edit_flag  = 6;  // 100 | 010 === 110
	var view_flag  = 7;  // 100 | 010 | 001 === 111

	return {
		is_editable: (permission_bit & edit_flag) ? true : false,
		is_viewable: (permission_bit & view_flag) ? true : false,
		is_owner:    (permission_bit & owner_flag) ? true : false
	};
};

exports.get_s3_image_bucket_data = function(type, id) {

	if(!id){ return {}; }
	type = type || 'profile_image';

	var _default = {
		type: type,
		ext: '.jpg',
		temp: 'tmp/',
		max_files: 0, // unlimited
		store_as_array: true,
		small_image_size: 50,
		large_image_size: 200,
		bucket: 'profile_images/'
	};

	var profile_logos = _.defaults({
		bucket: 'profile_logos/',
		store_as_array: false,
		large_image_size: 200,
		small_image_size: 50,
		max_files: 1
	}, _default);

	var profile_icons = _.defaults({
		bucket: 'profile_icons/',
		store_as_array: false,
		large_image_size: 200,
		small_image_size: 50,
		max_files: 1
	}, _default);

	var profile_covers = _.defaults({
		bucket: 'profile_covers/',
		store_as_array: false,
		large_image_size: 800,
		small_image_size: 200,
		max_files: 1
	}, _default);

	var return_value = exports.switch_case(type, {
		__default__: _default,
		profile_image: _default,
		profile_icon: profile_icons,
		profile_logo: profile_logos,
		profile_cover: profile_covers
	});

	return_value.temp_key = return_value.temp + return_value.bucket + id + return_value.ext;
	return_value.attributes_key = return_value.store_as_array ? `${return_value.type}s` : return_value.type;
	return return_value;
};
