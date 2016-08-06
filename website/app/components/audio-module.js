import Ember from 'ember';

import Promise from 'npm:bluebird';

export default Ember.Component.extend({

	item: null,

	type: null,

	playing: false,

	autoplay: false,

	recording: false,

	recording_time: 3000,

	crypto: Ember.inject.service(),

	didReceiveAttrs() {
		this._super(...arguments);
		let item = this.get('item');
		let autoplay = this.get('autoplay');

		if(item && autoplay) {
			this.playAudio(item);
		}
	},

	willDestroyElement() {
		this._super(...arguments);
		let item = this.get('item');

		this.setInactive(item, 'playing');
		this.setInactive(item, 'recording');
	},

	setup() {
		let item = this.get('item');
		if(this.get('type') !== 'record'){
			return Promise.reject(new Error('Not Recording Type'));
		} else if(!item || !Ember.get(item, 'permissions.record')) {
			return Promise.reject(new Error('No Recording Permissions.'));
		}
		return this.initializeRecorder();
	},

	initializeRecorder() {
		if(this.get('recorder')) {
			return Promise.resolve(this.get('recorder'));
		}
		return new Promise( (resolve, reject) => {
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			window.URL = window.URL || window.webkitURL;

			return navigator.getUserMedia ? navigator.getUserMedia(
				{ audio: true },
				(stream) => { resolve(this.createNewRecorder(stream)); },
				function(e) { console.error('No live audio input: ' + e); }
			) : reject(new Error('No Get User Media API available.'));
		});
	},

	createNewRecorder(stream) {
		window.GlobalAudioContext = window.GlobalAudioContext || new window.AudioContext();
		let input = window.GlobalAudioContext.createMediaStreamSource(stream);
		let new_recorder = new window.Recorder(input);
		this.set('recorder', new_recorder);
		return new_recorder;
	},

	recordAudio(item) {
		this.setup().then( () => {
			this.setupRecording(item);
		}).catch(function(error){
			console.error('No web audio support detected!', error);
		});
	},

	setupRecording(item) {
		this.reset(item);
		let recorder = this.get('recorder');
		if(!recorder) { return; }

		this.startRecording(recorder, item);

		let audio_timeout = Ember.run.later( () => {
			this.stopRecording(recorder, item);
			this.playBackAudio(recorder, item);
		}, this.get('recording_time'));

		this.set('audio_timeout', audio_timeout);
	},

	startRecording(recorder, item) {
		this.setActive(item, 'recording');
		recorder.record();
	},

	stopRecording(recorder, item) {
		this.setInactive(item, 'recording');
		recorder.stop();
	},

	playBackAudio(recorder, item) {
		recorder.exportWAV( blob => {
			let audio_url = window.URL.createObjectURL(blob);
			let crypto = this.get('crypto');

			//this.sendAction('audio-recorded', item, { blob: blob });
			crypto.fromBlob(blob).then( base64_string => {
				let meta = { blob: blob, base64: base64_string };
				this.sendAction('audio-recorded', item, meta);
			});

			Ember.set(item, 'media.audio', audio_url);
			this.playAudio(item);
			recorder.clear();
		});
	},

	playAudio(item) {
		this.reset(item);
		this.setActive(item, 'playing');
		let $audio = Ember.$('<audio/>', { id: 'category-module-audio', autoplay: true });
		let $source = Ember.$('<source/>', { id: 'category-module-source', type: 'audio/wav' });

		let crypto = this.get('crypto');
		let audio = Ember.get(item, 'media.audio');

		if(crypto.isDataURI(audio)) {
			audio = window.URL.createObjectURL(crypto.toBlob(audio));
			Ember.set(item, 'media.audio', audio);
		}

		$audio.append($source.attr('src', audio)).appendTo('body');
		$audio.bind('ended', () => { this.setInactive(item, 'playing'); });
	},

	setKey(item, key, value) {
		if(!item || !key) { return; }
		Ember.set(item, key, value);
		if(!this._destroyed()) {
			this.set(key, value);
		}
	},

	setActive(item, key) {
		this.setKey(item, key, true);
	},

	setInactive(item, key) {
		this.setKey(item, key, false);
	},

	reset(item) {
		this.setInactive(item, 'playing');
		this.setInactive(item, 'recording');

		Ember.run.cancel(this.get('audio_timeout'));
		Ember.run.cancel(this.get('active_timeout'));

		let recorder = this.get('recorder');
		Ember.$('#category-module-audio').remove();
		if(recorder) { recorder.stop(); recorder.clear(); }
	},

	_destroyed: function() {
		return this.get('isDestroyed') || this.get('isDestroying');
	},

	actions: {
		alert() {
			window.swal({ title: "Error!", text: "Upgrade required to perform this action", type: "error" });
		},
		playAudio(item) {
			if(item && Ember.get(item, 'playing') === true) { return this.reset(item); }
			if(item && Ember.get(item, 'permissions.play') && Ember.get(item, 'media.audio')) { return this.playAudio(item); }
		},
		recordAudio(item) {
			if(item && Ember.get(item, 'recording') === true) { return this.reset(item); }
			if(item && Ember.get(item, 'permissions.record')) { return this.recordAudio(item); }
		}
	}
});
