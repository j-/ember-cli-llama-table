import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('llama-columngroup', 'Integration | Component | llama columngroup', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{llama-columngroup}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#llama-columngroup}}
      template block text
    {{/llama-columngroup}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
