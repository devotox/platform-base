import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('reset-form', 'Integration | Component | reset form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{reset-form}}`);

  assert.equal(this.$().text().trim().replace(/\s+/g, '-'), 'Account-Reset-Email-Address-Reset-Don\'t-Have-An-Account?-Sign-Up-Today');

  // Template block usage:"
  this.render(hbs`
	{{#reset-form}}
	  template block text
	{{/reset-form}}
  `);

  assert.equal(this.$().text().trim().replace(/\s+/g, '-'), 'Account-Reset-Email-Address-Reset-Don\'t-Have-An-Account?-Sign-Up-Today');
});
