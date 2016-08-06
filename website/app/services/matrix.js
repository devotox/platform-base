import Ember from 'ember';

export default Ember.Service.extend({

	init() {
		this._super(...arguments);
		this.setup();
	},

	setup() {
		Ember.$(document).on('keypress', (event) => {
			if(event.which !== 13) { // m
				return;
			} else if(event.ctrlKey && event.altKey) {
				this.matrix();
			} else if(event.ctrlKey && event.shiftKey) {
				this.clear();
			}
		});
	},

	clear() {
		let $matrix = Ember.$('#matrix');
		let matrix_interval = $matrix.data('matrix_interval');
		clearInterval(matrix_interval);
		$matrix.remove();
	},

	timeout() {
		let timeout = 15000; // 15 secs
		Ember.run.later(this.clear.bind(this), timeout);
	},

	matrix() {
		this.clear();
		this.timeout();

		let $canvas = Ember.$('<canvas/>', { id: 'matrix' }).css({
			position: 'absolute', zIndex: 9999, left: 0, top: 0
		}).appendTo('body');

		let screen = window.screen;
		let canvas_element = $canvas.get(0);
		let width = canvas_element.width = screen.width;
		let height = canvas_element.height = screen.height;
		let letters = Array(256).join(1).split('');

		let draw = function() {
			canvas_element.getContext('2d').fillStyle = 'rgba(0,0,0,.05)';
			canvas_element.getContext('2d').fillRect(0, 0, width, height);
			canvas_element.getContext('2d').fillStyle = '#0F0';
			letters.map(function(y_pos, index) {
				let text = String.fromCharCode(3e4 + Math.random() * 33);
				let x_pos = index * 10;
				canvas_element.getContext('2d').fillText(text, x_pos, y_pos);
				letters[index] = (y_pos > 758 + Math.random() * 1e4) ? 0 : y_pos + 10;
			});
		};

		let matrix_interval = setInterval(draw, 33);
		$canvas.data('matrix_interval', matrix_interval);
		return [ $canvas, matrix_interval ];
	}
});
