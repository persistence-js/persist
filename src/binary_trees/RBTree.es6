const IM = require('immutable');
const RBNode = require('./RBNode');
const _NULL_SENTINEL = new RBNode(null, null, null, null, null, RBNode.__BLACK);
const _NULL_SENTINEL_DB = new RBNode(null, null, null, null, null, RBNode.__DBLACK);
export default class RBTree {
  //RBTree
  constructor(comparator, _root, size = null) {
    this._comparator = RBTree.setComparator(comparator);
    this._root = null;
    this._count = 0;
    if (RBTree.isRBNode(_root)) {
      this._root = RBTree.cloneNode(_root);
      this._count = size ? size : RBTree.recount(_root);
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
   * @return {[RBNode|null]} [root node, null if tree is empty]
   */
  get root() {
    return this._root;
  }

  /**
   * Get the node with the smallest key in tree in O(log n).
   * @return {[RBNode|null]} [min node, null if tree is empty]
   */
  get min() {
    return RBTree.traverseSide('left', this);
  }

  /**
   * Get the node with the largest key in tree in O(log n).
   * @return {[RBNode|null]} [max node, null if tree is empty]
   */
  get max() {
    return RBTree.traverseSide('right', this);
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
   * @return {[RBTree]} [new BST with the key-value pair inserted]
   */
  insert(key, value) {
    if (key === undefined) {
      throw new Error ('Attempting to insert with undefined key.');
    } else if (!this.size) { //empty tree
      return new RBTree(this.comparator, new RBNode(key, value, RBTree.nullPointer, RBTree.nullPointer, 1, RBNode.__BLACK));
    } else {
      let [newNode, ancestors] = RBTree.recursiveSearch(this.comparator, this.root, key);
      let newStack;
      //save root node, and ancestors...
      //constructfromleaf...returns root node and ancestors..
      if (newNode) {//is a duplicate case
        newNode = new RBNode(newNode._store.set('_value', value));
        newStack = [newNode, ancestors]; 
        // RBTree.checkAndModifyStack(newNode, ancestors, ancestors.length);
      } else {
        //not duplicate...call checkInvariants, rotate, and repaint functions as needed...
        newNode = new RBNode(key, value, RBTree.nullPointer, RBTree.nullPointer, this.size + 1, RBNode.__RED);
        newStack = RBTree.checkAndModifyStack(newNode, ancestors, ancestors.length);
      }
      return new RBTree(this.comparator, RBTree.constructFromLeaf(newStack[0], newStack[1]));
    }
  }

  static checkAndModifyStack(newNode, ancestors, indexOfNodeToCheck) {
    //expect indexOfNodeToCheck to exceed current ancestor stack, unless in a recursive call
    if (ancestors[0][1].color !== RBNode.__BLACK){
      ancestors[0][1] = new RBNode(ancestors[0][1]._store.set('_color', RBNode.__BLACK));
      return [newNode, ancestors];
    }
    if (indexOfNodeToCheck <= 1){
      return [newNode, ancestors];
    }
    //each tuple in stack contains: [childSide, newNode]
    let nodeToCheck = (!ancestors[indexOfNodeToCheck]) ? newNode : ancestors[indexOfNodeToCheck][1]; 
    let parentIdx = (!ancestors[indexOfNodeToCheck]) ? ancestors.length-1 : indexOfNodeToCheck-1;
    let parent = ancestors[parentIdx][1];
    if (nodeToCheck.color === RBNode.__BLACK || parent.color === RBNode.__BLACK) {
      return [newNode, ancestors];
    }

    let grandparentIdx = (!ancestors[indexOfNodeToCheck]) ? ancestors.length-2 : indexOfNodeToCheck-2;
    let grandparent = ancestors[grandparentIdx][1];

    if (grandparent.color !== RBNode.__BLACK) {
      debugger;
      throw new Error("Grandparent should be black, tree invariant broken in earlier step!")
    }
    let uncle = (ancestors[grandparentIdx][0] === '_left') ? grandparent.right : grandparent.left;

    if (uncle.color === RBNode.__RED) {
      [newNode, ancestors] = RBTree.pushBlackness(newNode, ancestors, grandparentIdx);
      return RBTree.checkAndModifyStack(newNode, ancestors, grandparentIdx); 
      //after pushing blackness, GP is now red. must perform a final check, if grand-grand parent is red.
    } else {
      childSide = ancestors[parentIdx][0];
      parentSide = ancestors[grandparentIdx][0];

      if (childSide === '_right' && parentSide === '_left') {
        //Rotate Left, nodeToCheck:
        let tempChild = nodeToCheck;
        nodeToCheck = ancestors[parentIdx][1];
        //adjust nodeToCheck with WithMutations
        nodeToCheck = new RBNode(nodeToCheck._store.withMutations( (map) => {
          return map.set('_right',tempChild._store.get('_left'));
        }));
        //adjust tempChild with WithMutations, to point at completed nodeToCheck
        ancestors[parentIdx][1] = new RBNode(tempChild._store.withMutations( (map) => {
          return map.set('_left', nodeToCheck);
        }));
        ancestors[parentIdx][0] = parentSide;

        let newChildIdx = parentIdx+1;
        return RBTree.checkAndModifyStack(nodeToCheck, ancestors, newChildIdx);
      } else if (childSide === '_left' && parentSide === '_left') {
        //RotateRight, Parent:
        ancestors[parentIdx][1] = new RBNode(parent._store.withMutations( (map) => {
          map.set(
            '_right', 
            new RBNode(
              grandparent._store.withMutations( (newRight) => {
                return newRight.set('_left', map.get('_right')).set('_color', RBNode.__RED);
              })
            )
          );
          map.set('_color', RBNode.__BLACK);
          return map; 
        }));

        ancestors[parentIdx][0] = parentSide;
        ancestors.splice(grandparentIdx,1);
        //stack should now be 1 shorter, update indexOfNodeToCheck
        let oldParentIdx = grandparentIdx; 
        return RBTree.checkAndModifyStack(newNode, ancestors, oldParentIdx);
      } else if (childSide === '_right' && parentSide === '_right') {
        //rotate left, parent
        ancestors[parentIdx][1] = new RBNode(parent._store.withMutations( (map) => {
          map.set(
            '_left', 
            new RBNode(
              grandparent._store.withMutations( (newLeft) => {
                return newLeft.set('_right', map.get('_left')).set('_color', RBNode.__RED);
              })
            )
          );
          map.set('_color', RBNode.__BLACK);
          return map; 
        }));
        ancestors[parentIdx][0] = parentSide;
        ancestors.splice(grandparentIdx,1);
        let oldParentIdx = grandparentIdx; 
        return RBTree.checkAndModifyStack(newNode, ancestors, oldParentIdx);
      } else if (childSide === '_left' && parentSide === '_right') {
        //Rotate Right, nodeToCheck:
        let tempChild = nodeToCheck;
        //nodeToCheck takes parent's place in the stack
        nodeToCheck = ancestors[parentIdx][1];

        nodeToCheck = new RBNode(nodeToCheck._store.withMutations( (map) => {
          return map.set('_left',tempChild._store.get('_right'));
        }));
        ancestors[parentIdx][1] = new RBNode(tempChild._store.withMutations( (map) => {
          return map.set('_right', nodeToCheck);
        }));
        ancestors[parentIdx][0] = parentSide;

        let newChildIdx = parentIdx+1;
        return RBTree.checkAndModifyStack(nodeToCheck, ancestors, newChildIdx);
      } else {
        debugger;
        throw new Error('Invalid case, indexOfNodeToCheck: ${indexOfNodeToCheck.toString()}, '+
          'ancestors: ${ancestors.toString()}');
      }
    }
    throw new Error('Invalid case, end of check function: indexOfNodeToCheck: ${indexOfNodeToCheck.toString()}, '+
      'ancestors: ${ancestors.toString()}');
  }

  static pushBlackness(newNode, ancestors, blackNode) {
    // push blackness
    ancestors[blackNode+1][1] = new RBNode(ancestors[blackNode+1][1]._store.set('_color', RBNode.__BLACK));
    ancestors[blackNode][1] = new RBNode(ancestors[blackNode][1]._store.withMutations( (map) => {
      map.set('_color', RBNode.__RED);
      let leftChild = map.get('_left'), rightChild = map.get('_right');
      if (leftChild !== RBTree.nullPointer) {
        map.set('_left', new RBNode(leftChild._store.set('_color', RBNode.__BLACK)));
      }
      if (rightChild !== RBTree.nullPointer) {
        map.set('_right', new RBNode(rightChild._store.set('_color', RBNode.__BLACK)));
      }
      return map;
    }));
    return [newNode, ancestors, blackNode];
  }

  /**
   * Returns tuple of the found node and a stack of ancestor nodes.
   * Generic O(log n) recursive search of RBTree.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[RBNode]} node [node from which to start the search]
   * @param {[*]} key [the key used for search]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[Array]} [tuple containing null or the found node, and a stack of ancestors]
   */
  static recursiveSearch(comparator, node, key, ancestorStack = []) {
    if (node === RBTree.nullPointer || node === RBTree.nullPointerDB) return [null, ancestorStack];
    let comparisons = comparator(node.key, key);
    if (comparisons === -1) {
      ancestorStack.push(['_right', node])
      return RBTree.recursiveSearch(comparator, node.right, key, ancestorStack);
    } else if (comparisons === 1) {
      ancestorStack.push(['_left', node])
      return RBTree.recursiveSearch(comparator, node.left, key, ancestorStack);
    } else {
      //comparison returns 0:
      //should only be inside here in a find operation: upon a successful find
      return [node, ancestorStack];
    }
  }

  /**
   * Returns new root node reconstructed from a leaf node and ancestors.
   * @param {[RBNode]} node [leaf node from which to start the construction]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node reconstructed from leaf and ancestors stack]
   */
  static constructFromLeaf(node, ancestors) {
    while (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new RBNode(parentNode._store.set(childSide, node));
    }
    return node;      
  }

  /**
   * Returns a new tree with the given node removed. If the key is not found,
   * returns a clone of current tree.
   * @param {[*]} key [the key of the node to remove]
   * @return {[RBTree]} [new BST with the given node removed]
   */
  remove(key) {
    let [node, ancestors] = RBTree.recursiveSearch(this.comparator, this.root, key);
    if (!this.size || key === undefined || !node) {
      return this.clone();
    } else if (node) {
      let newRoot = RBTree.removeFound(this.comparator, node, ancestors);
      return new RBTree(this.comparator, newRoot, this.size-1);
    }
  }


  /**
   * Get the node with the matching key in tree in O(log n).
   * @param {[*]} key [the key of the node to find]
   * @return {[RBNode|null]} [found node, null if key not found]
   */
  find(key) {
    return RBTree.recursiveSearch(this.comparator, this.root, key)[0];
  }

  /**
   * Get the value of the node with the matching key in tree in O(log n).
   * @param {[*]} key [the key of the value to get]
   * @return {[*]} [value of found node, null if key not found]
   */
  get(key) {
    let [search,] = RBTree.recursiveSearch(this.comparator, this.root, key);
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
   * @param {[Function]} callback [recieves a RBNode as input]
   * @return {[undefined]} [side-effect function]
   */
  forEach(callback) {
    RBTree.traverseInOrder(this.root, callback);
  }

  /**
   * Returns a new tree with the list's key-value pairs inserted.
   * @param {[Array]} listToInsert [an array of key-value tuples to insert]
   * @return {[RBTree]} [new BST with the all the key-value pairs inserted]
   */
  insertAll(listToInsert = []) {
    let resultTree = this;
    listToInsert.forEach(pair => {
      // if (pair[0] >= 6){
      // }
      resultTree = resultTree.insert(pair[0], pair[1]);
    });
    return resultTree;
  }

  /**
   * Clone the current tree.
   * @return {[RBTree]} [new BST clone of current tree]
   */
  clone() {
    return new RBTree(this.comparator, this.root, this.size);
  }

  /**
   * Returns the given comparator if acceptable, or the default comparator function.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @return {[Function]} [custom comparator if given, default comparator otherwise]
   */
  static setComparator(comparator) {
    let isComparator = !!comparator && typeof comparator === 'function';
    return isComparator ? comparator : RBTree.defaultComp;
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
   * Checks if a given input is a RBNode.
   * @param {[*]} maybe [entity to check for RBNode-ness]
   * @return {[Boolean]} [true if maybe is a RBNode, false otherwise]
   */
  static isRBNode(maybe) {
    return !!maybe && maybe.constructor === RBNode;
  }

  /**
   * Clone the input RBNode.
   * @param {[RBNode]} node [node to clone]
   * @return {[RBNode]} [new RBNode clone of input node]
   */
  static cloneNode(node) {
    return new RBNode(node.key, node.value, node.left, node.right, node.id, node.color);
  }

  /**
   * Returns the count of nodes present in _root input.
   * @param {[RBNode]} _root [the root to recount]
   * @return {[Number]} [count of nodes in _root]
   */
  static recount(_root) {
    let count = 0;
    RBTree.traverseInOrder(_root, () => count++);
    return count;
  }

  /**
   * Apply the callback to each node, in-order.
   * Recursive traversal, static version of #forEach
   * @param {[RBNode]} node [the root node from which to start traversal]
   * @param {[Function]} callback [recieves a RBNode as input]
   * @return {[undefined]} [side-effect function]
   */
  static traverseInOrder(node, cb) {
    if (node === RBTree.nullPointer) return;
    let left = node.left, right = node.right;
    if (left !== RBTree.nullPointer) RBTree.traverseInOrder(left, cb);
    cb(node);
    if (right !== RBTree.nullPointer) RBTree.traverseInOrder(right, cb);
  }

  /**
   * Returns the leaf RBNode furthest down a given side of tree in O(log n).
   * @return {[RBNode|null]} [max or min node, null if tree is empty]
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
   * Returns new root node with input node removed.
   * Input node must have no children.
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node constructed from tree with input node removed]
   */
  static removeNoChildren(node, ancestors) {
    if (ancestors.length) {
      let [childSide, parentNode] = ancestors.pop();
      node = new RBNode(parentNode._store.set(childSide, null));
    }
    return RBTree.constructFromLeaf(node, ancestors)
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have exactly one child.
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node with input node removed and children repositioned]
   */
  static removeOneChild(node, ancestors) {
    let childNode = node.children[0][1];
    if (!ancestors.length) {
      return childNode;
    } else {
      let [childSide, parentNode] = ancestors.pop(),
          leaf = new RBNode(parentNode._store.set(childSide, childNode));
      return RBTree.constructFromLeaf(leaf, ancestors);
    }
  }

  /**
   * Returns new root node with input node removed.
   * Input node must have exactly two children.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node with input node removed and children repositioned]
   */
  static removeTwoChildren(comparator, node, ancestors) {
    let [rightAncestors, iop] = RBTree.findInOrderPredecessor(node.left);
    let iopReplacementStore = iop.store.withMutations(_store => {
      _store.set('_key', node.key).set('_value', node.value).set('_id', node.id);
    });
    let targetReplacementStore = node.store.withMutations(_store => {
      _store.set('_key', iop.key)
            .set('_value', iop.value)
            .set('_id', iop.id)
            .set('_left', new RBNode(iopReplacementStore));
    });
    let newIopNode = new RBNode(targetReplacementStore);
    ancestors = ancestors.concat([['_left', newIopNode]], rightAncestors);
    return RBTree.removeFound(comparator, newIopNode.left, ancestors);
  }

  /**
   * Returns new root node with input node removed.
   * Input node can have any number of children. Dispatches to correct removal method.
   * @param {[Function]} comparator [must return {1, 0, -1} when comparing two inputs]
   * @param {[RBNode]} node [node from which to start the removal]
   * @param {[Array]} ancestorStack [stack of tuples containing ancestor side and ancestor node]
   * @return {[RBNode]} [new root node with input node removed and children repositioned]
   */
  static removeFound(comparator, node, ancestors) {
    //handleDoubleBlack, handleLeaf, and fixUpStack, mutate variables node and ancestors, 
    //which are a proxy for node & ancestor


    let handleDoubleBlack = (finalNode, finalAncestors, doubleBlackIndex) => {
      if (doubleBlackIndex <= -1){
        return;
      }
      let parentIndex = doubleBlackIndex-1;
      let parent =      finalAncestors[parentIndex][1];
      let doubleBlackSide  = finalAncestors[parentIndex][0].slice(1);
      //formatted to be only string, without leading underscore
      let siblingSide = doubleBlackSide === 'left' ? 'right' : 'left';
      let sibling = parent[siblingSide];
      let ancestorState = {
        ancestors: finalAncestors,
        tailNode: finalNode,
        doubleBlackIndex: doubleBlackIndex,
        parentIndex: parentIndex,
        parent: parent,
        doubleBlackSide: doubleBlackSide,
        siblingSide: siblingSide,
        sibling: sibling,
      };
      if (          sibling.color === RBNode.__BLACK &&
                      (   sibling.right.color === RBNode.__RED 
                        ||sibling.left.color === RBNode.__RED)){
        let nephewSide = (sibling.right && sibling.right.color === RBNode.__RED) ? "right" : "left";
        handleCase1(ancestorState, nephewSide);
      } else if (   sibling.color === RBNode.__BLACK 
                &&  sibling.left.color === RBNode.__BLACK 
                &&  sibling.right.color === RBNode.__BLACK){
        debugger;
        handleCase2();
      } else if (sibling.color === RBNode.__RED){
        debugger;
        handleCase3();
      } else {
        throw new Error("sibling not Black, or Red in DB Case");
      }

    }
    
    let handleCase1 = (ancestorState, nephewSide) => {
      let handleBaseCase = (ancestorState) => {
        let {parentIndex, parent, doubleBlackSide, siblingSide, sibling } = ancestorState;
        //nodeReplacement will be the new node, replacing the double black node
        let nodeReplacement = new RBNode(parent._store.withMutations((parentMap) => {
          parentMap.set(`_${siblingSide}`, sibling[doubleBlackSide]);
          parentMap.set('_color', RBNode.__BLACK);//from push
          parentMap.set(`_${doubleBlackSide}`, RBTree.nullPointer);
          return parentMap;
        }));

        //end of stack will be the newly rotated sibling, pointing at nodeReplacement
        let newParent = new RBNode(sibling._store.withMutations( (siblingMap) => {
          //blackness already pushed
          siblingMap.set(`_${doubleBlackSide}`, nodeReplacement);
          let siblingSideSibling = siblingMap.get(`_${siblingSide}`);

          //push blackness to nephew
          siblingMap.set(`_${siblingSide}`, new RBNode(siblingSideSibling._store.set('_color', RBNode.__BLACK)));
          //parent loses blackness from pushing it down to children
          if (siblingMap.get('_color') === RBNode.__BLACK) {
            siblingMap.set('_color', RBNode.__RED);
          }
          return siblingMap;
        }));
        ancestors[parentIndex][1] = newParent
        node = nodeReplacement; //doubleBlack is no longer in ancestorState

      }

      let handleSubCase = (ancestorState) => {
        //additional properties: ancestors, tailNode, doubleBlackIndex
        let { parentIndex, parent, doubleBlackSide, siblingSide, sibling } = ancestorState;
        let oldNephew = sibling._store.get(`_${doubleBlackSide}`);

        //new nephew, from sibling
        let newNephew = new RBNode(sibling._store.withMutations( (siblingMap) => {
          siblingMap.set('_color', RBNode.__RED);
          siblingMap.set(`_${doubleBlackSide}`, oldNephew[siblingSide]);
          return siblingMap;
        }));
        //new sibling, from nephew...rotating doubleBlackSide direction
        let newSibling = new RBNode(oldNephew._store.withMutations( (oldNephewMap) => {
          oldNephewMap.set('_color', RBNode.__BLACK);
          oldNephewMap.set(`_${siblingSide}`, newNephew);
          return oldNephewMap;
        }));

        //assign to end of ancestorStack: newparent
        let newParent = new RBNode(parent._store.withMutations( (parentMap) => {
          parentMap.set(`_${siblingSide}`, newSibling);
          return parentMap;
        }));
        //no change to node
        sibling = newSibling;
        parent = newParent;
        ancestors[parentIndex][1] = newParent;
        ancestorState.ancestors[parentIndex][1] = newParent;
      }

      //Warn: This mod was dues to possible scope conflicts 
      //modifying ancestorState.ancestors -> ancestos
      let {  doubleBlackSide } = ancestorState;

      //handleBaseCase (single rotation)
      //otherwise, handle subCase and return to while loop, for DBNode
      if (doubleBlackSide === nephewSide) {
        handleSubCase(ancestorState);
      } else {
        handleBaseCase(ancestorState);
      }
    }

    let handleCase2 = (indexOfDB, parentIndex, parent, doubleBlackSide, siblingSide, sibling) => {
      throw new Error("Case2");
      ancestors[parentIndex][1] = new RBNode(parent._store.withMutations((parentMap) => {
        parentMap.set(`_${siblingSide}`, new RBNode(
          parentMap.get(`_${siblingSide}`)._store.set('_color', RBNode.__RED)
          ));
        parentMap.set(`_${doubleBlackSide}`, RBNode.increaseBlackness(parentMap.get(`_${doubleBlackSide}`)));
        // -recolor the sibling
        // Node is Now single-black
        // -increase the blackness of the parent
        //   -recurse back if a new double black is created
        parentMap.set('_color', (parentMap.get('_color') === RBNode.__RED ? RBNode.__BLACK : RBNode.__DBLACK))
      }));
      if (ancestors[parentIndex][1].color === RBNode.__DBLACK) {
        //DB pushed up, recurse
        handleDoubleBlack(node, ancestors, doubleBlackIndex-1);
      }

    }
    let handleCase3 = (indexOfDB, parentIndex, parent, doubleBlackSide, siblingSide, sibling) => {
      throw new Error("Case3");

      // adjust with a rotation and one of the previous cases applies....
      //   -if right red sibling: rotate left
      //   if left subling: rotate right
      //     -recurse up, limits propagation since parent is now red

    }

    let handleLeaf = (leafNode) => {
      if (leafNode.color === RBNode.__RED) {
        node = RBTree.nullPointer;
      } else if (leafNode.color === RBNode.__BLACK) {
        node = RBTree.nullPointerDB;
      } else {
        throw new Error("Node color is not red or Black, in deletion case.");
      }
    }

    let replaceByColor = (nodeToReplace) => {
      return (nodeToReplace.color === RBNode.__RED) ? RBTree.nullPointer : RBTree.nullPointerDB;
    }

    let raiseBlackness = (nodeToReplace) => {
      return new RBNode(nodeToReplace._store.withMutations((nodeMap) => {
        nodeMap.set('_color', (nodeMap.get('_color') === RBNode.__RED) ? RBNode.__BLACK : RBNode.__DBLACK);
        return nodeMap;
      }));
    }

    let stackHasDoubleBlack = (node, ancestors) => {
      let maybe = false;
      let index = -1;
      let onSide = undefined;
      if (node.left && node.left.color === RBNode.__DBLACK){
        maybe = true;
        index = ancestors.length+1
        onSide = 'left';
      } else if (node.right && node.right.color === RBNode.__DBLACK){
        maybe = true;
        index = ancestors.length+1
        onSide = 'right';
      } else if (node.color === RBNode.__DBLACK) {
        maybe = true;
        index = ancestors.length;
        onSide = ancestors[ancestors.length-1][0];
      } else {
        for (let i = ancestors.length-1; i > -1; i--){
          if (ancestors[i][1].color === RBNode.__DBLACK) {
            maybe = true;
            index = i;
            break;
          }
        } 
      }
      return {
        maybe : maybe,
        index : index,
        onSide  : onSide
      }

    }
    //See: PseudoCode:  06-11-Delete-PseudoCode.md in scratchDB
    if (node.isLeaf) {
      handleLeaf(node);
    } else if (node.left !== RBTree.nullPointer && node.right !== RBTree.nullPointer){
      //2 children case, find largest value of left subtree;
      let [iOP_Ancestors, iOP] = RBTree.findInOrderPredecessor(node.left);
      if (iOP_Ancestors.length > 0){
        //create the larger ancestorStack, deleting iOP after values are copied
        ancestors.push(['_left', new RBNode(node._store.set('_key', iOP.key).set('_value', iOP.value))]);
        ancestors = ancestors.concat(iOP_Ancestors);
        node = replaceByColor(iOP);
      } else {
        if (node.left !== iOP){
          throw new Error('iOP should be left sibling!!!');
        }
        //iOP is left sibling, copy values and delete
        let leftSubTree = (iOP.color === RBNode.__BLACK) ? raiseBlackness(iOP.left): iOP.left; 
        let newNodeStore = node._store.withMutations( (nodeMap) => {
          nodeMap.set('_left', leftSubTree); // can be doubleBlack;
          nodeMap.set('_key', iOP.key);
          nodeMap.set('_value', iOP.value);
          return nodeMap;
        });
        node = new RBNode(newNodeStore);
      }
    } else if (node.right !== RBTree.nullPointer){
      //no left child: DO NOT COPY, simply assign node to the subtree and raise blackness of children
      let rightSubtree = node.right;
      if (node.color === RBNode.__BLACK) {
        rightSubtree = raiseBlackness(rightSubtree);
      }
      node = rightSubtree;
    } else if (node.left !== RBTree.nullPointer){
      //no right child : DO NOT COPY, simply assign node to subtree (child), and raise its blackness
      //node will not be copied, rather the ancestorStack will attach to the subtree.
      let leftSubtree = node.left;
      if (node.color === RBNode.__BLACK) {
        leftSubtree = raiseBlackness(leftSubtree);
      }      
      node = leftSubtree;
    } else {
      throw new Error("Case: Not a leaf, but no left or right subtree.(!?)");
    }

    //Traverse the ancestorstack, checking if doubleBlack exists:
    let doubleBlackExistence = stackHasDoubleBlack(node, ancestors);
    while (doubleBlackExistence.maybe) {
      handleDoubleBlack(node, ancestors, (node.color === RBNode.__DBLACK) ? ancestors.length : -1);
      doubleBlackExistence = stackHasDoubleBlack(node, ancestors);
      //should now be false.
    }

    //modify the stack so constructFromLeaf can take it: 
    //This function looks scary but performs only local modification
    let fixUpStack = () => {
      if (node === RBTree.nullPointer) {
        let poppedNode = ancestors.pop();
        newNodeStore = poppedNode[1]._store.withMutations( (poppedMap) => {
          if (poppedMap.get('_key') === 50) {debugger;}
          poppedMap.set(poppedNode[0], RBTree.nullPointer);
          return poppedMap;
        });
        node = new RBNode(newNodeStore);
      } else if (node === RBNode.nullPointerDB) {
        throw new Error("Shouldn't have a doubleBlack in existence when fixupStack is called.");
      }
    }
    fixUpStack();
    return RBTree.constructFromLeaf(node, ancestors);
  }

  /**
   * Returns the ancestor nodes and in-order predecessor of the input node.
   * @param {[RBNode]} leftChild [node from which to start the search for IOP]
   * @return {[Array]} [tuple containing a stack of ancestors and the IOP]
   */
  static findInOrderPredecessor(leftChild) {
    let currentIop = leftChild,
        ancestors = [];
    while (
      currentIop.right && 
      currentIop.right !== RBTree.nullPointer &&
      currentIop.right !== RBTree.nullPointerDB
      ) {
      ancestors.push(['_right', currentIop]);
      currentIop = currentIop.right;
    }
    return [ancestors, currentIop];
  }

  /**
   *
   * New Functionality
   * 
   */
  static get nullPointer() {
    return _NULL_SENTINEL;
  }

  static get nullPointerDB() {
    return _NULL_SENTINEL_DB;
  }
}