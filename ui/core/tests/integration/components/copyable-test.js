import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | copyable', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`<Copyable @text="Copy me">text</Copyable>`);
    assert.ok(find('.copyable'));
    assert.equal(find('.copyable-content').textContent.trim(), 'text');
    assert.equal(find('.copyable-button').textContent.trim(), 'Copy me');
  });
});