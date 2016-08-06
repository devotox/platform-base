import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('chat-module', 'Integration | Component | chat module', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{chat-module}}`);

  assert.equal(this.$().text().trim().replace(/\s+/g, '-'), 'Platform-Chat-Username-Enter-Message-Send');

  // Template block usage:"
  this.render(hbs`
	{{#chat-module}}
	  template block text
	{{/chat-module}}
  `);

	assert.equal(this.$().text().trim().replace(/\s+/g, '-'), 'Platform-Chat-Username-Enter-Message-Send');
});
