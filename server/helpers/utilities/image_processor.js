#!/usr/bin/node

'use strict';

let gm                      = require('gm');
let _                       = require('lodash');
var AWS                     = require('aws-sdk');
let Promise                 = require('bluebird');

AWS.config.update({
	sslEnabled:			true,
	region:				process.env.AWS_REGION,
	accessKeyId: 		process.env.AWS_ACCESS_KEY,
	secretAccessKey: 	process.env.AWS_SECRET_ACCESS_KEY
});

let s3_bucket               = process.env.AWS_BUCKET;
let s3_endpoint				= 's3.' + process.env.AWS_REGION + '.amazonaws.com';
let s3_public_endpoint		= 'https://' + process.env.AWS_BUCKET + '.s3.amazonaws.com/';
let s3						= new AWS.S3({ signatureVersion: 'v4', endpoint: s3_endpoint});

// Make sure each uri is not duplicated
let create_non_duplicated_base_uri = (base_uri, images, suffix) => {
	images = images || [];
	suffix = parseInt(suffix) || 0;
	let temp_uri = [ base_uri, suffix ].join('.');

	if(!_.size(images)) { return temp_uri; }
	let has_duplicate = _.includes(images, s3_public_endpoint + temp_uri);
	if( has_duplicate ) { return create_non_duplicated_base_uri(base_uri, images, ++suffix); }
	return temp_uri;
};

// Upload to amazon s3
let upload_image = ({ profile_data, upload_uri, s3_params }) => {
	return new Promise( (resolve, reject) => {
		s3.putObject(s3_params, (error) => {
			if(error) {
				console.error(`(${profile_data.profile_uri}: ${profile_data.account_id}) - uploading to ${upload_uri} error.\n`);
				return reject(new Error(error));
			}

			console.log(`(${profile_data.profile_uri}: ${profile_data.account_id}) - upload to ${upload_uri} complete.`);
			resolve(s3_params);
		});
	});
};

// Resize Image using gm
let resize_image = (profile_data, bucket_data, upload_uri, image, size, progressive) => {
	return new Promise( (resolve, reject) => {
		gm(image, upload_uri)
		.interlace(progressive ? 'Line' : 'None')
		.resize(size, size, '^')
		.gravity('Center')
		.crop(size, size)
		.toBuffer('jpg', (error, buffer) => {

			if(error) {
				console.error(`(${profile_data.profile_uri}: ${profile_data.account_id}) - upload to ${upload_uri} resize error.\n`, error);
				return reject(new Error(error));
			}

			let s3_params = {
				Body: buffer,
				Key: upload_uri,
				Bucket: s3_bucket,
				ACL: "public-read",
				ContentType: "image/jpeg",
				CacheControl: "max-age=0, private"
			};

			resolve({ profile_data, upload_uri, s3_params });
		});
	});
};

exports.process = (profile_data, bucket_data) => {

	let s3_params = { Bucket: s3_bucket, Key: bucket_data.temp_key };

	return new Promise( (resolve, reject) => {
		s3.getObject(s3_params, (error, image) => {
			if (error) {
				console.error(`(${profile_data.profile_uri}) - unable to retrieve temporary uploaded file.`, error);
				return reject(new Error(error));
			}

			let base_uri = `${bucket_data.bucket}${profile_data.profile_uri}/${profile_data.profile_uri}`;
			base_uri = create_non_duplicated_base_uri(base_uri, profile_data.images);

			return Promise.all([
				resize_image(profile_data, bucket_data, `${base_uri}_sm.jpg`, image.Body, bucket_data.small_image_size || 50, true).then(upload_image),
				resize_image(profile_data, bucket_data, `${base_uri}_lg.jpg`, image.Body, bucket_data.large_image_size || 200, true).then(upload_image)
			]).then( () => {
				let images = _.flatten([ profile_data && profile_data.images ? profile_data.images : [] ]);

				images.push(s3_public_endpoint + base_uri);

				if(bucket_data.max_files && parseInt(bucket_data.max_files)){
					images = images.slice(-parseInt(bucket_data.max_files));
				}

				resolve(images);
			}).catch(reject);
		});
	});
};
