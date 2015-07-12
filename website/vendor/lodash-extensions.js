/*!
* Lodash Extensions
*
* Copyright 2014 Devonte
* @license http://www.opensource.org/licenses/mit-license.html MIT License
* @license http://www.gnu.org/licenses/gpl.html GPL2 License
*
*/
(function(_, window){
	'use strict';

	_.mixin({
		keycode: function(k){
			return { 
				up: 38, down: 40, left: 37, right: 39
			}[k]
		},
		viewport: function(){
			var e = window, a = 'inner';
			if(!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return {
				width: e[a + 'Width'],
				height: e[a + 'Height']
			}
		},
		profile: function(fn) {
			return function(profileId) {
				// start profiler
				console.profile(profileId);

				// call our real function
				fn.apply(this, arguments);

				// stop profiler
				console.profileEnd(profileId);
			}
		},
		wait: function(delay, callback, start) {
			if(typeof callback != 'function') return;
			if(!parseInt(delay)) return callback();

			return window.requestAnimationFrame(function (timestamp) {
				start = start || timestamp;
				if( timestamp - start < delay ) {
					return _.wait(delay, callback, start); 
				}
				callback();
			});		
		},
		cancelWait: function(id) {			
			window.cancelAnimationFrame(id);
		},
		sortObjects: function(arrayOfObjects, sortBy, reverse) {
			var sortingFunction = null,
				ordering = function (A, B) { return (A > B ? 1 : (A == B ? 0 : -1)); },
				lower = function(A, B) { return [ _.isFunction(A.toLowerCase) ? A.toLowerCase() : A, _.isFunction(B.toLowerCase) ? B.toLowerCase() : B ]; }
			if(typeof sortBy === 'string') {
				sortingFunction = function(a, b) {
					var A = a[sortBy];
					var B = b[sortBy];
					var AB = lower(A, B);
					return ordering(AB[0], AB[1]);
				};
			} else if(_.isFunction(sortBy)) {
				sortingFunction = function(a, b) {
					var A = sortBy.apply(a);
					var B = sortBy.apply(b);
					var AB = lower(A, B);
					return ordering(AB[0], AB[1]);
				};
			}
			return arrayOfObjects.sort(function() {
				return sortingFunction.apply(this, arguments) * (reverse ? -1 : 1);
			});
		},		
		toBase64: function(str){
			try {
				return window.btoa(unescape(encodeURIComponent( str )));
			} catch (e) {
				return window.btoa( str );
			}
		},
		fromBase64: function(str) {
			try {
				return decodeURIComponent(escape(window.atob( str )));
			} catch (e) {
				return window.atob( str );
			}
		},
		encodeUTF8: function(s){
			return unescape( encodeURIComponent( s ) );
		},
		decodeUTF8:  function(s){
			return decodeURIComponent( escape( s ) );
		},
		StringBuilder: function() {
			this.data = [];
			this.counter = 0;

			// adds string s to the stringbuilder
			this.append = function (s) { this.data[this.counter++] = s; return this; }
			// removes j elements starting at i, or 1 if j is omitted
			this.remove = function (i, j) { this.data.splice(i, j || 1); return this; }
			// inserts string s at i
			this.insert = function (i, s) { this.data.splice(i, 0, s); return this; }
			// builds the string
			this.toString = function (s) { return this.data.join(s || ""); }

		},
		AlphaIterator: function(alpha, lowercase) {
			var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			if (!lowercase) {
				alpha = alpha.toUpperCase();
				characters = characters.toUpperCase();
			}
			else {
				alpha = alpha.toLowerCase();
				characters = characters.toLowerCase();
			}

			var idx = characters.indexOf(alpha);

			this.next = function () {
				idx++; idx = idx % 26;
				return characters.charAt(idx);
			}
			this.previous = function () {
				idx--; idx = idx % 26;
				return characters.charAt(idx);
			}
		},
		uuid: function(len) {
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r, v;
				r = Math.random() * 16 | 0;
				v = c === 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
			if (!len) return uuid;
			return uuid.replace(/\-/g, '').substring(0, len);
		}, 
		regex: function(){
			return {
				Alpha: /^[a-z]+$/i,
				AlphaNumeric: /^\w+$/i,
				AlphabetWithPunctuation: /^[a-z_.,\-\(\)\s\']+$/i,
				AlphaNumericWithPunctuation: /^[\w_.,\-\(\)\s\']+$/i,
				Email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
				UKPhones: /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)?44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{5}\)?[\s-]?\d{4,5}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/,
				UKLandline: /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)?44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(2\d[2-9]\d{7}|1(?:1\d|\d1)[2-9]\d{6}|1(?:[248][02-9]\d[2-9]\d{4,5}|(?:3(?:[02-79]\d|8[0-69])|5(?:[04-9]\d|2[0-35-9]|3[0-8])|6(?:[02-8]\d|9[0-689])|7(?:[02-5789]\d|6[0-79])|9(?:[0235-9]\d|4[0-5789]))[2-9]\d{4,5}|(?:387(?:3[2-9]|[24-9]\d)|5(?:24(?:2[2-9]|[3-9]\d)|39(?:[456][2-9]|[23789]\d))|697(?:[347][2-9]|[25689]\d)|768(?:[347][2-9]|[25679]\d)|946(?:7[2-9]|[2-689]\d))\d{3,4}))$/,
				UKMobile: /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)?44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)7(?:[1-4]\d\d|5(?:0[0-8]|[13-9]\d|2[0-35-9])|624|7(?:0[1-9]|[1-7]\d|8[02-9]|9[0-689])|8(?:[014-9]\d|[23][0-8])|9(?:[04-9]\d|1[02-9]|2[0-35-9]|3[0-689]))\d{6}$/,
				UKPostcode: /^(GIR 0AA)|(((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i,
				NIN: /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-DFM]{0,1}$/i,
				USPhone: /^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/,
				USZip: /\d{5}-\d{4}$|^\d{5}$/
			};
		}
	});
}(window._, window));