import Ember from 'ember';

export default Ember.Service.extend({
	__Device__: function() {
		var ua = this.userAgent = window.navigator.userAgent;

		this.is = function(type){
			return (type && ua) ? ua.match( new RegExp(type, 'i') ) : false;
		};

		this.IEVersion = (function(){
			var re = null;

			if (window.navigator.appName === 'Microsoft Internet Explorer'){
				re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			} else if (window.navigator.appName === 'Netscape') {
				re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			}

			return re.exec(ua) !== null ? parseFloat( RegExp.$1 ) : -1;
		}());

		this.isIE = this.IEVersion !== -1 ? true : false;

		this.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		this.isOpera = !!window.opera || this.userAgent.indexOf(' OPR/') >= 0;
		this.isWindowsPhone = this.userAgent.indexOf("Windows Phone") >= 0;
		this.isFirefox = typeof InstallTrigger !== 'undefined';
		this.isChrome = !!window.chrome && !this.isOpera;

		this.isIPod = /iPod/.test(this.userAgent) && !this.isWindowsPhone;
		this.isIPad = /iPad/.test(this.userAgent) && !this.isWindowsPhone;
		this.isIPhone = /iPhone/.test(this.userAgent) && !this.isWindowsPhone;

		this.isIOS = /iP(ad|hone|od)/.test(this.userAgent) && !this.isWindowsPhone;
		this.isAndroid = this.userAgent.indexOf('Android') >= 0 && !this.isWindowsPhone;

		this.isMobile = this.isWindowsPhone || this.isIOS || this.isAndroid;
		this.isTouch = this.supportsTouch = !!('ontouchstart' in window || window.navigator.msMaxTouchPoints);

		this.isDesktop = !this.isMobile;
		this.isModernDesktop = !( this.isMobile || ( this.isIE && this.IEVersion < 9 ) );

		return this;
	}.on('init'),

	viewport() {
		var e = window, a = 'inner';
		if(!('innerWidth' in window)) {
			a = 'client';
			e = document.documentElement || document.body;
		}
		return {
			width: e[a + 'Width'],
			height: e[a + 'Height']
		};
	},

	keycode(k) {
		return {
			up: 38, down: 40, left: 37, right: 39
		}[k];
	},

	query(key_to_find) {
		var found;
		var query_array = window.location.search.substring(1).split("&");

		query_array.some(key => {
			var pair = key.split("=");
			if( pair[0] === key_to_find ){
				found = pair[1];
				return true;
			}
		});

		return found;
	}
});
