/* jshint node: true */

module.exports = function(environment) {
	var csp = "'self' 'unsafe-inline' 'unsafe-eval' data: *.local.com:* ws://*.local.com:* wss://*.local.com:* *.ngrok.io:* ws://*.ngrok.io:* wss://*.ngrok.io:* *.gstatic.com *.bootstrapcdn.com *.ionicframework.com *.googleapis.com *.googleadservices.com *.googleusercontent.com *.g.doubleclick.net *.google-analytics.com *.cloudflare.com *.elasticbeanstalk.com *.amazonaws.com *.facebook.com *.facebook.net";

	var ENV = {
		baseURL: '/',
		//locationType: 'auto',
		modulePrefix: 'platform-base',
		environment: environment,
		defaultLocationType: 'auto',
		isProduction: environment === 'production',
		firebase: 'https://<FIREBASE-ACCOUNT>.firebaseio.com/',
		'simple-auth': {
			store: 'simple-auth-session-store:local-storage',
			authenticator: 'authenticator:platform-base-auth',
			authorizer: 'authorizer:platform-base-auth',

			authenticationRoute: 'pages/login',
			routeAfterAuthentication: 'pages/profile',
			routeIfAlreadyAuthenticated: 'pages/account',

			sessionPropertyName: 'session',
			session: 'simple-auth-session:main',
			localStorageKey: 'ember_simple_auth:session',
			store: 'simple-auth-session-store:local-storage',
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
		cordova: {
			rebuildOnChange: false,
			emulate: false,
			liveReload: {
				enabled: false,
				platform: null
			}
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
