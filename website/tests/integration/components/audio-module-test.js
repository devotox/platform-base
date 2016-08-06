import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('audio-module', 'Integration | Component | audio module', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{audio-module}}`);

	assert.equal(this.$().text().trim().replace(/\s/g, '-'), '');

  // Template block usage:
  this.render(hbs`
	{{#audio-module}}
	  template block text
	{{/audio-module}}
  `);

  assert.equal(this.$().text().trim(), '');
});
