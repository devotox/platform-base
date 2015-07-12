
// Sets window.IE if undefined
if(typeof window.IE == "undefined"){

	(function(window, undefined){
		// Returns the version of Internet Explorer or a -1
		// (indicating the use of another browser).
		window.getIEVersion = function(){
			var re = null, ua = navigator.userAgent;

			if (navigator.appName == 'Microsoft Internet Explorer'){
				re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			} else if (navigator.appName == 'Netscape') {
				re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			}
			
			return re.exec(ua) != null ? parseFloat( RegExp.$1 ) : -1;
		}

		window.IE = ( ( window.IEVersion = window.getIEVersion() ) != -1) ? true : false;
	})(window);
}

//Fixes the onchange event for radios and checkboxes for IE
if (window.IE  && window.IEVersion < 9) {  
	
	window.hasOwnProperty = window.hasOwnProperty ||  Object.prototype.hasOwnProperty;
	Date.now || (Date.now = function(){ return +new Date() });

	$(function() {  
		$(document).on('click', 'input:radio, input:checkbox', function() {  
			this.blur();  
			this.focus();  
		});  
	});  
} 