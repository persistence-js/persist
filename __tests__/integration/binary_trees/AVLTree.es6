jest.autoMockOff();
const IM = require('immutable');
const AVLTree = require('../../../src/binary_trees/AVLTree');
const AVLNode = require('../../../src/binary_trees/AVLNode');


describe('AVL Tests', () => {

  describe('Node Tests', () => {
    let node1 = new AVLNode(1, 'hi', null, null);

    it('has a balance property, default 0', () => {
      expect(node1.balance).toBe(0);
    });

    it('stores the correct value', () => {
      expect(node1.value).toEqual('hi');
    });

  });

  describe('Class Properties and methods', () => {

    describe('_nil', () => {

       it('is a static property', () => {
         expect(AVLTree.nullPointer).toBeTruthy;
         expect(AVLTree.nullPointer).toEqual(AVLTree.nullPointer);
       });

       it('is an AVLNode', () => {
         expect(AVLTree.isAVLNode(AVLTree.nullPointer)).toBeTruthy();
       });

       it('is a balanced Node', () => {
         expect(AVLTree.nullPointer.balance).toEqual(0);
       });

       it('has null pointers for key, value, left, and right', () => {
         expect(AVLTree.nullPointer.key).toBeNull();
         expect(AVLTree.nullPointer.value).toBeNull();
         expect(AVLTree.nullPointer.left).toBeNull();
         expect(AVLTree.nullPointer.right).toBeNull();
       });

     });

  });

  describe('Tree Instantiation Tests', () => {
    let avl = new AVLTree(),
        _node = new AVLNode(1, 'a'),
        avlWithNode = new AVLTree(null, _node, 1, 0);

    it('instantiates empty, checks size', () => {
      expect(avl.size).toBe(0);
    });

    it('instantiates with a root node, checks size', () => {
      expect(avlWithNode.size).toBe(1);
    });

    it('instantiates with a default comparator', () => {
      expect(avl.comparator).toBeDefined();
      expect(typeof avl.comparator).toBe('function');
    });

    it('instantiates with a custom comparator', () => {
      let comp = () => 0, compAVL = new AVLTree(comp);
      expect(compAVL.comparator).toBe(comp);
      expect(typeof compAVL.comparator).toBe('function');
    });

  });

  describe('Tree Functionality Tests', () => {
    let _TREE = new AVLTree().insert(50, 'a');

    describe('Base Tree for Rotation Tests', () => {
      expect(_TREE.root.balance).toBe(0);
      expect(_TREE.root.value).toBe('a');
      expect(_TREE.root.key).toBe(50);
      expect(_TREE.size).toBe(1);
      expect(_TREE.rebalanceCount).toBe(0);
    });

    describe('Rotation: After Insertion', () => {

      describe('LL Case Rotations', () => {

        describe('without complex children', () => {
          let testTree = _TREE.insert(100, 'b').insert(150, 'c');

          it('pivots on right child', () => {
            expect(testTree.root.key).toBe(100);
            expect(testTree.root.value).toBe('b');
            expect(testTree.root.left.key).toBe(50);
            expect(testTree.root.right.key).toBe(150);
          });

          it('updates heights after rotation', () => {
            expect(testTree.height).toBe(2);
            expect(testTree.root.height).toBe(2);
            expect(testTree.root.left.height).toBe(1);
            expect(testTree.root.right.height).toBe(1);
          });

          it('rebalances the tree', () => {
            expect(testTree.root.balance).toBe(0);
            expect(testTree.root.left.balance).toBe(0);
            expect(testTree.root.right.balance).toBe(0);
          });

          it('updates the rebalanceCount of returned tree', () => {
            expect(testTree.rebalanceCount).toBe(1);
          });

          it('maintains the correct size of tree', () => {
            expect(testTree.size).toBe(3);
          });

        });

        describe('with complex children', () => {

        });

      });

      describe('LR Case Rotations', () => {

      });

      describe('RR Case Rotations', () => {

        describe('without complex children', () => {
          let testTree = _TREE.insert(25, 'b').insert(0, 'c');

          it('pivots on left child', () => {
            expect(testTree.root.key).toBe(25);
            expect(testTree.root.value).toBe('b');
            expect(testTree.root.left.key).toBe(0);
            expect(testTree.root.right.key).toBe(50);
          });

          it('updates heights after rotation', () => {
            expect(testTree.height).toBe(2);
            expect(testTree.root.height).toBe(2);
            expect(testTree.root.left.height).toBe(1);
            expect(testTree.root.right.height).toBe(1);
          });

          it('rebalances the tree', () => {
            expect(testTree.root.balance).toBe(0);
            expect(testTree.root.left.balance).toBe(0);
            expect(testTree.root.right.balance).toBe(0);
          });

          it('updates the rebalanceCount of returned tree', () => {
            expect(testTree.rebalanceCount).toBe(1);
          });

          it('maintains the correct size of tree', () => {
            expect(testTree.size).toBe(3);
          });

        });

        describe('with complex children', () => {

        });

      });

      describe('RL Case Rotations', () => {

      });

    });

    describe('Rotation: After Removal', () => {

    });

  });

  xdescribe('Tree Built-in Getter Tests', () => {

    describe('get size', () => {

      it('returns current number of nodes in tree', () => {
        let avl1 = new AVLTree(),
            avl2 = avl1.insert(5, 'first value'),
            avl3 = avl2.insert(0, 'second value'),
            avl4 = avl3.insert(10, 'third value');
        expect(avl1.size).toBe(0);
        expect(avl2.size).toBe(1);
        expect(avl3.size).toBe(2);
        expect(avl4.size).toBe(3);
      });

    });

    describe('get comparator', () => {

      it('returns default comparator, duck-check', () => {
        let avlDefault = (new AVLTree()).comparator;
        expect(avlDefault(2, 1)).toBe(1);
        expect(avlDefault(1, 2)).toBe(-1);
        expect(avlDefault(1, 1)).toBe(0);
      });

      it('returns custom comparator, duck-check', () => {
        let avlCustom = (new AVLTree(() => 0)).comparator;
        expect(avlCustom(2, 1)).toBe(0);
        expect(avlCustom(1, 2)).toBe(0);
        expect(avlCustom('a', 'hi')).toBe(0);
      });

    });

    describe('get height', () => {

      describe('empty trees', () => {

        it('returns 0 for empty tree', () => {
          expect((new AVLTree()).height).toBe(0);
        });

      });

      describe('nonempty trees', () => {

        it('returns height of balanced tree', () => {
          let avl = new AVLTree().insert(1, 'a').insert(2, 'b');
          expect(avl.height).toBe(2);
        });

        it('returns height of temporarily unbalanced tree', () => {
          let avl = new AVLTree().insert(1, 'a').insert(2, 'b').insert(3, 'c');
          expect(avl.height).toBe(2);
        });

      });

    });

    describe('get root', () => {

      it('returns null for empty tree', () => {
        expect((new AVLTree()).root).toBeNull();
      });

      it('returns root node for nonempty tree', () => {
        let rootNode = new AVLNode(1, 'a');
        expect((new AVLTree(null, rootNode)).root).toEqual(rootNode);
      });

    });

    describe('get rebalanceCount', () => {

      it('returns 0 for an empty tree', () => {
        expect((new AVLTree).rebalanceCount).toBe(0);
      });

      it('returns greater than 0 for a temporarily unbalanced tree', () => {
        expect((new AVLTree().insert(1, 'a').insert(2, 'b').insert(3, 'c')).rebalanceCount).toBe(1);
      });

    });

    describe('get min', () => {

      it('returns null for empty tree', () => {
        expect((new AVLTree()).min).toBeNull();
      });

      it('returns node with min key for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(0, 'min'),
            min = avl.min;
        expect(min.key).toBe(0);
        expect(min.value).toBe('min');
      });

    });

    describe('get max', () => {

      it('returns null for empty tree', () => {
        expect((new AVLTree()).max).toBeNull();
      });

      it('returns node with max key for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(100, 'max'),
            max = avl.max;
        expect(max.key).toBe(100);
        expect(max.value).toBe('max');
      });

    });

    describe('get keys', () => {

      it('returns empty array for empty tree', () => {
        expect((new AVLTree()).keys).toEqual([]);
      });

      it('returns in-order array of all node keys for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(100, 'max');
        expect(avl.keys).toEqual([25, 50, 75, 100]);
      });

    });

    describe('get values', () => {

      it('returns empty array for empty tree', () => {
        expect((new AVLTree()).values).toEqual([]);
      });

      it('returns in-order array of all node values for nonempty tree', () => {
        let avl = new AVLTree().insert(50, 'a').insert(25, 'c').insert(75, 'b').insert(100, 'max');
        expect(avl.values).toEqual(['c', 'a', 'b', 'max']);
      });

    });

  });

});
