'use strict';

let config  = require('../config.json');
let host_options = config.host_options;

module.exports = (Model) => {
	let noreply = 'noreply@platform.com';
	let test_email = 'devo.tox.89@gmail.com';

	Model.afterRemote('create', (context, user, next) => {

		let options = Object.assign({}, host_options, {
			user: user,
			type: 'email',
			from: noreply,
			redirect: '/login',
			//template: 'templates/verify.hbs',
			to: test_email || user.email,
			subject: 'Registration Verification',
		});

		user.verify(options, next);
	});

	//send password reset link when requested
	Model.on('resetPasswordRequest', info => {

		let url = `${config.websiteUrl}/reset-password?access_token=${info.accessToken.id}`;
		let html = `<h3>Password Reset</h3>
					<div>Click <a href="${url}">here</a> to reset your password</div>`;

		Model.app.models.Email.send({
			html: html,
			from: noreply,
			to: test_email || info.email,
			subject: 'Password reset'
		});
	});
};
