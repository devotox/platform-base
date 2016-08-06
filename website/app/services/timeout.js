import Ember from 'ember';

export default Ember.Service.extend({

	setup: function() {
		window.AnimationFrame.shim();
	}.on('init'),

	wait(delay, callback, start) {
		if(typeof callback !== 'function'){ return; }
		if(!parseInt(delay)){ delay = 0; }

		return (window.requestAnimationFrame || window.setTimeout)( timestamp => {
			start = start || timestamp;
			if( timestamp - start < delay ) {
				return this.wait(delay, callback, start);
			}
			callback();
		});
	},
	cancel(id) {
		return (window.cancelAnimationFrame || window.clearTimeout)(id);
	},
	profile(fn) {
		return function(profileId) {
			// start profiler
			console.profile(profileId);

			// call our real function
			fn.apply(this, arguments);

			// stop profiler
			console.profileEnd(profileId);
		};
	},
});
