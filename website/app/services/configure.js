import Ember from 'ember';

import Promise from 'npm:bluebird';

import FastClick from 'npm:fastclick';

export default Ember.Service.extend({

	init() {
		this._super(...arguments);
		this.origin();
		this.promise();
		this.manifest();
		this.fastclick();
	},

	promise() {
		Promise.config({
			warnings: true,
			monitoring: true,
			cancellation: true,
			longStackTraces: true
		});
	},

	fastclick() {
		Ember.run.scheduleOnce('afterRender', function() {
			FastClick(document.body);
		});
	},

	origin() {
		if (window.location.origin) { return; }
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	},

	manifest() {
		window.addEventListener('load', () => {
			// window.applicationCache.update();
			window.applicationCache.addEventListener('updateready', () => {
				if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
					// window.applicationCache.swapCache();
					setTimeout(() => { window.location.reload(); }, 1000);
				}
			}, false);
		}, false);
	}
});
