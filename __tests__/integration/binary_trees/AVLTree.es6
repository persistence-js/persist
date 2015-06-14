jest.autoMockOff();
const IM = require('immutable');
const AVLTree = require('../../../src/binary_trees/AVLTree');
const AVLNode = require('../../../src/binary_trees/AVLNode');


xdescribe('AVL Tests', () => {

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

  xdescribe('Tree Functionality Tests', () => {

    describe('Basic Insertion: Simple Rotation Tests', () => {
      let setLeftHeavy = new AVLTree();
      setLeftHeavy = setLeftHeavy.insert(100, 'a')
                                 .insert(80, 'b')
                                 .insert(90, 'c');

      it('has a balanced root node and two balanced child nodes', () => {
        expect(setLeftHeavy._root.balance).toBe(0);
        expect(setLeftHeavy._root.value).toBe('c');
        expect(setLeftHeavy.find(100).balance).toBe(0);
        expect(setLeftHeavy.find(80).balance).toBe(0);
      });

      it('is a right child, with right parent', () => {
        let after = setLeftHeavy.insert(105, 'd').insert(110, 'e');
        expect(after.find(100).balance).toBe(0);
        expect(after.find(105).left).toBe(after.find(100));
        expect(after.find(105).right).toBe(after.find(110));
      });

      it('is a left child, with a right parent', () => {
        let after = setLeftHeavy.insert(105, 'd').insert(101, 'e');
        expect(after.find(101).left).toBe(after.find(100));
        expect(after.find(101).right).toBe(after.find(105));
        expect(after.find(101).balance).toBe(0);
      });

      it('is a right child, with left parent', () => {
        let after = setLeftHeavy.insert(95, 'd').insert(96, 'e');
        expect(after.find(96).left).toBe(after.find(95));
        expect(after.find(96).right).toBe(after.find(100));
        expect(after.find(96).balance).toBe(0);
      });

      it('is a left child, with a left parent', () => {
        let after = setLeftHeavy.insert(95, 'd').insert(94, 'e');
        expect(after.find(95).left).toBe(after.find(94));
        expect(after.find(95).right).toBe(after.find(100));
        expect(after.find(95).balance).toBe(0);
      });

    });

    describe('Insertion & Deletion Tests', () => {
      let persistentTree = new AVLTree();
      let seq = [
        [100, '1st'],
        [80, '2nd'],
        [90, '3rd'],
        [160, '4th'],
        [190, '5th'],
        [140, '6th'],
        [95, '7th'],
        [40, '8th']
      ];

      let sequentialInsert = () => {
        let counter = 0;
        return () => {
          return seq[counter++];
        };
      };

      let addOne = sequentialInsert();

      let addFromSeq = () => {
        let tuple = addOne();
        persistentTree = persistentTree.insert(tuple[0], tuple[1]);
        return persistentTree;
      };

      describe('8-element Insertion Tests', () => {

        it('inserts into empty', () => {
          addFromSeq(); // 100
          expect(persistentTree.root.value).toBe('1st');
          expect(persistentTree.root.balance).toBe(0);
        });

        it('rotates left when required', () => {
          addFromSeq(); // 80
          addFromSeq(); // 90
          expect(persistentTree.find(80).value).toEqual('2nd');
        });

        it('rebalances after right-heavy left rotation', () => {
          addFromSeq(); // 160
          addFromSeq(); // 190
          expect(persistentTree.find(80).balance).toEqual(0);
          expect(persistentTree.find(90).balance).toEqual(1);
          expect(persistentTree.find(100).balance).toEqual(1);
          expect(persistentTree.find(160).balance).toEqual(0);
        });

        it('rebalances after double rotation', () => {
          addFromSeq(); // 140
          expect(persistentTree.find(190).balance).toEqual(0);
          expect(persistentTree.find(100).balance).toEqual(0);
          expect(persistentTree.find(140).balance).toEqual(0);
        });

        it('simple inserts onto left subtree', () => {
          addFromSeq(); // 95
          addFromSeq(); // 40
          expect(persistentTree.size).toBe(8);
          expect(persistentTree.find(80).balance).toEqual(-1);
          expect(persistentTree.find(40).balance).toEqual(0);
          expect(persistentTree.find(190).value).toEqual('5th');
        });

        it('passes final state tests', () => {
          expect(persistentTree._root.right.right.key).toEqual(190);
          expect(persistentTree._root.right.right.balance).toEqual(0);
          expect(persistentTree._root.left.left.left.key).toEqual(40);
          expect(persistentTree._root.right.left.key).toEqual(140);
          expect(persistentTree._root.left.right.key).toEqual(95);
          expect(persistentTree._root.balance).toEqual(-1);
        });

      });

      describe('Deletion Tests', () => {

      });

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
