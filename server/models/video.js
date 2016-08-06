'use strict';

let fs = require('fs');
let _ = require('lodash');
let path = require('path');
let utils = require('../helpers/utils');

let directories = [];
let dist_path = 'dist/';
let thumbnail_extension = '.jpg';
let video_path = 'assets/videos/';
let thumbnail_path = 'assets/thumbnails/';
let symlinked_video_directory = '/media/videos';
let allowed_extensions = [ '.mp4', '.m4v', '.webm', '.ogv' ];
let video_directory = global.website_path + dist_path + video_path;
let thumbnail_directory = global.website_path + dist_path + thumbnail_path;

let setDirectories = () => {
	fs.access(video_directory, (err) => {
		if(err) { return; }
		directories = fs.readdirSync(video_directory);
	});
};

let createThumbnails = () => {
	directories.map(file => {
		return path.join(video_directory, file);
	}).filter(file => {
		return fs.statSync(file).isFile() && _.includes(allowed_extensions, path.extname(file));
	}).forEach(file => {
		let size = '200x200';
		let time = '00:00:30';
		let filename = path.basename(file);
		let thumb_file = thumbnail_directory + filename + thumbnail_extension;
		utils.run_shell_command('ffmpeg', ['-i', file, '-ss', time, '-vframes', 1, '-y', '-s', size, '-f', 'image2', thumb_file ]);
	});
};

let createDirectories = () => {
	utils.run_shell_command('mkdir', ['-p', video_directory]);
	utils.run_shell_command('mkdir', ['-p', thumbnail_directory]);

	fs.access(symlinked_video_directory, (err) => {
		if(err || !fs.statSync(symlinked_video_directory).isDirectory()) { return; }

		utils.run_shell_command('rm', [video_directory.replace(/\/$/, '')]);
		utils.run_shell_command('rm', ['-rf', video_directory]);
		utils.run_shell_command('ln', ['-s', symlinked_video_directory, video_directory.replace(/\/$/, '')]);
	});
};

let getContext = (context) => {

	setDirectories();

	process.nextTick(() => { createThumbnails(); });

	context.result = [];

	directories.map(file => {
		return path.join(video_directory, file);
	}).filter(file => {
		return fs.statSync(file).isFile() && _.includes(allowed_extensions, path.extname(file));
	}).forEach((file, id) => {
		let filename = path.basename(file);
		let extension = path.extname(file);

		context.result.push({
			id: id + 1,
			name: filename,
			extension: extension,
			source:  video_path + filename,
			slug: filename.replace(/\s/g, '-'),
			thumbnail: thumbnail_path + filename + thumbnail_extension
		});
	});

	return context;
};

let init = () => {

	createDirectories();

	setTimeout(function(){
		setDirectories();
		createThumbnails();
	}, 1000);
};

module.exports = (Model) => {

	init();

	Model.afterRemote('find', (context, model, next) => {
		if (!context.req.query.local) { return next(); }
		context = getContext(context);
		next();
	});

	Model.afterRemote('findById', (context, model, next) => {
		if (!context.req.query.local) { return next(); }
		context = getContext(context, true);
		context.result = _.find(context.result, { id: context.args.id });
		next();
	});
};
