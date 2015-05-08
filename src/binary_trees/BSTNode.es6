import 'core-js/shim';
const IM = require('immutable');

export default class BSTNode {

  constructor(key, value, left, right) {
    this._store = IM.Map({ '_key': key, '_value': value, '_left': left, '_right': right });
  }

  get key() {
    return this._store.get('_key', null);
  }

  get value() {
    return this._store.get('_value', null);
  }

  get left() {
    return this._store.get('_left', null);
  }

  get right() {
    return this._store.get('_right', null);
  }

}
