import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | host set', function(hooks) {
  setupTest(hooks);

  test('it serializes host sets normally, without host_ids', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-set');
    const record = store.createRecord('host-set', {
      name: 'Host Set 1',
      description: 'Description',
      host_ids: [{value: '1'}, {value: '2'}, {value: '3'}],
      version: 1
    });
    const snapshot = record._createSnapshot();
    snapshot.adapterOptions = {};
    const serializedRecord = serializer.serialize(snapshot);
    assert.deepEqual(serializedRecord, {
      name: 'Host Set 1',
      description: 'Description',
      version: 1
    });
  });

  test('it serializes only host_ids when `adapterOptions.serializeHostIDs` is true', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-set');
    const record = store.createRecord('host-set', {
      name: 'Host Set 1',
      description: 'Description',
      host_ids: [{value: '1'}, {value: '2'}, {value: '3'}],
      version: 1
    });
    const snapshot = record._createSnapshot();
    snapshot.adapterOptions = {
      serializeHostIDs: true
    };
    const serializedRecord = serializer.serialize(snapshot);
    assert.deepEqual(serializedRecord, {
      host_ids: ['1', '2', '3'],
      version: 1
    });
  });

  test('it normalizes records with array fields', function (assert) {
    assert.expect(1);
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('host-set');
    const hostSetModelClass = store.createRecord('host-set').constructor;
    const payload = {
      id: '1',
      name: 'Host Set 1',
      host_ids: ['1', '2', '3']
    };
    const normalized = serializer.normalizeSingleResponse(
      store,
      hostSetModelClass,
      payload
    );
    assert.deepEqual(normalized, {
      included: [],
      data: {
        id: '1',
        type: 'host-set',
        attributes: {
          name: 'Host Set 1',
          host_ids: [{value: '1'}, {value: '2'}, {value: '3'}],
        },
        relationships: {},
      },
    });
  });
});