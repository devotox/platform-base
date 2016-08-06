import Ember from 'ember';

import AfterRender from '../mixins/after-render';

export default Ember.Component.extend(AfterRender, {

	message: '',

	messages: [],

	primus() {
		return this.get('_primus') || ( () => {
			this.set('_primus', new window.Primus());
			return this.get('_primus');
		})();
	},

	username: 'user',

	addMessage: function(message, user) {
		let message_class = user === this.get('username') ? 'right-align': 'left-align';
		message_class = user === 'broadcast' ? 'center-align broadcast' : message_class;

		let messages = this.get('messages');
		if(!messages) { return; }

		messages.addObject({
			'user': user,
			'text': message,
			'class': message_class
		});
	},

	scrollMessages: function(){
		Ember.run.scheduleOnce('afterRender', this, function() {
			let $chat_container = Ember.$('#chat-module-messages-list');
			$chat_container.parent().scrollTop( $chat_container.get(0).scrollHeight );
		});
	}.observes('messages.length'),

	setup: function() {
		let primus = this.primus();

		primus.on('chat-broadcast', (message, user) => {
			this.addMessage(message, user);
		}).on('broadcast', (message) => {
			this.addMessage(message, 'broadcast');
		}).on('number-users', (number_users) => {
			this.number_users = number_users;
		}).on('user-typing', (user) => {
			this.typing = user;
		});

	}.on('init'),

	actions: {
		'send-message': function() {
			let primus = this.primus();
			let user = this.get('username');
			let message = this.get('message');

			this.set('message', '');
			Ember.$('#chat-module-message-input').focus();

			primus.emit('chat-message', message, user);
		}
	}
});
