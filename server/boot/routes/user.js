'use strict';

module.exports = (server, router, restApiRoot) => {
	let User = server.models.user;

	router.post(`${restApiRoot}/users/change-password`, function(req, res) {
		let data = (req.body.data && req.body.data.attributes) || req.body;

		if (!req.accessToken || !data.password){
			return res.status(401).json({ message: 'Error Resetting Password' });
		}

		User.findById(req.accessToken.userId, function(err, user) {
			if (err){ return res.status(404).json({ message: 'Error Resetting Password' }); }

			let attributes = { password: data.password, emailVerified: true };
			user.updateAttributes(attributes, function(err) {
				if (err) { return res.status(404).json({ message: 'Error Resetting Password' }); }
				res.status(200).json({ message: 'Password Reset Successful'});
			});
		});
	});
};
