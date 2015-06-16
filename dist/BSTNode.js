'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js/shim');

var IM = require('immutable');

var BSTNode = (function () {
  function BSTNode(key, value, left, right, id) {
    _classCallCheck(this, BSTNode);

    if (IM.Map.isMap(key)) {
      this._store = key;
    } else {
      this._store = IM.Map({
        '_key': key,
        '_value': value,
        '_left': left,
        '_right': right,
        '_id': id });
    }
    Object.freeze(this);
  }

  _createClass(BSTNode, [{
    key: 'store',
    get: function () {
      return this._store;
    }
  }, {
    key: 'key',
    get: function () {
      return this.store.get('_key');
    }
  }, {
    key: 'value',
    get: function () {
      return this.store.get('_value');
    }
  }, {
    key: 'left',
    get: function () {
      return this.store.get('_left', null);
    }
  }, {
    key: 'right',
    get: function () {
      return this.store.get('_right', null);
    }
  }, {
    key: 'id',
    get: function () {
      return this.store.get('_id');
    }
  }, {
    key: 'children',

    //Returns an array with the node's children
    get: function () {
      var children = [];
      if (this.left) children.push(['_left', this.left]);
      if (this.right) children.push(['_right', this.right]);
      return children;
    }
  }]);

  return BSTNode;
})();

exports['default'] = BSTNode;
module.exports = exports['default'];
