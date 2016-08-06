'use strict';

module.exports = (server) => {
	let models = [];
	let modelNames = Object.keys(server.models);

	modelNames.forEach(model => {
		let modelName = server.models[model].modelName;
		if (models.indexOf(modelName) === -1) {
			models.push(modelName);
		}
	});

	console.log('Models:', models);
};
