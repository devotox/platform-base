window.DEV = window.DEV || {};
window.DEV.Utils = (function(Utils, $, window, undefined) {
  var instance;

  Utils = function() {
    if(!instance) {
      instance = this;
    }
    return instance;
  };

  var deleteCookie = function(key){
    date = new Date();
    date.setDate(date.getDate() -1);
    document.cookie = escape(key) + '=;expires=' + date;
  }

  Utils.prototype.getItem = window.getItem = function(key, pass){
    var value;
    if(window.sessionStorage && window.sessionStorage.getItem) {
        value = window.sessionStorage.getItem(key);
    } else {
        try {
            var cookie = JSON.parse(document.cookie);
            value = cookie[key];
        } catch(e) {
            return false;
        }
    }
    if(pass && window.sjcl && value)
        value = sjcl.decrypt(pass, value);
    try {
        return JSON.parse(value);
    } catch(e) {
        return value;
    }
  };
  Utils.prototype.setItem = window.setItem = function(key, value, pass){
    value = (typeof value == 'string') ? value : JSON.stringify(value);
    if(pass && window.sjcl)
        value = sjcl.encrypt(pass, value);
    try {
      if(window.sessionStorage && window.sessionStorage.setItem) {
          window.sessionStorage.setItem(key, value);
      } else {
        try {
            var cookie = JSON.parse(document.cookie);
        } catch(e) {
            var cookie = {};
        }
        cookie[key] = value;
        document.cookie = JSON.stringify(cookie);
      }
    } catch (err){ console.warn(err); }
  };
  Utils.prototype.extendItem = window.extendItem = function(key, pass){
    var item = this.getItem(key, pass) || {};
    return this.setItem(key, $.extend(true, item, value), pass);

  };
  Utils.prototype.removeItem = window.removeItem = function(key, pass){
    if (window.sessionStorage && window.sessionStorage.removeItem) {
        return window.sessionStorage.removeItem(key);
    } else {
        deleteCookie(key);
    }
  };
  Utils.prototype.sortObjects = function(arrayOfObjects, sortBy, reverse) {
    var sortingFunction = null;
    var ordering = function (A, B) { return (A > B ? 1 : (A == B ? 0 : -1)); };
    if(typeof sortBy === 'string') {
      sortingFunction = function(a, b) {
        var A = a[sortBy];
        var B = b[sortBy];
        return ordering(A, B);
      };
    } else if($.isFunction(sortBy)) {
      sortingFunction = function(a, b) {
        var A = sortBy.apply(a);
        var B = sortBy.apply(b);
        return ordering(A, B);
      };
    }
    return arrayOfObjects.sort(function() {
        return sortingFunction.apply(this, arguments) * (reverse ? -1 : 1);
    });
  };
  Utils.prototype.arrayMove = function(arr, old_index, new_index){
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length;
      while ((k--) + 1) {
        this.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; 
  };
  Utils.prototype.moveToArray = function(idx, old_arr, new_arr) {
    var obj = old_arr.splice(idx, 1)[0];
    new_arr.push(obj);
    return new_arr;
  };
  Utils.prototype.uuid = function(len) {

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
    if(!len) return uuid;    
    return uuid.replace(/\-/g, '').substring(0, len)
  };
  Utils.prototype.guid = function(len) {
    return this.uuid(len).replace(/\-/g, "")
  };
  Utils.prototype.spinner = function(selector, override, options) {
    var defaults = {
      lines: 11, // The number of lines to draw
      length: 0, // The length of each line
      width: 6, // The line thickness
      radius: 13, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 1.4, // Rounds per second
      trail: 100, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 1049, // The z-index (defaults to 2000000000): set to (@zindexModal - 1)
      top: 'auto', // Top position relative to parent in px
      left: 'auto', // Left position relative to parent in px
      inline: false
    };
    var opts = $.extend({}, defaults, options);
    var spinner = new Spinner(opts).spin();
    var tag = opts.inline ? '<span />' : '<div />';
    var container = $(tag, {html: spinner.el, 'class': 'row-fluid ' + opts.className + '-outer'}).css({
      position: 'absolute',
      top: opts.top,
      left: opts.left
    })

    if(selector) {
      var $target = $(selector);
      if($target.length) {
          if(override) $target.html(container);
          else $target.append(container);
      }
    }
    return container;
  }; 
  Utils.prototype.Device =  {
    is: function(type){
      return (type && navigator && navigator.userAgent) ? navigator.userAgent.match( new RegExp(type, 'i') ) : false;
    }, 
    isTouch: function(){
      return this.isIpad() || this.isIphone() || this.isAndroid();
    },
    isNotTouch: function(){
      return !this.isTouch();
    },
    isIOS : function(){
      return this.isIpad() || this.isIphone();
    },
    isIpad: function(){
      return this.is('iPad');
    },
    isIphone: function(){
      return this.is('iPhone');
    },
    isAndroid: function(){
      return this.is('android');
    },
    isIE: function() {
      return this.is('MSIE');
    },
    isWebkit: function() {
      return this.is('Safari');
    },
    isChrome: function() {
      return this.isWebkit() && this.is('Chrome');
    },
    isSafari: function() {
      return this.isWebkit() && !this.isChrome();
    },
    isFirefox: function() {
      return this.is('Firefox');
    },
    isOpera: function() {
      return this.is('Opera');
    },
    click: function(){
      return this.isIOS() ? "touchstart" : "click";
    },   
    mouseup: function(){
      return this.isTouch() ? "touchend" : "mouseup";
    },
    mousedown: function(){
      return this.isTouch() ? "touchstart" : "mousedown";
    },
    mousemove: function(){
      return this.isTouch() ? "touchmove" : "mousemove";
    },
    mouseenter: function(){
      return this.isTouch() ? "touchstart" : "mouseenter";
    },
    mouseleave: function(){
      return this.isTouch() ? "touchleave" : "mouseleave";
    },
    keydown: function(){
      return 'keydown';
    },
    keyup: function(){
      return 'keyup';
    },
    keypress:function(){
      return 'keypress';
    },
    change:function(){
      return 'change';
    }
  };
  Utils.prototype.regex = {
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
  return new Utils();
})(window.DEV.Utils || {}, jQuery, window);
