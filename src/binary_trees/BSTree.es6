import 'core-js/shim';
const IM = require('immutable');
const BSTNode = require('./BSTNode');

export default class BSTree {
  /**
   * Accepts optional custom comparator function for sorting keys,
   * and optional BSTNode to use as root of new tree.
   * If no comparator, default comparator with #sort interface will be used.
   * @param {[Function]} comparator [must return 0, 1, or -1 to sort subtrees]
   * @param {[BSTNode]} _root [optional root from which to construct tree]
   * @constructor
   */
  constructor(comparator, _root) {
    this._comparator = BSTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    if (BSTree.isBSTNode(_root)) {
      this._root = BSTree.cloneNode(_root);
      this._count = BSTree.recount(_root);
    }
    Object.freeze(this);
  }

  /**
   * Get the number of nodes in the tree
   * @return {[Number]} [count of all nodes]
   */
  get size() {
    return this._count;
  }

  /**
   * Get the key comparator function of the tree
   * @return {[Function]} [custom comparator, default if no custom comparator]
   */
  get comparator() {
    return this._comparator;
  }

  /**
   * Get the first node in tree
   * @return {[BSTNode|null]} [root node, null if tree is empty]
   */
  get root() {
    return this._root;
  }

  /**
   * Get the node with the smallest key in tree in O(log n).
   * @return {[BSTNode|null]} [min node, null if tree is empty]
   */
  get min() {
    return BSTree.traverseSide('left', this);
  }

  /**
   * Get the node with the largest key in tree in O(log n).
   * @return {[BSTNode|null]} [max node, null if tree is empty]
   */
  get max() {
    return BSTree.traverseSide('right', this);
  }

  /**
   * Get all of the keys in tree in an ordered array in O(n).
   * @return {[Array]} [all the keys in the tree, ordered based on comparator]
   */
  get keys() {
    let keys = [];
    this.forEach(node => keys.push(node.key));
    return keys;
  }

  /**
   * Get all of the values in tree in a key-ordered array in O(n).
   * @return {[Array]} [all the values in the tree, ordered based on key comparison]
   */
  get values() {
    let values = [];
    this.forEach(node => values.push(node.value));
    return values;
  }

  /**
   * Returns a new tree with the key and value inserted.
   * @param {[*]} key [the key with which to store the value parameter]
   * @param {[*]} value [the value to store with key parameter]
   * @return {[BSTree]} [new BST with the key-value pair inserted]
   */
  insert(key, value) {
    if (key === undefined) {
      return this.clone();
    } else if (!this.size) {
      return new BSTree(this.comparator, new BSTNode(key, value, null, null, 1), 1);
    } else {
      let [node, ancestors] = BSTree.recursiveSearch(this.comparator, this.root, key);
      node = node ? new BSTNode(node._store.set('_value', value)) :
                    new BSTNode(key, value, null, null, this.size + 1);
      return new BSTree(this.comparator, BSTree.constructFromLeaf(node, ancestors));
    }
  }

  /**
   * Returns a new tree with the given node removed. If the key is not found,
   * returns a clone of current tree.
   * @param {[*]} key [the key of the node to remove]
   * @return {[BSTree]} [new BST with the given node removed]
   */
  remove(key) {
    let [node, ancestors] = BSTree.recursiveSearch(this.comparator, this.root, key);
    if (!this.size || key === undefined || !node) {
      return this.clone();
    } else if (node) {
      return BSTree.removeFound(this.comparator, node, ancestors);
    }
  }

  /**
   * Get the node with the matching key in tree in O(log n).
   * @param {[*]} key [the key of the node to find]
   * @return {[BSTNode|null]} [found node, null if key not found]
   */
  find(key) {
    return BSTree.recursiveSearch(this.comparator, this.root, key)[0];
  }

  /**
   * Get the value of the node with the matching key in tree in O(log n).
   * @param {[*]} key [the key of the value to get]
   * @return {[*]} [value of found node, null if key not found]
   */
  get(key) {
    let [search,] = BSTree.recursiveSearch(this.comparator, this.root, key);
    return !search ? null : search.value;
  }

  /**
   * Check if there is a node with the matching value in tree in O(n).
   * @param {[*]} value [the value of the node for which to search]
   * @return {[Boolean]} [true if found, false if not found]
   */
  contains(value) {
    return this.values.indexOf(value) > -1;
  }

  /**
   * Apply the callback to each node in the tree, in-order.
   * @param {[Function]} callback [recieves a BSTNode as input]
   * @return {[undefined]} [side-effect function]
   */
  forEach(callback) {
    BSTree.traverseInOrder(this.root, callback);
  }

  /**
   * Returns a new tree with the list's key-value pairs inserted.
   * @param {[Array]} listToInsert [an array of key-value tuples to insert]
   * @return {[BSTree]} [new BST with the all the key-value pairs inserted]
   */
  insertAll(listToInsert = []) {
    let resultTree = this;
    listToInsert.forEach(pair => {
      resultTree = resultTree.insert(pair[0], pair[1]);
    });
    return resultTree;
  }

  /**
   * Clone the current tree.
   * @return {[BSTree]} [new BST clone of current tree]
   */
  clone() {
    return new BSTree(this.comparator, this.root);
  }

  /**
   * Returns the given comparator if acceptable, or the default comparator function.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @return {[Function]} [custom comparator if given, default comparator otherwise]
   */
  static setComparator(comparator) {
    let isComparator = !!comparator && typeof comparator === 'function';
    return isComparator ? comparator : BSTree.defaultComp;
  }

