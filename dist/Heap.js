'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js/shim');

var IM = require('immutable');

var Heap = (function () {
  /**
   * Heap constructor
   * @param  {[type]}  value      [IM.List, Array, Heap, or Primitive]
   * @param  {Boolean} isMax      [Defaults to a min heap]
   * @param  {[function]}  comparator [Must return {0, 1, -1} to sort nodes]
   * @return {[type]}             [Heap]
   */

  function Heap() {
    var value = arguments[0] === undefined ? null : arguments[0];
    var isMax = arguments[1] === undefined ? false : arguments[1];
    var comparator = arguments[2] === undefined ? Heap.defaultComparator() : arguments[2];

    _classCallCheck(this, Heap);

    if (!!value && this.isHeap(value)) {
      this._heapStorage = value._heapStorage;
      this.maxHeap = isMax;
      this.comparatorFunction = value.comparator;
      return this;
    }
    //Construct from primitive, array, or IM.List
    this._heapStorage = IM.List.isList(value) ? value : new IM.List(value);
    this.maxHeap = isMax && typeof isMax === 'boolean' ? true : false;
    if (!!comparator && typeof comparator === 'function') {
      this.comparatorFunction = comparator;
    } else {
      this.comparatorFunction = Heap.defaultComparator();
    }
    this._heapStorage = this.buildHeap(this._heapStorage);
    Object.freeze(this);
  }

  _createClass(Heap, [{
    key: 'push',

    //Returns a new Heap, with the new value inserted.
    value: function push(value) {
      var childIndex = this.storage.size;
      var parentIndex = Heap.findParentWithChild(childIndex);
      var newStorage = this.storage.push(value);
      var finalStorageList = this.siftUp(parentIndex, childIndex, newStorage);

      return new Heap(finalStorageList, this.isMaxHeap, this.comparator);
    }
  }, {
    key: 'pop',

    /**
     * Returns a new Heap with the extracted value (max or min)
     * Use Peek() for the top of the Heap.
     * With inputs, will behave as if replace() was called on a regular Heap.
     * @param  {[type]} value [Repesents a new node]
     * @return {[type]}       [A new Heap]
     */
    value: function pop(value) {
      var _this = this;

      if (this.storage.size <= 0) {
        return this;
      }
      var siftingList = undefined;
      if (value === undefined) {
        siftingList = this.storage.withMutations(function (list) {
          return list.set(0, _this.storage.last()).pop();
        });
      } else {
        siftingList = this.storage.set(0, value);
      }
      var finalStorageList = this.siftDown(siftingList, 0);

      return new Heap(finalStorageList, this.isMaxHeap, this.comparator);
    }
  }, {
    key: 'replace',

    //Alias method for pop, but with a value.
    value: function replace(value) {
      return this.pop(value);
    }
  }, {
    key: 'buildHeap',

    /**
     * Builds the array repesenting Heap Storage.
     * Should only be called from constructor.
     * Does so by calling siftDown on all non-leaf nodes.
     * @param  {[type]} array [Heap Storage, must be an Immutable List]
     * @return {[type]}       [New Heap Storage]
     */
    value: function buildHeap(list) {
      var _this2 = this;

      if (!IM.List.isList(list)) {
        return new Error('buildHeap input is not an Immutable List!');
      } else {
        var _ret = (function () {
          //Using size of Heap, find the number of .siftDown calls...
          var roundedPowerOfTwo = Math.floor(Math.log(list.size) / Math.log(2));
          var numberOfSifts = Math.pow(2, roundedPowerOfTwo) - 1;
          var heapifiedList = list.withMutations(function (list) {
            var siftedList = list.reduceRight((function (previous, current, index, array) {
              var inRange = index + 1 <= numberOfSifts;
              return inRange ? _this2.siftDown(previous, index) : previous;
            }).bind(_this2), list);
            return siftedList;
          });

          return {
            v: heapifiedList
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    }
  }, {
    key: 'merge',

    /**
     * Merges heaps, returning a new Heap.
     * @param  {[Heap]} hp [description]
     * @return {[type]}    [description]
     */
    value: function merge(hp) {
      var newStorage = this.buildHeap(hp._heapStorage.concat(this._heapStorage));
      return new Heap(newStorage, hp.isMaxHeap, hp.comparator);
    }
  }, {
    key: 'heapSort',

    //Returns a sorted Immuatble List of the Heap's elements.
    value: function heapSort() {
      var _this3 = this;

      var sortedList = new IM.List([]);
      sortedList = sortedList.withMutations((function (list) {
        var heap = _this3;
        for (var i = 0; i < heap.size; i++) {
          list.push(heap.peek());
          heap = heap.pop();
        }

        return list;
      }).bind(this));

      return sortedList;
    }
  }, {
    key: 'siftDown',

    //Takes a list, and sifts down depending on the index.
    value: function siftDown(list, indexToSift) {
      var _this4 = this;

      return list.withMutations((function (list) {
        var finalList = list;
        var switchDown = (function (p, c, list) {
          //Parent and Child
          finalList = Heap.switchNodes(p, c, list);
          parentIndex = c;
          children = Heap.findChildrenWithParent(parentIndex, list);
        }).bind(_this4);
        var parentIndex = indexToSift;
        var children = Heap.findChildrenWithParent(parentIndex, list);
        while (!_this4.integrityCheck(parentIndex, children.left, finalList) || !_this4.integrityCheck(parentIndex, children.right, finalList)) {
          if (children.left && children.right) {
            //must select correct child to switch:
            if (_this4.integrityCheck(children.left, children.right, finalList)) {
              switchDown(parentIndex, children.left, finalList);
            } else {
              switchDown(parentIndex, children.right, finalList);
            }
          } else if (children.left && !children.right) {
            //one Child broke integrity check:
            switchDown(parentIndex, children.left, finalList);
          } else if (!children.left && children.right) {
            //other Child broke integrity check:
            switchDown(parentIndex, children.right, finalList);
          }
        }
        return finalList;
      }).bind(this));
    }
  }, {
    key: 'siftUp',

    //Child checks parent, switches if they violate the Heap property.
    value: function siftUp(parentIndex, childIndex, list) {
      var _this5 = this;

      return list.withMutations((function (siftingList) {
        while (!_this5.integrityCheck(parentIndex, childIndex, siftingList)) {
          siftingList = Heap.switchNodes(parentIndex, childIndex, siftingList);
          //Update child and parent to continue checking:
          childIndex = parentIndex;
          parentIndex = Heap.findParentWithChild(childIndex);
        }
        return siftingList;
      }).bind(this));
    }
  }, {
    key: 'peek',
    value: function peek() {
      return this.storage.first();
    }
  }, {
    key: 'isHeap',
    value: function isHeap(object) {
      return this.__proto__ === object.__proto__ ? true : false;
    }
  }, {
    key: 'integrityCheck',

    /**
     * Returns a boolean for whether Heap Integrity is maintained.
     * @param  {[type]} parentIndex [description]
     * @param  {[type]} childIndex  [description]
     * @param  {[type]} list        [description]
     * @return {[type]}             [description]
     */
    value: function integrityCheck(parentIndex, childIndex, list) {
      if (parentIndex === null || childIndex === null) {
        return true;
      }
      var parentNode = list.get(parentIndex);
      var childNode = list.get(childIndex);
      var comparison = this.comparatorFunction(parentNode, childNode);
      if (this.isMaxHeap) {
        //maxHeap, parent should be larger
        return comparison === 1 || comparison === 0 ? true : false;
      } else {
        //minHeap
        return comparison === -1 || comparison === 0 ? true : false;
      }
    }
  }, {
    key: 'comparator',
    get: function () {
      return this.comparatorFunction;
    }
  }, {
    key: 'isMaxHeap',
    get: function () {
      return this.maxHeap;
    }
  }, {
    key: 'storage',
    get: function () {
      return this._heapStorage;
    }
  }, {
    key: 'size',
    get: function () {
      return this._heapStorage.size;
    }
  }], [{
    key: 'defaultComparator',

    //Standard comparator function. returns 1, -1, or 0 (for a match).
    value: function defaultComparator() {
      return function (a, b) {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      };
    }
  }, {
    key: 'switchNodes',

    /**
     * Switched the locations of two nodes.
     * @param  {[type]} parentIndex [description]
     * @param  {[type]} childIndex  [description]
     * @param  {[type]} list        [description]
     * @return {[type]}             [description]
     */
    value: function switchNodes(parentIndex, childIndex, list) {
      return list.withMutations(function (list) {
        var temp = list.get(parentIndex);
        return list.set(parentIndex, list.get(childIndex)).set(childIndex, temp);
      });
    }
  }, {
    key: 'findChildrenWithParent',

    //assigns child indexes for a given parent index
    value: function findChildrenWithParent(parentIndex, list) {
      var leftIdx = parentIndex * 2 + 1;
      var rightIdx = (parentIndex + 1) * 2;
      return {
        left: leftIdx >= list.size ? null : leftIdx,
        right: rightIdx >= list.size ? null : rightIdx
      };
    }
  }, {
    key: 'findParentWithChild',

    //Find the parent of a child, with the Child's index
    value: function findParentWithChild(childIndex) {
      return childIndex === 0 ? null : childIndex % 2 === 0 ? childIndex / 2 - 1 : Math.floor(childIndex / 2);
    }
  }]);

  return Heap;
})();

exports['default'] = Heap;
module.exports = exports['default'];
