'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js/shim');

var IM = require('immutable');

var LList = (function () {
  /**
   * Accepts items and list-like objects.
   * Converts them into Immutable Seq's of length >1 before
   * creating nodes.
   * @param  {Array}  itemOrList [description]
   * @param  {Object} options [circular (bool), prependTo(node), oldSize(num)]
   * @return {[type]}            [description]
   */

  function LList() {
    var itemOrList = arguments[0] === undefined ? [] : arguments[0];
    var options = arguments[1] === undefined ? { circular: false } : arguments[1];

    _classCallCheck(this, LList);

    var items = LList.convertToSeq(itemOrList);
    this.head = LList.makeHead(items);
    this.size = items.size;
    var prepend = options.prependTo && LList.isNode(options.prependTo);
    if (prepend) {
      if (this.size === 0) {
        this.head = options.prependTo;
      } else {
        this.tail.next = options.prependTo;
      }
      this.size = this.size + options.oldSize;
    }
    if (options.circular) {
      this.tail.next = this.head;
      this.circular = options.circular;
    }
    this.forEach(Object.freeze);
    Object.freeze(this);
  }

  _createClass(LList, [{
    key: 'prepend',

    /**
     * Returns a new list, with the current list as the tail of the input.
     * Utilizes tail-sharing.
     * @param  {Item, Array, List, Node, or LList}  toPrepend []
     * @return {[type]}           [description]
     */
    value: function prepend() {
      var toPrepend = arguments[0] === undefined ? [] : arguments[0];

      var opts = {
        circular: this.circular,
        prependTo: this.head,
        oldSize: this.size
      };
      //If circular, can't use tail-sharing.
      if (this.circular) {
        toPrepend = LList.convertToSeq(toPrepend);
        return new LList(toPrepend.concat(this.map(LList.getData)).toArray(), { circular: this.circular });
      }
      //Else, prepend in O(1);
      return LList.isNode(toPrepend) ? new LList(LList.getData(toPrepend), opts) : LList.isLList(toPrepend) ? new LList(toPrepend.map(LList.getData), opts) : new LList(toPrepend, opts);
    }
  }, {
    key: 'append',

    /**
     * Returns a new list in O(n) by recollecting elements of both
     * into a Seq, and passing that Seq to the LList constructor.
     * @param  {[Item, Array, List, Node, or LList]} toAppend [description]
     * @return {[type]}       [description]
     */
    value: function append(toAppend) {
      var opts = { circular: this.circular };
      return new LList(this.map(LList.getData).concat(LList.isNode(toAppend) ? LList.getData(toAppend) : LList.isLList(toAppend) ? toAppend.map(LList.getData) : LList.convertToSeq(toAppend).toArray()), opts);
    }
  }, {
    key: 'reverse',

    /**
     * Returns a new list, with copies of the old list's elements, pointed
     * in reverse order
     * @return {[type]} [description]
     */
    value: function reverse() {
      var reversed = [];
      var unShiftToList = function unShiftToList(element) {
        reversed.unshift(element);
      };
      this.map(LList.getData).forEach(unShiftToList);
      return new LList(reversed, { circular: this.circular });
    }
  }, {
    key: 'removeHead',

    /**
     * Returns a new list, sans the current list's head.
     * Uses tail-sharing.
     * @return {[type]} [description]
     */
    value: function removeHead() {
      var _this = this;

      var notFirst = function notFirst(node) {
        return node !== _this.head;
      };
      return new LList(this.filter(notFirst).map(LList.getData), { circular: this.circular });
    }
  }, {
    key: 'removeTail',

    /**
     * Returns a new list in O(n), sans the current list's tail.
     * @return {[type]} [description]
     */
    value: function removeTail() {
      var _this2 = this;

      var notLast = function notLast(node) {
        return node !== _this2.tail;
      };
      return new LList(this.filter(notLast).map(LList.getData), { circular: this.circular });
    }
  }, {
    key: 'forEach',

    //Functional Helpers:
    value: function forEach(cb) {
      var current = this.head;
      while (current !== null) {
        cb(current);
        current = current.next;
        //for circular lists:
        if (current === this.head) {
          break;
        }
      }
    }
  }, {
    key: 'map',
    value: function map(cb) {
      var mapped = [];
      var pushResult = function pushResult(node) {
        mapped.push(cb(node));
      };
      this.forEach(pushResult);
      return mapped;
    }
  }, {
    key: 'filter',
    value: function filter(predicate) {
      var filtered = [];
      this.forEach(function (node) {
        if (!!predicate(node)) {
          filtered.push(node);
        }
      });
      return filtered;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.size <= 0;
    }
  }, {
    key: 'tail',

    /**
     * Find the final node in the Linked List in O(n).
     * @return {[Node]} [last node in the linked list, null if list is empty]
     */
    get: function () {
      var pointsAt = function pointsAt(point) {
        return function (element) {
          return element.next === point;
        };
      };
      var sentinel = this.circular ? this.head : null;
      return this.size < 1 ? null : this.filter(pointsAt(sentinel))[0];
    }
  }], [{
    key: 'makeNode',

    /**
     * Creates individual nodes, from anything that can be stored
     * in an immutable Seq.
     * Can be passed null to create tails.
     * @param  {[Primitive, Object]}   data []
     * @param  {[New Node, null]} next []
     * @return {[object]}        []
     */
    value: function makeNode(data, next) {
      var node = {
        data: data,
        next: next
      };
      node[LList._LLNODE_SENTINEL_()] = true;
      return node;
    }
  }, {
    key: 'makeHead',
    value: function makeHead(seq) {
      if (seq === null || seq.size === 0) {
        return null;
      } else {
        var rest = seq.rest();
        rest = rest.size === 0 ? null : rest;
        return LList.makeNode(seq.first(), LList.makeHead(rest));
      }
    }
  }, {
    key: 'getData',

    //Extracts data from Nodes
    value: function getData(node) {
      return LList.isNode(node) ? node.data : new Error('getData only accepts nodes.');
    }
  }, {
    key: 'isLList',
    value: function isLList(maybeLList) {
      return !!(maybeLList && maybeLList[LList._LL_SENTINEL_()]);
    }
  }, {
    key: 'isNode',
    value: function isNode(maybeNode) {
      return !!(maybeNode && maybeNode[LList._LLNODE_SENTINEL_()]);
    }
  }, {
    key: 'convertToSeq',
    value: function convertToSeq(itemOrList) {
      return Array.isArray(itemOrList) ? IM.Seq(itemOrList) : IM.Seq([].concat(itemOrList));
    }
  }, {
    key: '_LL_SENTINEL_',
    value: function _LL_SENTINEL_() {
      return '@@__LINKED_LIST__@@';
    }
  }, {
    key: '_LLNODE_SENTINEL_',
    value: function _LLNODE_SENTINEL_() {
      return '@@__LL_NODE__@@';
    }
  }]);

  return LList;
})();

exports['default'] = LList;

LList.prototype[LList._LL_SENTINEL_()] = true;
module.exports = exports['default'];
