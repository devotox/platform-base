/* jshint node: true */

'use strict';

module.exports = function(environment) {

	let assets = require('./assets/assets.index');

	let csp = "'self' 'unsafe-inline' 'unsafe-eval' http: https: data: blob: ws: wss: *.local.com:* *.local.co.uk:* *.ngrok.io:* *.ngrok.io:* *.ngrok.io:* *.gstatic.com *.bootstrapcdn.com *.ionicframework.com *.googleapis.com *.googleadservices.com *.googleusercontent.com *.g.doubleclick.net *.google-analytics.com *.fls.doubleclick.net *.cloudflare.com *.elasticbeanstalk.com *.amazonaws.com *.facebook.com *.facebook.net *.youtube.com *.wp.com *.gravatar.com *.getclicky.com *.prerender.io *.firebase.com *.firebaseio.com";

	let ENV = {
		rootURL: '/',
		//locationType: 'auto',
		environment: environment,
		defaultLocationType: 'auto',
		modulePrefix: 'platform-base',
		isProduction: environment === 'production',
		i18n: { defaultLocale: 'en', assets: assets },
		firebase: 'https://crackling-inferno-1293.firebaseio.com/',
		'ember-simple-auth': {
			store: 'simple-auth-session-store:local-storage',
			authenticator: 'authenticator:platform-base-auth',
			authorizer: 'authorizer:platform-base-auth',

			authenticationRoute: 'login',
			routeAfterAuthentication: 'account',
			routeIfAlreadyAuthenticated: 'account',

			sessionPropertyName: 'session',
			session: 'simple-auth-session:main',
			localStorageKey: 'ember_simple_auth:session',
			crossOriginWhitelist: [],
			applicationRootUrl: null
		},
		contentSecurityPolicy: {
			'default-src': csp,
			'connect-src': csp,
			'script-src': csp,
			'style-src': csp,
			'media-src': csp,
			'font-src': csp,
			'img-src': csp
		},
		pace: {
			// addon-specific options to configure theme
			theme: 'minimal',
			color: 'green',

			// pace-specific options
			// learn more on http://github.hubspot.com/pace/#configuration
			minTime: 100,
			ghostTime: 50,
			catchupTime: 50,
			easeFactor: 1.25,
			initialRate: 0.01,
			startOnPageLoad: true,
			maxProgressPerFrame: 20,
			restartOnPushState: true,
			restartOnRequestAfter: 500,
			target: 'body',
			elements: {
				checkInterval: 100,
				selectors: ['body', '.ember-view']
			},
			eventLag: {
				minSamples: 10,
				sampleCount: 3,
				lagThreshold: 3
			},
			ajax: {
				trackMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				trackWebSockets: false,
				ignoreURLs: []
			}
		},
		manifest: {
			network: [ 'api/' ],
			showCreateDate: true,
			includePaths: [ '/' ],
			appcacheFile: '/manifest.appcache',
			enabled: environment === 'production',
			excludePaths: [ 'index.html', 'manifest.appcache',
							'tests', 'assets', 'font', 'fonts',
							'fastboot'
						]
		},
		cordova: {
			rebuildOnChange: false,
			emulate: false,
			liveReload: {
				enabled: false,
				platform: null
			}
		},
		stripe: {
			key: 'pk_test_p3loBzHTpqUZGSj5J8HDCY43',
			publishableKey: 'pk_test_p3loBzHTpqUZGSj5J8HDCY43'
		},
		googleLeaflet: {
			apiKey: ''
		},
		'ember-cli-mirage': {
			enabled: false
		},
		'ember-cli-toggle': {
			includedThemes: ['light', 'ios', 'flip'],
			defaultTheme: 'flip',       // defaults to 'default'
			defaultSize: 'medium',      // defaults to 'medium'
			defaultOnLabel: 'True',     // defaults to 'On'
			defaultOffLabel: 'False',    // defaults to 'Off'
			defaultShowLabels: false    // defaults to false
		},
		EmberENV: {
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. 'with-controller': true
			}
		},

		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		}
	};

	if (environment === 'development') {
		// ENV.APP.LOG_STRIPE_SERVICE = true;
		// ENV.APP.LOG_RESOLVER = true;
		// ENV.APP.LOG_TRANSITIONS = true;
		// ENV.APP.LOG_VIEW_LOOKUPS = true;
		// ENV.APP.LOG_ACTIVE_GENERATION = true;
		// ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
	}

	if (environment === 'test') {
		// Testem prefers this...
		ENV.baseURL = '/';
		ENV.locationType = 'none';

		// keep test console output quiet
		ENV.APP.LOG_VIEW_LOOKUPS = false;
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV['ember-cli-mirage'].enabled = true;

		ENV.APP.rootElement = '#ember-testing';
	}

	if (environment === 'production') {
		ENV.googleAnalytics = {
			displayFeatures: true,
			webPropertyId: 'UA-XXXXXX-X'
		};
	}

	return ENV;
};
