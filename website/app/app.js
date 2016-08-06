import Ember from 'ember';
import Resolver from './resolver';
import config from './config/environment';
import loadInitializers from 'ember-load-initializers';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
	podModulePrefix: config.podModulePrefix,
	modulePrefix: config.modulePrefix,
	Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
