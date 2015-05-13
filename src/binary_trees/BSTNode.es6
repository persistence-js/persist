import 'core-js/shim';
const IM = require('immutable');


export default class BSTNode {

  constructor(key, value, left, right, id) {
    if (IM.Map.isMap(key)) {
      this._store = key;
    } else {
      this._store = IM.Map({ '_key': key, '_value': value, '_left': left, '_right': right, '_id': id });
    }
    Object.freeze(this);
  }

  get store() {
    return this._store;
  }

  get key() {
    return this.store.get('_key');
  }

  get value() {
    return this.store.get('_value');
  }

  get left() {
    return this.store.get('_left', null);
  }

  get right() {
    return this.store.get('_right', null);
  }

  get id() {
    return this.store.get('_id');
  }

}
