import Ember from 'ember';

import AfterRender from '../mixins/after-render';

export default Ember.Component.extend(AfterRender, {

	local: '',

	search: '',

	source: '',

	videos: [],

	current: false,

	showList: true,

	showVideo: true,

	showSearch: true,

	setSource: function(){
		let current = this.get('current');
		let new_source = current && current.get('source');
		if(!new_source) { return; }

		let $video = Ember.$('video').find('source').attr('src', new_source).end().clone();
		Ember.$('.video-container').empty().append($video);
		this.set('source', new_source);
	}.observes('current'),

	scrollUp: function() {
		Ember.run.scheduleOnce('afterRender', this, function() {
			window.scrollTo(0, 0);
		});
	}.observes('source'),

	filterVideos: function(){
		let search_value = this.get('search');
		(this.get('videos') || []).forEach(function(video){

			let video_name = video.get('name');
			let in_search_space = search_value &&
				video_name.replace(/\s/g, '').toLowerCase().includes(
					search_value.replace(/\s/g, '').toLowerCase()
				);

			if(search_value && !in_search_space){
				video.set('hide', true);
			} else { video.set('hide', false); }
		});
	},
	filter: function(){
		Ember.run.once(this, 'filterVideos');
	}.observes('search', 'videos').on('init')
});
