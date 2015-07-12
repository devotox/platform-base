
(function(window, $, undefined){
	window.DEV = window.DEV || {};
	window.DEV.utils = window.DEV.utils || {};
	window.DEV.check = window.DEV.check || {};
	window.DEV.utf8 = window.DEV.utf8 || {};
	window.DEV.crypto = window.DEV.crypto || {};
	window.DEV.geo = window.DEV.IP || {};
	
	$.extend(DEV.geo, { 
		getLocation: function () {            
			var fail, success, ret;
			
			ret = $.Deferred();
			if(!navigator || !navigator.geolocation || !navigator.geolocation.getCurrentPosition)
					return ret.reject({error: "No Geolocation"})

			success = function (position) {
				var pos = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				ret.resolve(pos);
			};
			fail = function (error) {
				console.warn("Geolocation Error: ", error.code, error.message);
				ret.reject({error: error});
			};
			navigator.geolocation.getCurrentPosition(success, fail, {
				maximumAge: 60000,
				timeout: 5000,
				enableHighAccuracy: true
			});
			return ret;
		},       
		getGeo: function(){
			if(DEV.check.isOffline()) return Promise.resolve({});
			return Promise.resolve(
				$.ajax({
					url: window.top.location.protocol + "//smart-ip.net/geoip-json?callback=?",
					dataType: 'jsonp',
					timeout: 5000
				})
			);
		},
		getIP: function(){
			return DEV.geo.getGeo().then(function(data){
				if(!data) return null;
				return data.host;
			});
		}
	});

	$.extend(DEV.check, { 
		inputSupported: function(type){
			if(!type) return type;
			var i = document.createElement("input");
			i.setAttribute("type", type);
			return i.type == type;
		},
		downloadSupported: function() {
			var a = document.createElement('a');
			return typeof a.download != "undefined";
		},
		isOnline: function(){
			return navigator.onLine;
		},
		isOffline: function(){
			return !DEV.check.isOnline();
		},
		isDate: function(value, format){
			if(Date.parseExact) return Date.parseExact(value, format || 'dd/MM/yyyy');
			return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value);
		},
		isTime: function(value, format){
			if(Date.parseExact) return Date.parseExact(value, format || 'HH:mm:ss');
			return /^([01]??\d|2[0-3])(:[0-5]\d){1,2}$/.test(value);
		},
		isDatetime: function(value, format){
			if(Date.parseExact) return Date.parseExact(value, format || 'dd/MM/yyyy HH:mm:ss');
			return /^\d{2}[- \/.]\d{2}[- \/.]\d{4}\s*?\d{2}[- :.]\d{2}$/.test(value);
		},
		isNumber: function(value){
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},
		isToken: function(value){
			return value.startsWith('{') && value.endsWith('}');
		},
		hasToken: function(value){
			return /\{([^\}]+)\}/gm.test(value);
		},
		hasTokens: function(value){
			return /\{([^\}]+)\}/gm.test(value);
		},
		getToken: function(value){
			return value.match(/\{([^\}]+)\}/gm);
		},
		getTokens: function(value){
			return value.match(/\{([^\}]+)\}/gm);
		},
		getTokenInner: function(token){
			return token.replace(/[{}]/gm,'');
		},
		replaceTokens: function(str, replaceFunction){
			if(!str || !$.isFunction(replaceFunction)) return '';
			if(!DEV.check.hasToken(str)) return str; 
			return str.replace(/\{([^\}]+)\}/gm, replaceFunction);
		},
		isMarkDown: function(string, close){
			if(close) return /^\[\/.+?\]$/.test(string);
			return  /^\[.+?\]$/.test(string);
		},
		isCoords: function(arr){
			if(!$.isArray(arr)) return false;
			validLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/.test(arr[0]);
			validLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/.test(arr[1]);
			return validLat && validLon;
		}
	});

	$.extend(DEV.utf8, {
		encode: function(s){
			return unescape( encodeURIComponent( s ) );

			for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
				s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
			);
			return s.join("");
		},
		decode: function(s){
			return decodeURIComponent( escape( s ) );

			for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
				((a = s[i][c](0)) & 0x80) &&
				(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
				o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
			);
			return s.join("");
		}
	});

	$.extend(DEV.crypto, {
		sha512: function(text){
			var shaObj = new jsSHA(text, "TEXT");
			var hash = shaObj.getHash("SHA-512", "HEX");
			return hash.toUpperCase();
		},
		md5: function(text){
			return window.md5(text);
		},
		checkHash: function(text, hash, format){
			format = format || 'sha512';
			return DEV.crypto[format](text).toLowerCase() == hash.toLowerCase();
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
		}
	});

	$.extend(DEV.utils, {  
		keycode: {
			left: 37,
			right: 39,
			up: 38,
			down: 40
		}, 		
		createZip: function(zipname, data) {
			var content, b64, zip = new JSZip();
			data = _.flatten([data]);
			_.each(data, function(v) {
				zip.file(v.name, v.data);
			});
			content = zip.generate();
			b64 = "data:application/zip;base64," + content;
			window.open(b64, "_new");
		},
		makeDataUri: function(textToEncode, contentType, charset) {
			charset = charset || 'UTF-8'
			textToEncode = (typeof textToEncode == 'string') ? textToEncode : JSON.stringify(textToEncode);       

			if(charset.toLowerCase() == 'utf-8')
				textToEncode = DEV.utf8.encode(textToEncode);

			var encodedText = window.btoa(textToEncode);
			var dataURI = 'data:' + contentType + ';charset='+charset+';base64,' + encodedText;
			return dataURI;
		},
		downloadFile: function(textToEncode, contentType, newWindow) {
			var encodedText = DEV.crypto.toBase64(textToEncode);
			var dataURI = 'data:' + contentType + ';base64,' + encodedText;
			if (newWindow) { // Not useful for application/octet-stream type
				window.open(dataURI, "_new"); 
			}
			else {
				window.top.location = dataURI;
			}
		}, 
		escapeRegExp: function(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
		textToRegex: function(param){ 
			if(!param) return new RegExp()
			if(param.charAt(0) != '/') param = '/' + param

			var last_char = param.charAt(param.length - 1),
				last_char_arr = ['/', 'i', 'g', 'm', 'y'];

			if( $.inArray(last_char, last_char_arr) == -1) param = param + '/'  

			var flags = param.replace(/.*\/([gimy]*)$/, '$1');
			var pattern = param.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
			return new RegExp(pattern, flags);
		}, 
        br2nl: function(str) {
            if(!str) return str;
            if($.isPlainObject(str) || $.isArray(str)) {
                $.each(str, function(i, v) {
                    str[i] = DEV.plugins.br2nl(v);
                });
                return str;
            }
            else return str.replace(/<br\s*\/?>/gmi,"\n");
        },
        nl2br: function(str) {
            if(!str) return str;
            if($.isPlainObject(str) || $.isArray(str)) {
                $.each(str, function(i, v) {
                    str[i] = DEV.plugins.nl2br(v);
                });
                return str;
            }
            else return str.replace(/\n/gm, "<br />");
        },
        nobr: function(str){
            if(!str) return str;
            if($.isPlainObject(str) || $.isArray(str)) {
                $.each(str, function(i, v) {
                    str[i] = DEV.plugins.nobr(v);
                });
                return str;
            }
            else return str.replace(/<br\s*\/?>/gmi,"");
        },
        stripTags: function(value) {
        	if(!value) return value;
        	return ('' + value).replace(/(<([^>]+)>)/gmi, '');
        },
		cleanName: function(name){
			if(!name) return name;
			name = $.trim(name);
			return name.replace(/[^a-z0-9-_]/gi, '-');
		},
		escape: function(str){
			var arr = [];
			var obj = {};
			if($.isArray(str)){
				$.each(str, function(i,v){
					arr.push(DEV.utils.escape(v));
				});
				return arr;
			}
			else if($.isPlainObject(str)){
				$.each(str, function(i,v){
					obj[DEV.utils.escape(i)] = DEV.utils.escape(v);
				});
				return obj;
			}
			else return $('<div/>').html(str).text();
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
		query: function(top, q){
			if(typeof top === 'undefined') top = true;
			var win = top ? window.top : window;
			var url = q || win.location.href;
			
			if(q){
				var qArr = q.split('?');
				q = (qArr.length == 2) ? qArr[1] : qArr[0];
			}
			q = decodeURIComponent(q || win.location.search.substring(1));

			var params = {};
			_.each(q.split('&'), function(v){
				var a = v.split('=');
				if(a.length != 2) return true;
				params[ a[0] ] = a[1];
			});

			var self = this;
			var fn = {
				site: function(){
					return [ win.location.protocol, '//', win.location.hostname, win.location.pathname ].join('');
				},
				hash: function(){
					return url.split('#')[1]
				},
				url: function(){
					return url;
				},
				queryString: function(a){
					if(a === true) return q;
					return '?' + q;
				},
				params:function(){
					return params;
				},
				get: function(key){
					return params[key];
				},
				set: function(key, value){
					if(_.isObject(key)){
						_.each(key, function(v, i){
							fn.set(i, v);
						})
					}
					else params[key] = value;
					return fn;
				},
				del: function(key) {
					if(_.isObject(key)){
						_.each(key, function(v){
							fn.del(v);
						})
					}
					else delete params[key];
					return fn;
				},
				remove: function(parameter) {
					var hashparts = url.split("#");
					var _url = hashparts.shift();
					var urlparts = _url.split('?');

					if(urlparts.length > 2){
						urlparts = [ urlparts.shift(), urlparts.join('?') ];
					}

					var _get = function(pars) {						
						_url = urlparts[0];
						if(pars.length) _url += '?' + pars.join('&');
						if(hashparts.length) _url += '#' + hashparts.join('#');
						return _url;
					};
					var _slice = function(pars, prefix) {
						//reverse iteration as may be destructive
						for (var i = pars.length; i-- > 0;) {  
							if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
								pars.splice(i, 1);
							}
						}
						return pars;
					};

					if(!parameter) {
						return _get([]);
					} else if (urlparts.length >= 2) {
						var prefix, pars = urlparts[1].split(/[&;]/g);

						if(_.isString(parameter)) {
							prefix = encodeURIComponent(parameter)+'=';
							pars = _slice(pars, prefix);
						} else {
							_.each(parameter, function(v) {
								var prefix = encodeURIComponent(v)+'=';
								pars = _slice(pars, prefix);
							});
						}
						return _get(pars);

					} else {
						return url;
					}
				},
				build: function(full, site){
					var ret = '';
					_.each(params, function(v, i){
						if(i && v) ret += '&' + i + '=' + v;
					}) ;
					if(ret != '') ret = '?' + ret.substring(1);
					if(full) return [ site || fn.site(), ret ].join('');
					return ret;
				},
				getKey: function(val){
					var ret;
					_.each(params, function(v, i){
						if(val == v){ 
							ret = i; 
							return false;
						}
					})
					return ret;
				}
			}
			return fn;
		},
		modal: function (settings) {
			DEV.modals = DEV.modals || {};
			var mid = Math.floor((Math.random() * 1000) + 100);
			var ret = Promise.defer();

			modal_settings = $.extend({
				title: '',
				backdrop: 'static',
				body_template_name: '',
				body_template: '',
				mid: mid,
				keyboard: false
			}, settings);

			modal_settings.backdrop = (modal_settings.backdrop === false || $('.modal-backdrop').length) ? false : 'static';        
			

			var parentBackdrop;
			dust.render("modal_af", modal_settings, function (error, output) {
				if(error) return console.error('Error In Modal: '+error);

				var _timeout = 200;
				var thisModal = DEV.modals[mid] = $(output);
				
				var close = function() { 
					var res = _.isFunction(modal_settings.onClose) ? modal_settings.onClose(thisModal) : true;
					if(res === false) return null;

					window.onbeforeunload = null;
					$(window).unbind('beforeunload');

					if( $.fn.select2 ) {
						$('#select2-drop-mask').remove();
						thisModal.find('select').select2('destroy');
					}

					thisModal.modal('hide');
					setTimeout(function () {
						delete DEV.modals[mid];
						$('body').removeClass('hide-overflow');
						$('.modal-backdrop, .modal-' + mid).remove();  
						if ( parentBackdrop ) parentBackdrop.remove();
					}, _timeout);
					return false;
				}
				var addHandlers = function(){
					thisModal.find(".modal-footer a[data-dismiss], .modal-header .close").unbind('click');
					thisModal.find(".modal-footer a[data-dismiss], .modal-header .close").bind('click', function (e) {
						e.stopImmediatePropagation();
						return close();
					});
					$(document).find('.modal-backdrop').unbind('click');
					$(document).find('.modal-backdrop').bind('click', function(e){
						e.stopImmediatePropagation();
						return close();
					});
				}

				thisModal.modal(modal_settings);
				thisModal.find('.modal-footer .main-btn-action:not(:disabled)').click(function (e) {
					e.preventDefault();
					var $target = $(e.target);

					if($target.hasAttr('disabled') || $target.hasClass('disabled')) return
					var res = $.isFunction(modal_settings.onSubmit) ? modal_settings.onSubmit(thisModal) : true;

					var onReturn = function(res){
						if(res === true) return close()
						else if(res && $.isFunction(res.promise)) {
							res.then(function (response) {
								response = (_.isObject(response)) ? response : JSON.parse(response);
								if(response && !response.is_error && !_.isFunction(response.promise)) 
									return close()   
								else if(response && _.isFunction(response.promise))
									return onReturn(response);                                                
							})
						}                    
					}
					return onReturn(res);
				});

				addHandlers();

				thisModal.modal('show', mid);

				if(window !== window.top && window.top.iframeModalBackdrop){
					parentBackdrop = window.top.iframeModalBackdrop();
				}
				if(_.isFunction(modal_settings.onShow)) modal_settings.onShow(thisModal);
				
				setTimeout(function(){
					$('body').addClass('hide-overflow');
					ret.resolve(thisModal);
				}, _timeout);
			});
			return ret.promise;
		},
		numberToText: function(number){
			
			var numToWord = {
				0: 'zero',
				1: 'one',
				2: 'two',
				3: 'three',
				4: 'four',
				5: 'five',
				6: 'six',
				7: 'seven',
				8: 'eight',
				9: 'nine',
				10: 'ten',
				11: 'eleven',
				12: 'twelve',
				13: 'thirteen',
				14: 'fourteen',
				15: 'fifteen',
				16: 'sixteen',
				17: 'seventeen',
				18: 'eighteen',
				19: 'nineteen',
				20: 'twenty',
				30: 'thirty',
				40: 'forty',
				50: 'fifty',
				60: 'sixty',
				70: 'seventy',
				80: 'eighty',
				90: 'ninety'
			};
			// After trillion, 999...999 stops saying "nearly", so let's stop there.
			thousandWords = ['', 'thousand', 'million', 'billion', 'trillion'];
			
			function subHundredToText(i) {
				if (numToWord[i]) return numToWord[i];
				i2 = i%10;
				i = i - i2;
				return numToWord[i]+"-"+numToWord[i2];
			}
			
			function intToText(i) {   
				var i;     
				var isNegative = false;
				if (isNaN(parseInt(i))) return '';
				else{
				 isNegative = (parseInt(i) < 0) ? true : false;
				 i = Math.abs(parseInt(i));
				}
				if (Math.round(i)!=i) return 'Please enter value to the nearest whole number';

				if(i === 0) return numToWord[0];
				if (i<10000) {
				var lastbit = i%100;
				i = (i-lastbit)/100;
				if (lastbit) lastbit = subHundredToText(lastbit);
				var hund = i%10;
				i = (i - hund)/10;
				if (hund) hund = numToWord[hund]+" hundred";
				var thou = i;
				if (thou) thou = numToWord[thou]+" thousand";
				var ret = "";
				if (thou) ret+=thou;
				if (thou&&hund) ret+=", ";
				if (hund) ret+=hund;
				if (ret&&lastbit) ret+=" and ";
				if (lastbit) ret+=lastbit;
				if(isNegative) ret = 'negative ' + ret;
				return ret;
				}
			
				var scale = 0;
				while (i>=1000) {
				i /= 1000;
				scale++;
				}
			
				var post = 0;
				while (Math.round(i)<100) {
				i*=10;
				post++;
				}
				if (Math.round(i)==1000) {
				if (post) {
					i /= 10;
					post--;
				}
				else {
					i /= 10;
					scale++;
					post = 2;
				}
				}
				if (!thousandWords[scale]) return  isNegative ? "a very big negative number" : "a very big number";
				var s = ""+Math.round(i);
				if (post) {
				var pos = s.length-post;
				s = s.substr(0, pos)+"."+s.substr(pos);
				}
			
				if (Math.round(i)>i)
				s = "nearly "+s;
				else if (Math.round(i)<i)
				s = "approximately "+s;
				s += " "+thousandWords[scale];
			
			if(isNegative) s = 'negative '+ s;
				return s;
			}      
			return intToText(number);
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
			var characters = "";
			if (!lowercase) {
				alpha = alpha.toUpperCase();
				characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
		}
	});
})(window, window.jQuery);