'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

require('core-js/shim');

var IM = require('immutable');
var LList = require('./LList');

var CLList = (function (_LList) {
  function CLList() {
    var itemOrList = arguments[0] === undefined ? [] : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, CLList);

    options.circular = true;
    _get(Object.getPrototypeOf(CLList.prototype), 'constructor', this).call(this, itemOrList, options);
  }

  _inherits(CLList, _LList);

  _createClass(CLList, [{
    key: 'removeAfter',

    //Returns a new list, removing one node after the specified node.
    value: function removeAfter(nodeToRemove) {
      return this.remove(nodeToRemove.next);
    }
  }, {
    key: 'removeBefore',

    //Returns a new list, removing one node before the specified node.
    value: function removeBefore(nodeToRemoveBefore) {
      var isTarget = function isTarget(nodeToCheck) {
        return nodeToCheck.next === nodeToRemoveBefore;
      };
      return this.remove(this.filter(isTarget)[0]);
    }
  }, {
    key: 'addAfter',

    //Returns a new list, adding one node after the specified node.
    value: function addAfter(atNode, addition) {
      return this.addBefore(atNode, addition, false);
    }
  }, {
    key: 'addBefore',

    //Returns a new list, adding one node before the specified node.
    value: function addBefore(atNode, addition) {
      var _this = this;

      var before = arguments[2] === undefined ? true : arguments[2];

      var additionList = new LList(addition);
      var insert = (function () {
        var newList = [];
        _this.forEach(function (node) {
          if (node === atNode && !!before) {
            newList = newList.concat(additionList.map(LList.getData));
          }
          newList.push(node.data);
          if (node === atNode && !before) {
            newList = newList.concat(additionList.map(LList.getData));
          }
        });

        return new CLList(newList);
      }).bind(this);

      return LList.isNode(atNode) ? insert() : new Error('Error, inputs must be LList Nodes.');
    }
  }, {
    key: 'remove',

    //Helper functions
    value: function remove(nodeToRemove) {
      var notNode = function notNode(nodeToCheck) {
        return nodeToCheck !== nodeToRemove;
      };
      return new CLList(this.filter(notNode).map(LList.getData));
    }
  }]);

  return CLList;
})(LList);

exports['default'] = CLList;
module.exports = exports['default'];
