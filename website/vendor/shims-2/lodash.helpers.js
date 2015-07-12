
(function ($, _, window, undefined) {
	_.mixin({
		profile: function(fn) {
			return function(profileId) {
				// start profiler
				console.profile(profileId);

				// call our real function
				fn.apply(this, arguments);

				// stop profiler
				console.profileEnd(profileId);
			}
		}
	});
})(window.jQuery, window._, window);