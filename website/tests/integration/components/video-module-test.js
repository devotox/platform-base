import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('video-module', 'Integration | Component | video module', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{video-module}}`);

	assert.equal(this.$().text().trim().replace(/\s+/g, '-'), 'Search-Video-List-Sorry-No-videos-Available');

  // Template block usage:"
  this.render(hbs`
	{{#video-module}}
	  template block text
	{{/video-module}}
  `);

	assert.equal(this.$().text().trim().replace(/\s+/g, '-'), 'Search-Video-List-Sorry-No-videos-Available');
});