  /**
   * Returns 1, 0, or -1 based on default comparison criteria.
   * @param {[*]} keyA [the first key for comparison]
   * @param {[*]} keyB [the second key for comparison]
   * @return {[Number]} [-1 if keyA is smaller, 1 if keyA is bigger, 0 if the same]
   */
  static defaultComp(keyA, keyB) {
    if (keyA < keyB) return -1;
    else if (keyA > keyB) return 1;
    else return 0;
  }

  /**
   * Checks if a given input is a BSTNode.
   * @param {[*]} maybe [entity to check for BSTNode-ness]
   * @return {[Boolean]} [true if maybe is a BSTNode, false otherwise]
   */
  static isBSTNode(maybe) {
    return !!maybe && maybe.constructor === BSTNode;
  }

  /**
   * Clone the input BSTNode.
   * @param {[BSTNode]} node [node to clone]
   * @return {[BSTNode]} [new BSTNode clone of input node]
   */
  static cloneNode(node) {
    return new BSTNode(node.key, node.value, node.left, node.right, node.id);
  }

  /**
   * Returns the count of nodes present in _root input.
   * @param {[BSTNode]} _root [the root to recount]
   * @return {[Number]} [count of nodes in _root]
   */
  static recount(_root) {
    let count = 0;
    BSTree.traverseInOrder(_root, () => count++);
    return count;
  }

  /**
   * Returns the ancestor nodes and in-order predecessor of the input node.
   * @param {[BSTNode]} leftChild [node from which to start the search for IOP]
   * @return {[Array]} [tuple containing a stack of ancestors and the IOP]
   */
  static findInOrderPredecessor(leftChild) {
    let currentIop = leftChild,
        ancestors = [];
    while (currentIop.right) {
      ancestors.push(['_right', currentIop]);
      currentIop = currentIop.right;
    }
    return [ancestors, currentIop];
  }

  /**
   * Apply the callback to each node, in-order.
   * Recursive traversal, static version of #forEach
   * @param {[BSTNode]} node [the root node from which to start traversal]
   * @param {[Function]} callback [recieves a BSTNode as input]
   * @return {[undefined]} [side-effect function]
   */
  static traverseInOrder(node, cb) {
    if (!node) return;
    let left = node.left, right = node.right;
    if (left) BSTree.traverseInOrder(left, cb);
    cb(node);
    if (right) BSTree.traverseInOrder(right, cb);
  }

  /**
   * Returns the leaf BSTNode furthest down a given side of tree in O(log n).
   * @return {[BSTNode|null]} [max or min node, null if tree is empty]
   */
  static traverseSide(side, tree) {
    let currentRoot = tree.root;
    if (!currentRoot) return null;
    let nextNode = currentRoot[side];
    while (nextNode) {
      currentRoot = nextNode;
      nextNode = nextNode[side];
    }
    return currentRoot;
  }

  /**
   * Returns tuple of the found node and a stack of ancestor nodes.
   * Generic O(log n) recursive search of BSTree.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[BSTNode]} node [node from which to start the search]
   * @param {[*]} key [the key used for search]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[Array]} [tuple containing null or the found node, and a stack of ancestors]
   */
  static recursiveSearch(comparator, node, key, ancestorStack = []) {
    if (!node) return [null, ancestorStack];
    let comparisons = comparator(node.key, key);
    if (comparisons === -1) {
      ancestorStack.push(['_right', node])
      return BSTree.recursiveSearch(comparator, node.right, key, ancestorStack);
    } else if (comparisons === 1) {
      ancestorStack.push(['_left', node])
      return BSTree.recursiveSearch(comparator, node.left, key, ancestorStack);
    } else {
      return [node, ancestorStack];
    }
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have no children.
   * @param {[BSTNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[BSTNode]} [new root node constructed from tree with input node removed]
   */
  static removeNoChildren(node, ancestors) {
    if (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new BSTNode(parentNode._store.set(childSide, null));
    }
    return BSTree.constructFromLeaf(node, ancestors)
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have exactly one child.
   * @param {[BSTNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[BSTNode]} [new root node with input node removed and children repositioned]
   */
  static removeOneChild(node, ancestors) {
    let childNode = node.children[0][1];
    if (!ancestors.length) {
      return childNode;
    } else {
      let [childSide, parentNode] = ancestors.pop(),
          leaf = new BSTNode(parentNode._store.set(childSide, childNode));
      return BSTree.constructFromLeaf(leaf, ancestors);
    }
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have exactly two children.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[BSTNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[BSTNode]} [new root node with input node removed and children repositioned]
   */
  static removeTwoChildren(comparator, node, ancestors) {
    let [rightAncestors, iop] = BSTree.findInOrderPredecessor(node.left);
    let iopReplacementStore = iop.store.withMutations(_store => {
      _store.set('_key', node.key).set('_value', node.value).set('_id', node.id);
    });
    let targetReplacementStore = node.store.withMutations(_store => {
      _store.set('_key', iop.key)
            .set('_value', iop.value)
            .set('_id', iop.id)
            .set('_left', new BSTNode(iopReplacementStore));
    });
    let newIopNode = new BSTNode(targetReplacementStore);
    ancestors = ancestors.concat([['_left', newIopNode]], rightAncestors);
    return BSTree.removeFound(comparator, newIopNode.left, ancestors);
  }

  /**
   * Returns new root node with input node removed.
   * Input node can have any number of children. Dispatches to correct removal method.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[BSTNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[BSTNode]} [new root node with input node removed and children repositioned]
   */
  static removeFound(comparator, node, ancestors) {
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

  /**
   * Returns new root node reconstructed from a leaf node and ancestors.
   * @param {[BSTNode]} node [leaf node from which to start the construction]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[BSTNode]} [new root node reconstructed from leaf and ancestors stack]
   */
  static constructFromLeaf(node, ancestors) {
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new BSTNode(parentNode._store.set(childSide, node));
    }
    return node;
  }

}
