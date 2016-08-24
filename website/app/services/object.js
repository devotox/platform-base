import Ember from 'ember';

export default Ember.Service.extend({

	utils: Ember.inject.service(),

	sortObjects(arrayOfObjects, sortBy, reverse) {
		let sortingFunction = null,
			ordering = (A, B) => { return ( A > B ? 1 : (A === B ? 0 : -1) ); },
			lower = (A, B) => { return [ this.get('utils').isFunction(A.toLowerCase) ? A.toLowerCase() : A, this.get('utils').isFunction(B.toLowerCase) ? B.toLowerCase() : B ]; };

		if(typeof sortBy === 'string') {
			sortingFunction = function(a, b) {
				let A = a[sortBy];
				let B = b[sortBy];
				let AB = lower(A, B);
				return ordering(AB[0], AB[1]);
			};
		} else if(this.get('utils').isFunction(sortBy)) {
			sortingFunction = function(a, b) {
				let A = sortBy.apply(a);
				let B = sortBy.apply(b);
				let AB = lower(A, B);
				return ordering(AB[0], AB[1]);
			};
		}
		return arrayOfObjects.sort(function() {
			return sortingFunction.apply(this, arguments) * (reverse ? -1 : 1);
		});
	},
	toArray(object) {
		return Object.keys(object).map( key => object[key]);
	},
	arrayToTree(rows) {
		let tree = [];

		let nodeMap = rows.reduce(function(map, node) {
			map[node.id || node.name] = node;
			return map;
		}, {});

		rows.forEach(function(node) {
			let parent = nodeMap[node.parent_id || node.parent_name];
			if (parent) {
				( parent.children || ( parent.children = [] ) ).push(node);
			} else {
				tree.push(node);
			}
		});

		return tree;
	},
	in(input, array){
		let i = -1, l = array.length >>> 0;
		while (++i < l){ if (input === array[i]){ return true; } }
		return false;
	},
	permute(input) {
		let used = [], permArr = [];

		function _permute(input) {
			let i, ch;
			for (i = 0; i < input.length; i++) {
				ch = input.splice(i, 1)[0];
				used.push(ch);

				if (input.length === 0) {
					permArr.push(used.slice());
				}
				_permute(input);
				input.splice(i, 0, ch);
				used.pop();
			}
			return permArr;
		}

		return _permute(input);
	},
	shuffle(array) {
		let m = array.length, t, i;

		while (m) {
			i = Math.floor(Math.random() * m--);
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	},
	unique(array, key, filterFunction) {
		var seen = {};
		return array.filter(filterFunction || function(item) {
			let this_item = key ? ( item.get && item.get(key) || item[key]) : item;
			this_item = (this_item && this_item.toLowerCase) ? this_item.toLowerCase() : this_item;
			return (!this_item || seen.hasOwnProperty(this_item)) ? false : (seen[this_item] = true);
		});
	},
	filter(array, array_to_remove) {
		return [].concat(array).filter( (value) => {
			return array_to_remove.indexOf(value) < 0;
		});
	}
});
