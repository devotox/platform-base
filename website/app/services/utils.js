import Ember from 'ember';

export default Ember.Service.extend({
	exists(value) {
		return ( value || value === false || value === 0 || value === '') &&
		!( value === null || typeof value === 'undefined' );
	},
	isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	isFunction(value) {
		return typeof value === 'function';
	},
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	switch(input, cases = {}) {

		cases = Object.assign({
			default() {
				console.trace('default run for unhandled case:', input);
			}
		}, cases);

		return this.exists(cases[input]) ? (
			this.isFunction(cases[input]) ? cases[input]() : cases[input]
		) : (
			this.isFunction(cases.default) ? cases.default() : cases.default
		);
	}
});
