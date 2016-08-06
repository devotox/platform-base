/*!
 * jQuery Extensions
 *
 * Copyright 2014 Devonte
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 *
 */

 //Touch Methods
(function ($, window, undefined) {
	'use strict';

	$.fn.extend({
		touchstart:function(fn){
			$(this).bind('touchstart', fn);
		},
		touchend:function(fn){
			$(this).bind('touchend', fn);
		},
		touchmove:function(fn){
			$(this).bind('touchmove', fn);
		},
		touchdrag:function(fn){
			$(this).bind('touchdrag', fn);
		}
	});
})(window.jQuery, window);

// Extend jQuery AJAX with functions for PUT and DELETE requests.
(function ($, window, undefined) {
	'use strict';

	function _ajax_request(url, data, callback, type, method) {
		if ($.isFunction(data)) {
			callback = data;
			data = {};
		}
		return $.ajax({
			url: url,
			data: data,
			type: method,
			dataType: type,
			success: callback
		});
	}

	$.fn.extend({
		put: function(url, data, callback, type) {
			return _ajax_request(url, data, callback, type, 'PUT');
		},
		'delete': function(url, data, callback, type) {
			return _ajax_request(url, data, callback, type, 'DELETE');
		}
	});
})(window.jQuery, window);
