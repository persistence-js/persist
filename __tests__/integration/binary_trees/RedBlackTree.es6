jest.autoMockOff();
const IM = require('immutable');
const RBTree = require('../../../src/binary_trees/BSTree');
const RBNode = require('../../../src/binary_trees/BSTNode');

describe('Red-Black Tests', function() {
  
  describe('Node Tests', function() {
    let node1 = new RBNode(1, 'hi');

    it('has a color property', function() {
      expect(node1.color).toBeTruthy();
    });

    it('can be repainted R or B', function() {
      expect(node1.repaint(1)).toEqual('Black');
    });

    it('stores the correct value', function() {
      expect(node1.value).toEqual('hi');
    });

    //if implementing a rotation method for nodes, chain insert here

    xit('has rotate left around a node', function() {
      expect(node1.rotateLeft).toHaveBeenCalled();
    });

    xit('has rotate right around a node', function() {
      expect(node2.rotateRight).toHaveBeenCalled();
    });
  });

  describe('Tree Tests', function() {

    //insert a demo'd, pre-visualized  small tree
    //
    //Insertion pseudocode:
    //10, 
    //
    //8, (Red, Left child )
    //
    //9, (searches down to Right of 8, 
    //---Single Rotate Left about 9.
    //  "Node and parent both red. Node is right, parent is left."
    //  Rotation Left.
    //---Single Rotate Right about 9.
    //  "Node and parent both red, node is left, parent is left."
    //  --Therefore, fix with single rotation.
    //  9 is now root node with (8, 10)
    //  --Repaint??? 
    //    Questions:
    //      (do all right rotations require a repaint?)
    //      -Do all left rotations not require a repaint?
    //      ---"RB Tree": --- Rotation Rules; Repainting rules
    //16, 
    //  right right insert...
    //  "Node and parent are both red...Uncle of node is red."
    //  ---Push Blackness down from Grandparent
    //  http://i.imgur.com/6suUc0V.png
    //19, 
    //
    //14, 
    //
    //22
    //
    //4
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
      //
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
