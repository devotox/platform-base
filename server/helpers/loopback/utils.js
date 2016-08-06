'use strict';

let model_validator = require('model-base').ModelValidator;

let hasContextID = (ctx, id_key) => {
	return ctx && ctx.query &&
			ctx.query.where &&
			ctx.query.where[id_key];
};

exports.slug = (Model, { id_key = 'id', slug_key = 'slug' } = {}) => {

	let model_name = Model.definition.name;

	Model.observe('access', (ctx, next) => {
		if(!hasContextID(ctx, id_key)) { return next(); }

		let slug = model_validator.slug(ctx.query.where[id_key]) &&
					ctx.query.where[id_key];

		if(slug) {
			delete ctx.query.where[id_key];
			ctx.query.where[slug_key] = slug;
		}

		next();
	});

	Model.slug = (slug, cb) => {
		Model.findOne({ where: { [slug_key]: slug || '' }}, (err, instance) => {
			if(err) { return cb(err); }
			else{ cb(null, instance); }
		});
	};

	Model.remoteMethod('slug', {
		returns: { type: model_name, root: true },
		http: { path: '/slug/:slug', verb: 'get' },
		accepts: { arg: 'slug', type: 'string', http: { source: 'path' } }
	});
};

//
// var DataSource = require('loopback-datasource-juggler').DataSource;
//
// var dataSource = new DataSource({
// 	connector: require('loopback-connector-postgresql'),
// 	"port": 5432,
// 	"host": "database",
// 	"name": "platform",
// 	"database": "platform",
// 	"password": "platform",
// 	"username": "platform_admin"
// });
//
// dataSource.connector.execute("SELECT * FROM \"topic-item\" WHERE level=1 AND category='' AND ( tags like '%basics-1%' OR tags like '%basics2%' )", null, function(error, data) {
// 	console.log(data);
// });
