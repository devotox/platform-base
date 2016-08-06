import Ember from 'ember';

import ENV from '../config/environment';

export function initialize(application) {
	let i18n = application.lookup('service:i18n');
	let device = application.lookup('service:device');

	let previous_language =  i18n.get('locale') || 'en';
	let all_languages = [].concat( i18n.get('locales') );
	let user_language = device.query('lang') ||
						navigator.userLanguage  ||
						navigator.language;

	i18n.set('locale', function(){
		let lang = ( user_language || previous_language ).toLowerCase();
		return all_languages.includes(lang) ? lang : previous_language;
	}());

	if(ENV.isProduction) { return; }

	Ember.Logger.debug('[ \'i18n\' ]', 'User Language:', user_language);
	Ember.Logger.debug('[ \'i18n\' ]', 'Previous Language:', previous_language);
	Ember.Logger.debug('[ \'i18n\' ]', 'Current Language:', i18n.get('locale'));
	Ember.Logger.debug('[ \'i18n\' ]', 'All Languages:', all_languages.join(', '));
}

export default {
	name: 'i18n',
	after: 'ember-i18n',
	initialize: initialize
};
