//Touch Methods 
(function ($, window, undefined) {
	$.fn.extend({
		touchstart:function(fn){
			$(this).bind('touchstart', fn)
		},
		touchend:function(fn){
			$(this).bind('touchend', fn)            
		},
		touchmove:function(fn){
			$(this).bind('touchmove', fn)             
		},
		touchdrag:function(fn){
			$(this).bind('touchdrag', fn)             
		}
	});
})(window.jQuery, window);

//JQuery Extensions
(function ($, window, undefined) {
	var toNumber = function(num){
		var numArr = num.split(".");
		var beforeDecimal = numArr.shift();
		var afterDecimal = numArr.join('');

		beforeDecimal = beforeDecimal.replace(/\D/g,'');
		afterDecimal = afterDecimal.replace(/\D/g,'');
		if(afterDecimal != '') afterDecimal = '.'+afterDecimal;

		var newNum = beforeDecimal + afterDecimal;
		return (newNum != '') ? newNum : 0;
	}
	$.fn.extend({
		whileHidden: function (func) {
			this.hide();
			func.apply(this);
			this.show();
		},
		asNumber: function(){
			var method = $(this).is('input, select, textarea') ? 'val' : 'html';
			var num = $(this)[method]().toString();
			var newNum = toNumber(num);
			return newNum;
		},
		toNumber: function(){
			var method = $(this).is('input, select, textarea') ? 'val' : 'html';
			var num = $(this)[method]().toString();
			var newNum = toNumber(num);   
			return $(this)[method](newNum);
		},
		outerHtml: function() {
			return $(this).clone().wrap('<div></div>').parent().html();
		},
		center: function (options) {
			var options = $.extend({ // Default values
				inside: window, // element, center into window
				transition: 0, // millisecond, transition time
				minX: 0, // pixel, minimum left element value
				minY: 0, // pixel, minimum top element value
				withScrolling: true, // boolean, take care of the scrollbar (scrollTop)
				vertical: true, // boolean, center vertical
				horizontal: true // boolean, center horizontal
			}, options);
			return this.each(function () {
				var props = {
					position: 'absolute'
				};
				if(options.vertical) {
					var top = ($(options.inside).height() - $(this).outerHeight()) / 2;
					if(options.withScrolling) top += $(options.inside).scrollTop() || 0;
					top = (top > options.minY ? top : options.minY);
					$.extend(props, {
						top: top + 'px'
					});
				}
				if(options.horizontal) {
					var left = ($(options.inside).width() - $(this).outerWidth()) / 2;
					if(options.withScrolling) left += $(options.inside).scrollLeft() || 0;
					left = (left > options.minX ? left : options.minX);
					$.extend(props, {
						left: left + 'px'
					});
				}
				if(options.transition > 0) $(this).animate(props, options.transition);
				else $(this).css(props);
				return $(this);
			});
		},
		htmlEncode: function(value){
			return $(this).text($('<div/>').text(value).html());
		},
		htmlDecode: function(value){
			return $(this).html($('<div/>').html(value).text());
		},
		hasAttr: function(name) {  
		   return this.attr(name) !== undefined;
		},
		getAttributes: function() {
			var attributes = {}; 
			if(!this.length)
				return this;

			$.each(this[0].attributes, function(index, attr) {
				attributes[attr.name] = attr.value;
			}); 

			return attributes;
		},
		removeAttributes: function () {
			return this.each(function () {
				var attributes = $.map(this.attributes, function (item) {
					return item.name;
				});
				var img = $(this);
				$.each(attributes, function (i, item) {
					img.removeAttr(item);
				});
			});
		},
		justText: function() {   
			return $(this).clone().children().remove().end().text();         
		},
		highlight: function(){
			return $(this).fadeOut(function(){
				$(this).fadeIn();
			});
		},
		setActive: function (cls) {
			if (!cls || cls == '') cls = 'active';
			$(this).siblings().removeClass(cls);
			$(this).addClass(cls);
			return this;
		},
		setChildrenInactive: function (cls) {
			if (!cls || cls == '') cls = 'active';
			$(this).find('.' + cls).removeClass(cls);
		},
		simulateKeyPress: function (type, character) {
			type = type || 'keydown'; character = character || 'enter';
			$(this).trigger({ type: type, which: character.charCodeAt(0) });
		},
		simulateEnterKey: function (type) {
			type = type || 'keydown';
			$(this).trigger({ type: type, which: 13 });
		},
		forceRedraw: function () {
			$(this).css('width', 0);
			$(this).css('width', '');
		},
		trimArray: function(){
			var arr = this;
			$.each(arr, function(i,v){
				arr[i] = jQuery.trim(v);
			});
			return arr;
		},
		outline: function(remove){
			if(remove) return $(this).css({border: 'none', 'border-radius': 'none'});			
			$(this).css({border: 'solid 1px #ccc', 'border-radius': '0.4em'});
		},
		hasDuplicates: function (name) {
			var ret = false, previous, arr = $(this).toArray().sort(),
				isName = name && name != "" && $.type(name) == 'string';

			if(!$.isArray(arr) || arr.length <= 1)
				return ret;
			else if(isName){
				$.each(arr, function(i,v){
					if(v == previous && v == name){ return !(ret = [v]); }
					if(v == name){previous = v; }
				});
			}
			else{   
				$.each(arr, function(i,v){
					if(v == previous){ return !(ret = [v]); }
					previous = v;
				});
			}
			return ret; 
		},
		getPropArray: function (propertyName) {
			return $(this.map(function() { return this[propertyName]; }));
		},
		fixBase64: function(){
			var BASE64_DATA = /^data:.*;base64/i;
			var base64Path = "php/base64_decode.php";
			
			this.runtimeStyle.behavior = "none";
			if (BASE64_DATA.test(this.src)){
				this.src = base64Path + "?" + this.src.slice(5);
			};
			return this;
		}
	});
})(window.jQuery, window);

(function($, window){
    $.extend( $.fn.dataTableExt.oSort, {
        "date-human-pre": function ( a ) {
            var x;
     
            if ( $.trim(a) !== '' ) {
                x = Date.parseExact(a, 'dd/MM/yyyy HH:mm tt');
            }
            else {
                x = new Date(0);
            }
            return x;
        },
     
        "date-human-asc": function ( a, b ) {
           return a.compareTo(b) > 0;
        },
     
        "date-human-desc": function ( a, b ) {
           return a.compareTo(b) < 0;
        }
    });
})(window.jQuery, window);
