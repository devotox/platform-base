import Ember from 'ember';

import Promise from 'npm:bluebird';

export default Ember.Service.extend({
	toBase64(str){
		try {
			return window.btoa(window.unescape(window.encodeURIComponent( str )));
		} catch (e) {
			return window.btoa( str );
		}
	},
	fromBase64(str) {
		try {
			return window.decodeURIComponent(window.escape(window.atob( str )));
		} catch (e) {
			return window.atob( str );
		}
	},
	encodeUTF8(s){
		return window.unescape( window.encodeURIComponent( s ) );
	},
	decodeUTF8:  function(s){
		return window.decodeURIComponent( window.escape( s ) );
	},
	uuid(len) {
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r, v;
			r = Math.random() * 16 | 0;
			v = c === 'x' ? r : r & 0x3 | 0x8;
			return v.toString(16);
		});
		if (!len){ return uuid; }
		return uuid.replace(/\-/g, '').substring(0, len);
	},
	fromBlob(blob) {
		return new Promise(function(resolve) {
			let reader = new window.FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				resolve(reader.result);
			};
		});
	},
	toBlob(dataURI) {
		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		let byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to an ArrayBuffer
		let ab = new ArrayBuffer(byteString.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		let bb = new Blob([ab], { type: mimeString });
		return bb;
	},
	isDataURI(dataURI) {
		let regex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
		return !!dataURI.match(regex);
	}
});
