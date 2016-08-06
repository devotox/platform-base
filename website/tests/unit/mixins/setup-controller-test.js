import Ember from 'ember';
import SetupControllerMixin from 'platform-base/mixins/setup-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | setup controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let SetupControllerObject = Ember.Object.extend(SetupControllerMixin);
  let subject = SetupControllerObject.create();
  assert.ok(subject);
});
