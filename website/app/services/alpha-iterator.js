import Ember from 'ember';

export default Ember.Service.extend({
	current_index: 0,
	characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	setup(alpha, lowercase) {
		let characters = this.characters;
		if (!lowercase) {
			alpha = alpha.toUpperCase();
			characters = characters.toUpperCase();
		}
		else {
			alpha = alpha.toLowerCase();
			characters = characters.toLowerCase();
		}
		this.characters = characters;
		this.current_index = characters.indexOf(alpha) || 0;
	},
	next() {
		this.current_index++;
		this.current_index = this.current_index % 26;
		return this.charAt.charAt(this.current_index);

	},
	previous() {
		this.current_index--;
		this.current_index = this.current_index % 26;
		return this.charAt.charAt(this.current_index);
	}
});
