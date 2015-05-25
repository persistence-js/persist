jest.autoMockOff();
debugger;
const IM = require('immutable');
// const RBTree = require('../../../src/binary_trees/RBTree');
const {RBTree: RBTree} = require('../../../src/binary_trees/RBTree');
const {RBNode: RBNode, B: Black, R: Red} = require('../../../src/binary_trees/RBNode');

describe('Red-Black Tests', function() {

  describe('Class Properties and methods', function() {
    describe('_nil', function() {

       it('is a static property', function() {
        debugger;
         expect(RBTree.getNull()).toBeTruthy;
         expect(RBTree.getNull()).toEqual(RBTree.getNull());
       });

       it('is a black Node', function() {
        debugger;
         expect(RBTree.getNull().color).toEqual(RBNode.B);
       });
       it('has null pointers for value, id, left, and right', function() {
         expect(RBTree.getNull().value).toBeNull();
         expect(RBTree.getNull().id).toBeNull();
         expect(RBTree.getNull().left).toBeNull();
         expect(RBTree.getNull().right).toBeNull();
       });
     }); 
  });
  
  describe('Node Tests', function() {
    let node1 = new RBNode(1, 'hi');

    it('has a color property, default red', function() {
      expect(node1.color).toBeTruthy();
    });

    it('can be repainted R or B', function() {
      expect(node1.repaint(1)).toEqual('Black');
    });

    it('stores the correct value', function() {
      expect(node1.value).toEqual('hi');
    });

  });

  describe('Tree Tests', function() {
    //Creates 3 default Red nodes to test rotation
    let _beta = new RBNode(-5, "beta", nil, nil, 4);
    let _gamma = new RBNode(15, "gamma", nil, nil, 5)
    let _right = new RBNode(10, "right", _beta, _gamma, 3);
    let _left = new RBNode(-10, "left", nil, nil, 2);
    let _root = new RBNode(0, "root", _left, _right, 1);
    let gammaStack = IM.Seq([_root, _right, _gamma]);
    let betaStack = IM.Seq([_root, _right, _beta]);

    describe('stackSearch', function() {
      
      it('returns the element if key found', function() {
        expect(RBTree.stackSearch(_root, 15).found).toBe(_gamma);
      });

      it('returns an ancestor stack + insertion direction if key not found ', function() {
        let result = RBTree.stackSearch(_root, 16);
        expect(result.found).toBeFalsy();
        expect(result.ancestorStack).toBe(jasmine.any(IM.Seq));
      });

      describe('the ancestor stack', function() {
        let aStack = RBTree.stackSearch(_root, 16).ancestorStack;

        it('has the correct nodes', function() {
          aStack.forEach((element, index) => {
            expect(element.n).toBe(gammaStack.at(index));
          })
        });

        it('has the correct order of directions', function() {
          let directions = IM.Seq([null, 1, 1]);
          aStack.forEach((element, index) => {
            expect(element.d).toBe(directions.at(index));
          })
          
        });

        it('has the correct colors (default red before in a tree)', function() {
          let colors = IM.Seq([0, 0, 0]);
          aStack.forEach((element, index) => {
            expect(element.c).toBe(colors.at(index));
          })
          
        });
      });
    });

    describe('Repainting Tests', function() {
      
    });

    describe('Rotation Tests', function() {

      it('has rotation methods: rotate, rotateRight, and RotateLeft', function() {
        expect(typeof RBTree.rotate).toBe('function');
        expect(typeof RBTree.rotateRight).toBe('function');
        expect(typeof RBTree.rotateLeft).toBe('function');
      });

      it('can be called by RotateRight', function() {
        //will it need to rotate by index?

      });

      it('can be called by RotateLeft', function() {
        
      });
      
    });

    describe('Tree Reconstruction', function() {
      
    });

    describe('Insertion Tests', function() {
      let RB_Tree = new RBTree();
      let seq = [ 
        [100, "1st"],
        [80, "2nd"],
        [90, "3rd"],
        [160, "4th"],
        [190, "5th"],
        [140, "6th"],
        [95, "7th"],
        [40, "8th"],
      ];

      let sequentialInsert = () => {
        let counter = 0;
        return function(){
          return seq[counter++];
        };   
      };

      let addOne = sequentialInsert();

      let addFromSeq = () => {
        let node = addOne();
        RB_Tree = RB_Tree.insert(node[0], node[1]);
        return RB_Tree;
      }

      it('inserts into empty', function() {
        addFromSeq(); //100
        expect(RB_Tree.root.value).toBe("1st");
        expect(RB_Tree.root.color).toBe(RB_Tree.B);
      });

      it('rotates left when required', function() {
        addFromSeq();//80
        addFromSeq();//90
        expect(RB_Tree.leftRotation).toHaveBeenCalled();
        expect(RB_Tree.rightRotation).toHaveBeenCalled();
        expect(RB_Tree.retrieve(8).value).toEqual('2nd')
      });

      it('rotates and repaints for "Black Uncle, Child-R, Parent-R-Child" Case', function() {
        addFromSeq(); //160
        expect(RB_Tree.repaint).toHaveBeenCalled();
        expect(RB_Tree.retrieve(8).color).toEqual(RB_Tree.B);
        expect(RB_Tree.retrieve(9).color).toEqual(RB_Tree.B);
        expect(RB_Tree.retrieve(10).color).toEqual(RB_Tree.B);
        expect(RB_Tree.retrieve(16).color).toEqual(RB_Tree.R);
      });

      it('repaints for "Red Uncle"', function() {
        addFromSeq(); //190
        addFromSeq(); //140
        expect(RB_Tree.retrieve(19).color).toEqual(RB_Tree.B);
        expect(RB_Tree.retrieve(10).color).toEqual(RB_Tree.B);
        expect(RB_Tree.retrieve(14).color).toEqual(RB_Tree.R);
      });

      it('simple inserts onto left subtree', function() {
        addFromSeq(); //95
        addFromSeq(); //40
        expect(RB_Tree.size).toBe(8);
        expect(RB_Tree.retrieve(80).color).toEqual(RB_Tree.B);
        expect(RB_Tree.retrieve(40).color).toEqual(RB_Tree.R);
        expect(RB_Tree.retrieve(19).value).toEqual("8th");
      });

    });

    describe('Exhaustive "Double Red+Black Uncle" Tests', function() {
      //define whiteboarded Tree
      //4 cases: R-R, L-R
      //R-L, L-L
      let setDoubleRed = new RBTree();
      setDoubleRed = 
        setDoubleRed
        .insert(100, 'a')
        .insert(80, 'b')
        .insert(90, 'c');

      it('is a right child, with right parent', function() {
        let after = setDoubleRed.insert(105,'d').insert(110,'e');
        //rotation (left on 105)+repaint
        expect(after.retrieve(100).color).toBe(RB_Tree.R);
        expect(after.retrieve(105).left).toBe(after.retrieve(100));
        expect(after.retrieve(105).right).toBe(after.retrieve(110));
      });

      it('is a left child, with right parent', function() {
        //rotation (left on 105)+repaint
        let after = setDoubleRed.insert(105,'d').insert(101,'e');
        expect(after.retrieve(101).left).toBe(after.retrieve(100));
        expect(after.retrieve(101).right).toBe(after.retrieve(105));
        expect(after.retrieve(101).color).toBe(RB_Tree.B);
      });

      it('is a right child, with left parent', function() {
        //2 rotations, left on 99, right on 99 to bring it between 95-100
        //after first rotation, same case as below
        //repaint at end.
        let after = setDoubleRed.insert(95,'d').insert(99,'e');
        expect(after.retrieve(96).left).toBe(after.retrieve(95));
        expect(after.retrieve(96).right).toBe(after.retrieve(100));

      });

      it('is a left child, with left parent', function() {
        //single rotation, on 95...repaint
        let after = setDoubleRed.insert(95,'d').insert(94,'e');
        expect(after.retrieve(95).left).toBe(after.retrieve(94));
        expect(after.retrieve(95).right).toBe(after.retrieve(100));
      });      

      //http://i.imgur.com/jQFygDU.png
      //after inserting 91...push blackness, then rotate right on 100
      //rotate left on 100, paint 90 red, 100 black...
    });

    describe('Deletion Tests', function() {
      //create a stack when searching
      //perform the rotations, on the stack's elements
      //then repaint...
      //then construct the new tree with the root node of that stack....
      //pass comparator...
      //
      //If deleted node is red, delete, label child black.
      //else:
      //Label the child of a deleted node, taking its place:
      //double black.
      //https://www.cs.purdue.edu/homes/ayg/CS251/slides/chap13c.pdf
      it('deletes a red node with copying, no rotations', function() {
        
      });

      it('deletes a black node, by pointing its parent at child', function() {
        
      });
    });

  });
});
