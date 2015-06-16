'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js/shim');

var IM = require('immutable');
var BSTNode = require('./BSTNode');

var BSTree = (function () {
  /**
   * Accepts optional custom comparator function for sorting keys,
   * and optional BSTNode to use as root of new tree.
   * If no comparator, default comparator with #sort interface will be used.
   * @param {[Function]} comparator [must return 0, 1, or -1 to sort subtrees]
   * @param {[BSTNode]} _root [optional root from which to construct tree]
   * @constructor
   */

  function BSTree(comparator, _root) {
    _classCallCheck(this, BSTree);

    this._comparator = BSTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    if (BSTree.isBSTNode(_root)) {
      this._root = BSTree.cloneNode(_root);
      this._count = BSTree.recount(_root);
    }
    Object.freeze(this);
  }

  _createClass(BSTree, [{
    key: 'insert',

    /**
     * Returns a new tree with the key and value inserted.
     * @param {[*]} key [the key with which to store the value parameter]
     * @param {[*]} value [the value to store with key parameter]
     * @return {[BSTree]} [new BST with the key-value pair inserted]
     */
    value: function insert(key, value) {
      if (key === undefined) {
        return this.clone();
      } else if (!this.size) {
        return new BSTree(this.comparator, new BSTNode(key, value, null, null, 1), 1);
      } else {
        var _BSTree$recursiveSearch = BSTree.recursiveSearch(this.comparator, this.root, key);

        var _BSTree$recursiveSearch2 = _slicedToArray(_BSTree$recursiveSearch, 2);

        var node = _BSTree$recursiveSearch2[0];
        var ancestors = _BSTree$recursiveSearch2[1];

        node = node ? new BSTNode(node._store.set('_value', value)) : new BSTNode(key, value, null, null, this.size + 1);
        return new BSTree(this.comparator, BSTree.constructFromLeaf(node, ancestors));
      }
    }
  }, {
    key: 'remove',

    /**
     * Returns a new tree with the given node removed. If the key is not found,
     * returns a clone of current tree.
     * @param {[*]} key [the key of the node to remove]
     * @return {[BSTree]} [new BST with the given node removed]
     */
    value: function remove(key) {
      var _BSTree$recursiveSearch3 = BSTree.recursiveSearch(this.comparator, this.root, key);

      var _BSTree$recursiveSearch32 = _slicedToArray(_BSTree$recursiveSearch3, 2);

      var node = _BSTree$recursiveSearch32[0];
      var ancestors = _BSTree$recursiveSearch32[1];

      if (!this.size || key === undefined || !node) {
        return this.clone();
      } else if (node) {
        return BSTree.removeFound(this.comparator, node, ancestors);
      }
    }
  }, {
    key: 'find',

    /**
     * Get the node with the matching key in tree in O(log n).
     * @param {[*]} key [the key of the node to find]
     * @return {[BSTNode|null]} [found node, null if key not found]
     */
    value: function find(key) {
      return BSTree.recursiveSearch(this.comparator, this.root, key)[0];
    }
  }, {
    key: 'get',

    /**
     * Get the value of the node with the matching key in tree in O(log n).
     * @param {[*]} key [the key of the value to get]
     * @return {[*]} [value of found node, null if key not found]
     */
    value: function get(key) {
      var _BSTree$recursiveSearch4 = BSTree.recursiveSearch(this.comparator, this.root, key);

      var _BSTree$recursiveSearch42 = _slicedToArray(_BSTree$recursiveSearch4, 1);

      var search = _BSTree$recursiveSearch42[0];

      return !search ? null : search.value;
    }
  }, {
    key: 'contains',

    /**
     * Check if there is a node with the matching value in tree in O(n).
     * @param {[*]} value [the value of the node for which to search]
     * @return {[Boolean]} [true if found, false if not found]
     */
    value: function contains(value) {
      return this.values.indexOf(value) > -1;
    }
  }, {
    key: 'forEach',

    /**
     * Apply the callback to each node in the tree, in-order.
     * @param {[Function]} callback [recieves a BSTNode as input]
     * @return {[undefined]} [side-effect function]
     */
    value: function forEach(callback) {
      BSTree.traverseInOrder(this.root, callback);
    }
  }, {
    key: 'insertAll',

    /**
     * Returns a new tree with the list's key-value pairs inserted.
     * @param {[Array]} listToInsert [an array of key-value tuples to insert]
     * @return {[BSTree]} [new BST with the all the key-value pairs inserted]
     */
    value: function insertAll() {
      var listToInsert = arguments[0] === undefined ? [] : arguments[0];

      var resultTree = this;
      listToInsert.forEach(function (pair) {
        resultTree = resultTree.insert(pair[0], pair[1]);
      });
      return resultTree;
    }
  }, {
    key: 'clone',

    /**
     * Clone the current tree.
     * @return {[BSTree]} [new BST clone of current tree]
     */
    value: function clone() {
      return new BSTree(this.comparator, this.root);
    }
  }, {
    key: 'size',

    /**
     * Get the number of nodes in the tree
     * @return {[Number]} [count of all nodes]
     */
    get: function () {
      return this._count;
    }
  }, {
    key: 'comparator',

    /**
     * Get the key comparator function of the tree
     * @return {[Function]} [custom comparator, default if no custom comparator]
     */
    get: function () {
      return this._comparator;
    }
  }, {
    key: 'root',

    /**
     * Get the first node in tree
     * @return {[BSTNode|null]} [root node, null if tree is empty]
     */
    get: function () {
      return this._root;
    }
  }, {
    key: 'min',

    /**
     * Get the node with the smallest key in tree in O(log n).
     * @return {[BSTNode|null]} [min node, null if tree is empty]
     */
    get: function () {
      return BSTree.traverseSide('left', this);
    }
  }, {
    key: 'max',

    /**
     * Get the node with the largest key in tree in O(log n).
     * @return {[BSTNode|null]} [max node, null if tree is empty]
     */
    get: function () {
      return BSTree.traverseSide('right', this);
    }
  }, {
    key: 'keys',

    /**
     * Get all of the keys in tree in an ordered array in O(n).
     * @return {[Array]} [all the keys in the tree, ordered based on comparator]
     */
    get: function () {
      var keys = [];
      this.forEach(function (node) {
        return keys.push(node.key);
      });
      return keys;
    }
  }, {
    key: 'values',

    /**
     * Get all of the values in tree in a key-ordered array in O(n).
     * @return {[Array]} [all the values in the tree, ordered based on key comparison]
     */
    get: function () {
      var values = [];
      this.forEach(function (node) {
        return values.push(node.value);
      });
      return values;
    }
  }], [{
    key: 'setComparator',

    /**
     * Returns the given comparator if acceptable, or the default comparator function.
     * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
     * @return {[Function]} [custom comparator if given, default comparator otherwise]
     */
    value: function setComparator(comparator) {
      var isComparator = !!comparator && typeof comparator === 'function';
      return isComparator ? comparator : BSTree.defaultComp;
    }
  }, {
    key: 'defaultComp',

    /**
     * Returns 1, 0, or -1 based on default comparison criteria.
     * @param {[*]} keyA [the first key for comparison]
     * @param {[*]} keyB [the second key for comparison]
     * @return {[Number]} [-1 if keyA is smaller, 1 if keyA is bigger, 0 if the same]
     */
    value: function defaultComp(keyA, keyB) {
      if (keyA < keyB) return -1;else if (keyA > keyB) return 1;else return 0;
    }
  }, {
    key: 'isBSTNode',

    /**
     * Checks if a given input is a BSTNode.
     * @param {[*]} maybe [entity to check for BSTNode-ness]
     * @return {[Boolean]} [true if maybe is a BSTNode, false otherwise]
     */
    value: function isBSTNode(maybe) {
      return !!maybe && maybe.constructor === BSTNode;
    }
  }, {
    key: 'cloneNode',

    /**
     * Clone the input BSTNode.
     * @param {[BSTNode]} node [node to clone]
     * @return {[BSTNode]} [new BSTNode clone of input node]
     */
    value: function cloneNode(node) {
      return new BSTNode(node.key, node.value, node.left, node.right, node.id);
    }
  }, {
    key: 'recount',

    /**
     * Returns the count of nodes present in _root input.
     * @param {[BSTNode]} _root [the root to recount]
     * @return {[Number]} [count of nodes in _root]
     */
    value: function recount(_root) {
      var count = 0;
      BSTree.traverseInOrder(_root, function () {
        return count++;
      });
      return count;
    }
  }, {
    key: 'findInOrderPredecessor',

    /**
     * Returns the ancestor nodes and in-order predecessor of the input node.
     * @param {[BSTNode]} leftChild [node from which to start the search for IOP]
     * @return {[Array]} [tuple containing a stack of ancestors and the IOP]
     */
    value: function findInOrderPredecessor(leftChild) {
      var currentIop = leftChild,
          ancestors = [];
      while (currentIop.right) {
        ancestors.push(['_right', currentIop]);
        currentIop = currentIop.right;
      }
      return [ancestors, currentIop];
    }
  }, {
    key: 'traverseInOrder',

    /**
     * Apply the callback to each node, in-order.
     * Recursive traversal, static version of #forEach
     * @param {[BSTNode]} node [the root node from which to start traversal]
     * @param {[Function]} callback [recieves a BSTNode as input]
     * @return {[undefined]} [side-effect function]
     */
    value: function traverseInOrder(node, cb) {
      if (!node) return;
      var left = node.left,
          right = node.right;
      if (left) BSTree.traverseInOrder(left, cb);
      cb(node);
      if (right) BSTree.traverseInOrder(right, cb);
    }
  }, {
    key: 'traverseSide',

    /**
     * Returns the leaf BSTNode furthest down a given side of tree in O(log n).
     * @return {[BSTNode|null]} [max or min node, null if tree is empty]
     */
    value: function traverseSide(side, tree) {
      var currentRoot = tree.root;
      if (!currentRoot) return null;
      var nextNode = currentRoot[side];
      while (nextNode) {
        currentRoot = nextNode;
        nextNode = nextNode[side];
      }
      return currentRoot;
    }
  }, {
    key: 'recursiveSearch',

    /**
     * Returns tuple of the found node and a stack of ancestor nodes.
     * Generic O(log n) recursive search of BSTree.
     * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
     * @param {[BSTNode]} node [node from which to start the search]
     * @param {[*]} key [the key used for search]
     * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
     * @return {[Array]} [tuple containing null or the found node, and a stack of ancestors]
     */
    value: function recursiveSearch(comparator, node, key) {
      var ancestorStack = arguments[3] === undefined ? [] : arguments[3];

      if (!node) return [null, ancestorStack];
      var comparisons = comparator(node.key, key);
      if (comparisons === -1) {
        ancestorStack.push(['_right', node]);
        return BSTree.recursiveSearch(comparator, node.right, key, ancestorStack);
      } else if (comparisons === 1) {
        ancestorStack.push(['_left', node]);
        return BSTree.recursiveSearch(comparator, node.left, key, ancestorStack);
      } else {
        return [node, ancestorStack];
      }
    }
  }, {
    key: 'removeNoChildren',

    /**
     * Returns new root node with input node removed.
     * Input node must have no children.
     * @param {[BSTNode]} node [node from which to start the removal]
     * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
     * @return {[BSTNode]} [new root node constructed from tree with input node removed]
     */
    value: function removeNoChildren(node, ancestors) {
      if (ancestors.length) {
        var _ancestors$pop = ancestors.pop();

        var _ancestors$pop2 = _slicedToArray(_ancestors$pop, 2);

        var childSide = _ancestors$pop2[0];
        var parentNode = _ancestors$pop2[1];

        node = new BSTNode(parentNode._store.set(childSide, null));
      }
      return BSTree.constructFromLeaf(node, ancestors);
    }
  }, {
    key: 'removeOneChild',

    /**
     * Returns new root node with input node removed.
     * Input node must have exactly one child.
     * @param {[BSTNode]} node [node from which to start the removal]
     * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
     * @return {[BSTNode]} [new root node with input node removed and children repositioned]
     */
    value: function removeOneChild(node, ancestors) {
      var childNode = node.children[0][1];
      if (!ancestors.length) {
        return childNode;
      } else {
        var _ancestors$pop3 = ancestors.pop();

        var _ancestors$pop32 = _slicedToArray(_ancestors$pop3, 2);

        var childSide = _ancestors$pop32[0];
        var parentNode = _ancestors$pop32[1];
        var leaf = new BSTNode(parentNode._store.set(childSide, childNode));
        return BSTree.constructFromLeaf(leaf, ancestors);
      }
    }
  }, {
    key: 'removeTwoChildren',

    /**
     * Returns new root node with input node removed.
     * Input node must have exactly two children.
     * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
     * @param {[BSTNode]} node [node from which to start the removal]
     * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
     * @return {[BSTNode]} [new root node with input node removed and children repositioned]
     */
    value: function removeTwoChildren(comparator, node, ancestors) {
      var _BSTree$findInOrderPredecessor = BSTree.findInOrderPredecessor(node.left);

      var _BSTree$findInOrderPredecessor2 = _slicedToArray(_BSTree$findInOrderPredecessor, 2);

      var rightAncestors = _BSTree$findInOrderPredecessor2[0];
      var iop = _BSTree$findInOrderPredecessor2[1];

      var iopReplacementStore = iop.store.withMutations(function (_store) {
        _store.set('_key', node.key).set('_value', node.value).set('_id', node.id);
      });
      var targetReplacementStore = node.store.withMutations(function (_store) {
        _store.set('_key', iop.key).set('_value', iop.value).set('_id', iop.id).set('_left', new BSTNode(iopReplacementStore));
      });
      var newIopNode = new BSTNode(targetReplacementStore);
      ancestors = ancestors.concat([['_left', newIopNode]], rightAncestors);
      return BSTree.removeFound(comparator, newIopNode.left, ancestors);
    }
  }, {
    key: 'removeFound',

    /**
     * Returns new root node with input node removed.
     * Input node can have any number of children. Dispatches to correct removal method.
     * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
     * @param {[BSTNode]} node [node from which to start the removal]
     * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
     * @return {[BSTNode]} [new root node with input node removed and children repositioned]
     */
    value: function removeFound(comparator, node, ancestors) {
      switch (node.children.length) {
        case 1:
          return new BSTree(comparator, BSTree.removeOneChild(node, ancestors));
          break;
        case 2:
          return BSTree.removeTwoChildren(comparator, node, ancestors);
          break;
        default:
          return new BSTree(comparator, BSTree.removeNoChildren(node, ancestors));
          break;
      }
    }
  }, {
    key: 'constructFromLeaf',

    /**
     * Returns new root node reconstructed from a leaf node and ancestors.
     * @param {[BSTNode]} node [leaf node from which to start the construction]
     * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
     * @return {[BSTNode]} [new root node reconstructed from leaf and ancestors stack]
     */
    value: function constructFromLeaf(node, ancestors) {
      while (ancestors.length) {
        var _ancestors$pop4 = ancestors.pop();

        var _ancestors$pop42 = _slicedToArray(_ancestors$pop4, 2);

        var childSide = _ancestors$pop42[0];
        var parentNode = _ancestors$pop42[1];

        node = new BSTNode(parentNode._store.set(childSide, node));
      }
      return node;
    }
  }]);

  return BSTree;
})();

exports['default'] = BSTree;
module.exports = exports['default'];
