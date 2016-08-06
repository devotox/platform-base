import Ember from 'ember';

export default Ember.Service.extend({
	data: [],
	counter: 0,
	append() {
		let args = Array.prototype.slice.call(arguments);
		this.data[this.counter++] = args.join(' ').trim();
		return this;
	},
	remove(i, j) {
		this.data.splice(i, j || 1);
		return this;
	},
	insert(i, s) {
		this.data.splice(i, 0, s);
		return this;
	},
	toString(s) {
		return this.data.join(s || "");
	},
	ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.substr(1);
	},
	titleize(title){
		if(!title){ return ''; }

		var punct_small_func = function(all, punct, word) { return punct + upper(word); };
		var all_func = function(all) { return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all); };

		var small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
		var punct = "([!\"\'#$%&()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

		function lower(word) {
			return word.toLowerCase();
		}

		function upper(word) {
			return word.substr(0, 1).toUpperCase() + word.substr(1);
		}

		var parts = [], index = 0,
			split = /[:.;?!] |(?: |^)["Ò]/g;

		while (true) {
			var m = split.exec(title);

			parts.push(title.substring(index, m ? m.index : title.length)
				.replace(/\b([A-Za-z][a-z.Õ]*)\b/g, all_func)
				.replace(new RegExp("\\b" + small + "\\b", "ig"), lower)
				.replace(new RegExp("^" + punct + small + "\\b", "ig"), punct_small_func)
				.replace(new RegExp("\\b" + small + punct + "$", "ig"), upper));

			index = split.lastIndex;

			if (m){ parts.push(m[0]); }
			else{ break; }
		}

		return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
			.replace(/(['Õ])S\b/ig, "$1s")
			.replace(/\b(AT&T|Q&A)\b/ig, function(all) {
				return all.toUpperCase();
			});
	}
});
