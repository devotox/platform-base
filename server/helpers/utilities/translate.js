'use strict';
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');
var T = require('./translator').Translator;

var args = process.argv.slice(2);
var target = args[0] || 'es';
var source = args[1] || 'en';
var path_prefix = '../../../';

var file = fs.readFileSync(path_prefix + 'website/app/locales/en/translations.js', { encoding: 'utf8' });

file =  file.replace('import ENV from \'../../config/environment\';', '')
			.replace('export default {', 'module.exports = {')
			.replace('"assets": ENV.i18n.assets,', '');

fs.writeFileSync('/tmp/translations-exports.js', file, { encoding: 'utf8' });
file = require('/tmp/translations-exports.js');
fs.unlink('/tmp/translations-exports.js');

var t = new T({
	source: source,
	target: target,
	max_retries: 5
});

console.log('Converting From', source, 'to', target, '...');

var tasks = [];
var return_obj = file;

var iterate = function(obj, key) {
	_.forEach(obj, function(o, k) {
		if (key) { k = key + '.' + k; }

		if (_.isObject(o)) {
			iterate(o, k);
		} else { translate(o, k); }
	});
};

var translate = function(str, key) {
	if (!str) { return; }

	tasks.push(t.translate(str).then(function(response) {

		var current_key = {};
		var translated = response;
		var key_arr = key.split('.');
		var key_arr_len = key_arr.length;

		_.forEach(key_arr, function(k, i) {
			if (key_arr_len === 1) { return return_obj[k] = translated; }
			if (key_arr_len - 1 === i) { return current_key[k] = translated; }
			current_key = current_key[k] || return_obj[k];
		});
	}).catch(function(error) {
		console.error('Translate Error:', error, 'Key:', key);
	}));
};

iterate(file);

var imp_stmt = [
	'import ENV from \'../../config/environment\';',
	'export default {',
	'\t"assets": ENV.i18n.assets,\n'
];

Promise.all(tasks).then(function() {
	var f = JSON.stringify(return_obj, null, '\t');
	f = f.replace('{', imp_stmt.join('\n\n')) + ';'; console.log(f);
	try { fs.mkdirSync(path_prefix + 'website/app/locales/' + target); } catch (e) {}
	fs.writeFileSync(path_prefix + 'website/app/locales/' + target + '/translations.js', f);
}).catch(function(error) {
	console.log('ERROR', error);
}).finally(function() {
	process.exit();
});
