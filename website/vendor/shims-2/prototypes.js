//Javascript Prototype Extensions
(function(window, undefined){
	if (!window.location.origin) {
	  	window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}
	if (typeof Object.create !== 'function') {
		Object.create = function (obj) {
			function F() { }
			F.prototype = obj;
			return new F();
		};
	}
   if (!Object.keys) {
		Object.keys = function(o) {
			var a = [];
			for (var i in o)
				if (o.hasOwnProperty(i)) a.push(i);
			return a;
		};
	}
	
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		}; 
	}
	if (!String.prototype.format){
		String.prototype.format = function(){
			var args = arguments;
			return this.replace(/\{(\d+)\}/g, function($0, $1){
				return args[$1] !== void 0 ? args[$1] : $0;
			})
		}
	}
	if (!String.prototype.dateFormat){
		String.prototype.dateFormat = function(to_format, from_format){
			from_format = from_format || 'yyyy-MM-dd';
			var date = Date.parseExact(this, from_format);
			if(!date) return date;
			return date.toString(to_format);
		}
	}
	if (!String.prototype.isInt) {
		String.prototype.isInt = function () {
			return (Math.floor(this) === parseInt(this));
		}; 
	}
	if (!String.prototype.contains) {
		String.prototype.contains = function (it) {
			if(this.indexOf)
			   return this.indexOf(it) != -1;
			else if(this.search)
				return this.search(it) != -1;
			else
				return this.match(new RegExp(it, 'i'));
		}; 
	}
	if (!String.prototype.icontains) {
		String.prototype.icontains = function (it) {
			return this.match(new RegExp(it, 'i'));
		}; 
	}
	if (!String.prototype.ucfirst) {
		String.prototype.ucfirst = function () {
			return this.charAt(0).toUpperCase() + this.substr(1); 
		}; 
	}
	if (!String.prototype.lcfirst) {
		String.prototype.lcfirst = function () {
			return this.charAt(0).toLowerCase() + this.substr(1); 
		};
	}
	
	if (!String.prototype.hasWhiteSpace) {
		String.prototype.hasWhiteSpace = function () {			
			return this.contains(' ');
		}
	}
	
	if (!String.prototype.toCamelCase) {
		String.prototype.toCamelCase = function () {
			return this
				.replace(/\s+([^\s])/g, function(b, a) { return a.toUpperCase(); })
				.replace(/^[A-Z]/, function(a) { return a.toLowerCase(); });
		};
	}
	if (!String.prototype.fromCamelCase) {
		String.prototype.fromCamelCase = function (upperFirst) {
			var str = this.replace(/([A-Z])/g, " $1");
			str.replace(/^./, function (str) { return str.toUpperCase(); });
			   
			if (upperFirst) str = str.charAt(0).toUpperCase() + str.substr(1); 
			return str;
		}
	}
	if (!String.prototype.toUnderScore) {
		String.prototype.toUnderScore = function () {
			return this
				.replace(/\s+/g, '_')
				.replace(/^[A-Z]/, function(a) { return a.toLowerCase(); });
		};
	}
	if (!String.prototype.fromUnderScore) {
		String.prototype.fromUnderScore = function (upperFirst) {
			var str = this .replace(/\_/g, ' ')

			if (upperFirst) str = str.charAt(0).toUpperCase() + str.substr(1); 
			return str;
		};
	}
	if (!String.prototype.escape) {
		String.prototype.escape = function() {
			return this.replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		}
	}
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(start) {
			return new RegExp("^"+start).test(this);
		}
	}
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function(end) {
			return new RegExp(end+"$").test(this);
		}
	}
	if (!Number.prototype.isNan) {
		Number.prototype.isNan = function () {
			return isNaN(this);
		}; 
	}
	if (!Number.prototype.isInt) {
		Number.prototype.isInt = function () {
			return (!this.isNan() && Math.floor(this) === parseInt(this)); 
		}; 
	}
	if (!Number.prototype.mod) {
		Number.prototype.mod = function (n) {
			return ( (this % n) + n ) % n;
		}; 
	}
	if (!Number.prototype._toFixed) {
		Number.prototype._toFixed = function(n) {
			num = this;
			n = Number(n) || 0;
			num = Math.round( num * Math.pow(10, n) );
			num /= Math.pow(10, n);
			return num.toFixed(n);
		};
	}
	
	if (window.Storage) {
		if (!Storage.prototype.setObject) {
			Storage.prototype.setObject = function (key, obj) {
				return this.setItem(key, JSON.stringify(obj));
			}; 
		}
		if (!Storage.prototype.getObject) {
			Storage.prototype.getObject = function (key) {
				return JSON.parse(this.getItem(key));
			};
		 }
	}
})(window);
