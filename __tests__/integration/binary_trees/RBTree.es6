// jest.dontMock('../../../src/binary_trees/RBTree');
// jest.dontMock('../../../src/binary_trees/RBNode');
jest.autoMockOff();
const IM = require('immutable');
// ES6 Syntax works, but get automatically mocked due to 
// import {RBTree} from '../../../src/binary_trees/RBTree';
// import {RBNode} from '../../../src/binary_trees/RBNode';
const RBNode = require('../../../src/binary_trees/RBNode');
const RBTree = require('../../../src/binary_trees/RBTree');

describe('Red-Black Tests', function() {

  describe('Node Tests', function() {
    let node1 = new RBNode(1, 'hi', null, null, 0);
    it('has a color property, default red', function() {
      expect(node1.color).toEqual(RBNode.__RED);
    });

    it('stores the correct value', function() {
      expect(node1.value).toEqual('hi');
    });

  });
    //2nd Pass Node Test Ideas: 
    //-Passed off-type values to constructor.

  describe('Class Properties and methods', function() {
    describe('_nil', function() {

       it('is a static property', function() {
         expect(RBTree.nullPointer).toBeTruthy;
         expect(RBTree.nullPointer).toEqual(RBTree.nullPointer);
       });

       it('is an RBNode', function() {
         expect(RBTree.isRBNode(RBTree.nullPointer)).toBeTruthy();
       });

       it('is a black Node', function() {
         expect(RBTree.nullPointer.color).toEqual(RBNode.__BLACK);
       });

       it('has null pointers for value, id, left, and right', function() {
         expect(RBTree.nullPointer.value).toBeNull();
         expect(RBTree.nullPointer.id).toBeNull();
         expect(RBTree.nullPointer.left).toBeNull();
         expect(RBTree.nullPointer.right).toBeNull();
       });
     }); 
  });
  

  describe('Tree Tests', function() { 
    //Creates 3 default Red nodes to test rotation
    let nil = RBTree.nullPointer;
    let _beta = new RBNode(-5, "beta", nil, nil, 4);
    let _gamma = new RBNode(15, "gamma", nil, nil, 5)
    let _right = new RBNode(10, "right", _beta, _gamma, 3);
    let _left = new RBNode(-10, "left", nil, nil, 2);
    let _root = new RBNode(0, "root", _left, _right, 1);
    let gammaStack = IM.Seq([_root, _right, _gamma]);
    let betaStack = IM.Seq([_root, _right, _beta]);

    describe('Basic Insertion: Simple Rotation Tests', function() {
      //define whiteboarded Tree
      //4 cases: R-R, L-R
      //R-L, L-L
      let setDoubleRed = new RBTree();
      setDoubleRed = 
        setDoubleRed
        .insert(100, 'a')
        .insert(80, 'b')
        .insert(90, 'c');

      it('has a root black node, and two red child nodes', function() {
        expect(setDoubleRed._root.color).toBe(RBNode.__BLACK);
        expect(setDoubleRed._root.value).toBe('c');
        expect(setDoubleRed.find(100).color).toBe(RBNode.__RED);
        expect(setDoubleRed.find(80).color).toBe(RBNode.__RED);
      });

      it('is a right child, with right parent', function() {
        let after = setDoubleRed.insert(105,'d').insert(110,'e');
        //rotation (left on 105)+repaint
        expect(after.find(100).color).toBe(RBNode.__RED);
        expect(after.find(105).left).toBe(after.find(100));
        expect(after.find(105).right).toBe(after.find(110));
      });

      it('is a left child, with right parent', function() {
        //rotation (left on 105)+repaint
        let after = setDoubleRed.insert(105,'d').insert(101,'e');
        expect(after.find(101).left).toBe(after.find(100));
        expect(after.find(101).right).toBe(after.find(105));
        expect(after.find(101).color).toBe(RBNode.__BLACK);
      });

      it('is a right child, with left parent', function() {
        //2 rotations, left on 99, right on 99 to bring it between 95-100
        //after first rotation, same case as below
        //repaint at end.
        let after = setDoubleRed.insert(95,'d').insert(96,'e');
        expect(after.find(96).left).toBe(after.find(95));
        expect(after.find(96).right).toBe(after.find(100));

      });

      it('is a left child, with left parent', function() {
        //single rotation, on 95...repaint
        let after = setDoubleRed.insert(95,'d').insert(94,'e');
        expect(after.find(95).left).toBe(after.find(94));
        expect(after.find(95).right).toBe(after.find(100));
      });  
      //http://i.imgur.com/jQFygDU.png
      //after inserting 91...push blackness, then rotate right on 100
      //rotate left on 100, paint 90 red, 100 black...
    });

    describe('Insertion & Removal Tests', function() {
      let persistentTree = new RBTree();
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
        persistentTree = persistentTree.insert(node[0], node[1]);
        return persistentTree;
      }
      describe('8-element Insertion Tests', function() {
        it('inserts into empty', function() {
          addFromSeq(); //100
          expect(persistentTree.root.value).toBe("1st");
          expect(persistentTree.root.color).toBe(RBNode.__BLACK);
        });

        it('rotates left when required', function() {
          addFromSeq();//80
          addFromSeq();//90
          expect(persistentTree.find(80).value).toEqual('2nd')
        });

        it('rotates and repaints for "Black Uncle, Child-R, Parent-R-Child" Case', function() {
          addFromSeq(); //160
          expect(persistentTree.find(80).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(90).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(100).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(160).color).toEqual(RBNode.__RED);
        });

        it('repaints for "Red Uncle"', function() {
          addFromSeq(); //190
          addFromSeq(); //140
          expect(persistentTree.find(190).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(100).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(140).color).toEqual(RBNode.__RED);
        });

        it('simple inserts onto left subtree', function() {
          addFromSeq(); //95
          addFromSeq(); //40
          expect(persistentTree.size).toBe(8);
          expect(persistentTree.find(80).color).toEqual(RBNode.__BLACK);
          expect(persistentTree.find(40).color).toEqual(RBNode.__RED);
          expect(persistentTree.find(190).value).toEqual("5th");

        });
        it('passes final state tests', function() {
          expect(persistentTree._root.right.right.key).toEqual(190);
          expect(persistentTree._root.right.right.color).toEqual(RBNode.__BLACK);
          expect(persistentTree._root.left.left.key).toEqual(40);
          expect(persistentTree._root.right.left.left.key).toEqual(95);          
          expect(persistentTree._root.right.left.right.key).toEqual(140);          
        });
      });


      describe('Removal Tests', function() {
        it('deletes a red leaf with no further changes', function() {
          leafDelete = persistentTree.remove(40);
          expect(leafDelete._root.left.left).toEqual(RBTree.nullPointer);
          let rightSide = leafDelete._root.right;
          expect(rightSide.key).toEqual(160);
          expect(rightSide.color).toEqual(RBNode.__RED);
          expect(rightSide.left.right.key).toBe(140);
          expect(rightSide.right.key).toBe(190);
        });

        it('deletes a red non-leaf, with no further changes, replacing with predecessor', function() {
          redNonLeaf = persistentTree.remove(160);
          let rootN = redNonLeaf._root;
          let rSide = rootN.right;
          expect(redNonLeaf.size).toEqual(7);
          expect(rootN.color).toEqual(RBNode.__BLACK);
          expect(rootN.key).toEqual(90);
          expect(rSide.color).toEqual(RBNode.__RED);
          expect(rSide.key).toEqual(140);
          expect(rSide.left.left.key).toEqual(95);
          expect(rSide.right.key).toEqual(190);
          expect(rSide.left.left.left).toEqual(rSide.left.left.right);
          expect(rSide.left.right.key).not.toEqual(140);
        });

        it('deletes a black node with red child, makes red child black', function() {
          let tempTree = persistentTree.remove(160);
          let blackNonLeaf = tempTree.remove(100);

          let rootN = blackNonLeaf._root;
          let rSide = rootN.right;
          expect(blackNonLeaf.size).toEqual(6);
          expect(rootN.color).toEqual(RBNode.__BLACK);
          expect(rootN.key).toEqual(90);
          expect(rSide.color).toEqual(RBNode.__RED);
          expect(rSide.key).toEqual(140);
          expect(rSide.left.key).toEqual(95);
          expect(rSide.left.color).toEqual(RBNode.__BLACK);
          expect(rSide.right.key).toEqual(190);
          expect(rSide.left.left).toEqual(rSide.left.right);//both pointing at sentinel
          expect(rSide.left.isLeaf).toBeTruthy();
        });

        it('Deletes root in an 8-element Tree', function() {
          expect(persistentTree.size).toEqual(8);
          rootDeleted = persistentTree.remove(90)._root;
          expect(rootDeleted.color).toEqual(RBNode.__BLACK);
          expect(rootDeleted.key).toEqual(80);
          expect(rootDeleted.right.color).toEqual(RBNode.__RED);
          expect(rootDeleted.right.key).toEqual(160);
          expect(rootDeleted.left.color).toEqual(RBNode.__BLACK);
          expect(rootDeleted.left.key).toEqual(40);
          expect(rootDeleted.left.left).toBe(RBTree.nullPointer);
          expect(rootDeleted.left.right).toBe(RBTree.nullPointer);
        });
      });
    });
      describe('Double Black Cases', function() {
        //Double Black Cases Should Not Depend on State from Previous Tests:
        //
        //insert 100-1000
        let DBCases = new RBTree();
        let key = 0;
        for (let i = 0; i < 10; i++){
          key += 100;
          DBCases = DBCases.insert(key, 'testValue');
        }//then:
        //balance out
        DBCases = DBCases.insert(50, 'testValue').insert(125, 'testValue');

        xit('Begins Test Cases correctly, inserting 100-1000', () => {
          expect(DBCases.find(1000).value).toEqual('testValue');
          expect(DBCases.size).toEqual(12);
          expect(DBCases._root.key).toEqual(400);
          expect(DBCases._root.left.right.key).toEqual(300);
          expect(DBCases._root.left.right.color).toEqual(RBNode.__BLACK);
          expect(DBCases._root.right.left.key).toEqual(500);
          expect(DBCases._root.right.left.color).toEqual(RBNode.__BLACK);
          // IMAGE OF INITIAL STATE OF DBCases
          // http://i.imgur.com/OLzMtUU.png
        });

        xdescribe('Case 1: Sibling Black, one child red:', function() {
          //set up case...add nephews to 190, delete and RE-ADD 100.
          it('Handles a "LEFT double-black, right red nephew" Case (base case).', function() {
            let case1LR = DBCases.remove(700);
            expect(case1LR._root.right.key).toEqual(600);
            expect(case1LR._root.right.right.key).toEqual(900);
            let onlyRed = case1LR.find(900);
            expect(onlyRed.color).toEqual(RBNode.__RED);
            expect(onlyRed.right.color).toEqual(RBNode.__BLACK);
            expect(onlyRed.right.key).toEqual(1000);
            expect(onlyRed.left.color).toEqual(RBNode.__BLACK);
            expect(onlyRed.left.key).toEqual(800);
          });

          it('Handles a "RIGHT double-black, left red nephew" Case. (base case)', function() {
            let case1RL = DBCases
                            .insert(25, 'newValue')
                            .remove(125);
            expect(case1RL._root.left.key).toEqual(200);
            expect(case1RL._root.left.right.key).toEqual(300);
            let leftRed = case1RL.find(50);
            expect(leftRed.color).toEqual(RBNode.__RED);
            expect(leftRed.right.color).toEqual(RBNode.__BLACK);
            expect(leftRed.right.key).toEqual(100);
            expect(leftRed.left.color).toEqual(RBNode.__BLACK);
            expect(leftRed.left.key).toEqual(25);
            expect(leftRed.right.right).toBe(RBTree.nullPointer);
            expect(leftRed.left.right).toBe(RBTree.nullPointer);
          });

          it('Handles a "LEFT double-black, left red nephew" Case. (sub case)', function() {
            let case1LL = DBCases.insert(850, 'newValue').remove(1000) //setup
            case1LL = case1LL.remove(700); // Removal to test
            expect(case1LL._root.left.key).toEqual(200);
            expect(case1LL._root.left.right.key).toEqual(300);
            let onlyRed = case1LL.find(850);
            expect(onlyRed.color).toEqual(RBNode.__RED);
            expect(onlyRed.right.color).toEqual(RBNode.__BLACK);
            expect(onlyRed.right.key).toEqual(900);
            expect(onlyRed.left.color).toEqual(RBNode.__BLACK);
            expect(onlyRed.left.key).toEqual(800);
            expect(onlyRed.right.right).toBe(RBTree.nullPointer);
            expect(onlyRed.left.right).toBe(RBTree.nullPointer);
          });

          it('Handles a "RIGHT double-black, right red nephew" Case. (sub-case)', function() {
            let case1RR = DBCases.insert(75, 'newValue')
                            .remove(125);
            let parentRed = case1RR.find(75);
            expect(parentRed.color).toEqual(RBNode.__RED);
            expect(parentRed.right.color).toEqual(RBNode.__BLACK);
            expect(parentRed.right.key).toEqual(100);
            expect(parentRed.left.color).toEqual(RBNode.__BLACK);
            expect(parentRed.left.key).toEqual(50);
            expect(parentRed.right.right).toBe(RBTree.nullPointer);
            expect(parentRed.left.right).toBe(RBTree.nullPointer);
          });

          it('Handles a subcase (Right DB) with two nephews', function() {
            let caseTC = DBCases.remove(300);
            let parentBlack = caseTC._root.left;
            expect(parentBlack).toEqual(caseTC.find(100));
            expect(parentBlack.color).toEqual(RBNode.__BLACK);
            expect(parentBlack.right.color).toEqual(RBNode.__BLACK);
            expect(parentBlack.right.key).toEqual(200);
            expect(parentBlack.left.color).toEqual(RBNode.__BLACK);
            expect(parentBlack.left.key).toEqual(50);
            expect(parentBlack.right.right).toBe(RBTree.nullPointer);
            expect(parentBlack.left.right).toBe(RBTree.nullPointer);

            expect(parentBlack.right.left).toNotBe(RBTree.nullPointer);
            expect(parentBlack.right.left).not.toBeNull();
            expect(parentBlack.right.left.color).toBe(RBNode.__RED);
          });

          it('Handles a subcase (Left DB) with two nephews', function() {
            let caseSLL = DBCases.insert(850, 'newValue').remove(700);
            let parentRed = caseTC._root.right.right;
            expect(parentRed).toEqual(caseTC.find(900));
            expect(parentRed.color).toEqual(RBNode.__RED);
            expect(parentRed.right.color).toEqual(RBNode.__BLACK);
            expect(parentRed.right.key).toEqual(1000);
            expect(parentRed.left.color).toEqual(RBNode.__BLACK);
            expect(parentRed.left.key).toEqual(800);
            expect(parentRed.right.right).toBe(RBTree.nullPointer);
            expect(parentRed.left.right).toBe(RBTree.nullPointer);

            //examine null pointers
            expect(parentRed.right.left).toBe(RBTree.nullPointer);
            expect(parentRed.right.left).not.toBeNull();
            expect(parentRed.left.left).toBe(RBTree.nullPointer);

          });

        });
        describe('Case 2: Sibling Black, black children', function() {
          it('Left DB : Red Parent', function() {
            let LDB_RP = DBCases.remove(1000);
            LDB_RP = LDB_RP.remove(700);
            let blackKey800 = LDB_RP._root.right.right;
            expect(blackKey800).toEqual(LDB_RP.find(800));
            expect(blackKey800.color).toEqual(RBNode.__BLACK);
            expect(blackKey800.right.color).toEqual(RBNode.__RED);
            expect(blackKey800.right.key).toEqual(900);

            //examine leaves
            expect(blackKey800.right.left).toEqual(RBTree.nullPointer);
            expect(blackKey800.right.right).toEqual(RBTree.nullPointer);
            expect(blackKey800.left).toEqual(RBTree.nullPointer);
          });

          it('Right DB : black parent, causing a rotation (And non-leaf Double-Black)', function() {
            // http://i.imgur.com/DP9u4Me.png

            let LDB_RP = DBCases.remove(50).remove(125);
            let LDB_RP = LDB_RP.remove(300);
            expect(LDB_RP.size).toBe(9);
            let blackRoot = LDB_RP._root;
            expect(blackRoot).toEqual(LDB_RP.find(600));
            expect(blackRoot.left.left).toBe(LDB_RP.find(200));
            expect(blackRoot.left.left.left).toBe(LDB_RP.find(100));
            expect(blackRoot.left.left.left.color).toBe(RBNode.__RED);
            expect(blackRoot.right.right.right).toBe(LDB_RP.find(1000));
            expect(blackRoot.right.right.right.color).toBe(RBNode.__RED);
            expect(blackRoot.right.left).toBe(LDB_RP.find(700));
            expect(blackRoot.right.right).toBe(LDB_RP.find(900));
            expect(blackRoot.left).toBe(LDB_RP.find(400));
          });

          xit('Right DB : recursing up to root', function() {
            //case of a tree with three black nodes: delete one, and make sure the check for parent blackness exists.

            // let threeNodes = new RBTree();
            // let threeNodes = threeNodes.insert(1, '3')
            // let threeNodes = threeNodes.insert(2, '3')
            // let threeNodes = threeNodes.insert(3, '3')
            
          });

        });

        xdescribe('Case 3: Red Sibling', function() {
          it('Handles a LEFT double-black, right red sibling', function() {
            //remove 500
            let Case3LR = DBCases.remove(500);
            let blackKey800 = Case3LR._root.right;
            expect(blackKey800).toEqual(Case3LR.find(800));
            expect(blackKey800.color).toEqual(RBNode.__BLACK);
            expect(blackKey800.right.color).toEqual(RBNode.__BLACK);
            expect(blackKey800.right.key).toEqual(900);
            expect(blackKey800.left.color).toEqual(RBNode.__BLACK);
            expect(blackKey800.left.key).toEqual(600);
            expect(blackKey800.left.right).toBe(Case3LR.find(700));

            //examine null pointers
            expect(blackKey800.right.right).toBe(Case3LR.find(1000));
            expect(blackKey800.left.right).toBe(Case3LR.find(700));
            expect(blackKey800.right.left).toBe(RBTree.nullPointer);
            expect(blackKey800.right.left).not.toBeNull();
            expect(blackKey800.left.left).toBe(RBTree.nullPointer);
          });

          it('Handles a RIGHT double-black, left red sibling', function() {
            let temp = DBCases.insert(25, 'newValue');
            let Case3RL = temp.remove(300);
            let redKey100 = Case3RL._root.left.left;
            expect(redKey100).toEqual(Case3RL.find(100));
            expect(redKey100.color).toEqual(RBNode.__RED);
            expect(redKey100.right.color).toEqual(RBNode.__BLACK);
            expect(redKey100.right.key).toEqual(125);
            expect(redKey100.left.color).toEqual(RBNode.__BLACK);
            expect(redKey100.left.key).toEqual(50);
            expect(redKey100.left.left).toBe(Case3RL.find(25));

            //examine null pointers
            expect(redKey100.right.right).toBe(RBTree.nullPointer);
            expect(redKey100.left.right).toBe(RBTree.nullPointer);
            expect(redKey100.right.left).toBe(RBTree.nullPointer);
            expect(redKey100.right.left).not.toBeNull();
            expect(redKey100.left.left.left).toBe(RBTree.nullPointer);
          });

        });
        
      });

  describe('Batch Insert with traversal', function() {
    let ten = new RBTree();
    let twentyThings = Array(20);
    for (let i = 0 ; i < 20; i++){
      //tested manually up to 9
      twentyThings[i] = [i, "valueForKey :" + i];
    }
    let completed = ten.insertAll(twentyThings);
    let counter = 0;
    RBTree.traverseInOrder(completed._root, (node) => {
      expect(node.key).toEqual(counter++);
    });
  });

  xdescribe('Large Batch Insert, with traversal and Removal', function() {
    //WARN: This test takes 2-5 minutes in Jest + Babel.
    let ten = new RBTree();
    let manyThings = Array(10000);
    for (let i = 0 ; i < 10000; i++){
      //tested manually up to 9
      manyThings[i] = [i, "valueForKey :" + i];
    }
    let completed;

    it('Performs a large batch insert, in-order', function() {
      completed = ten.insertAll(manyThings);
      let counter = 0;
      expect(completed.size).toEqual(10000);

      RBTree.traverseInOrder(completed._root, (node) => {
        expect(node.key).toEqual(counter++);
      });
    });
    it('Should remove from root repeatedly without throwing erros', function() {
      let sizeCount = 1000;
      let removeRoot = () => {
        let expectedKey = completed._root.key;
        completed = completed.remove(expectedKey);
        expect(completed.size).toEqual(--sizeCount);
        if(completed.size > 4){
          expect(completed._root.left).not.toEqual(RBTree.nullPointer);
          expect(completed._root.right).not.toEqual(RBTree.nullPointer);
        }
      }
    });
    //remove Root 10000 times without throwing errors:
    //check size
    //check colors

    //remove X random numbers, checking the in-order traversal 

    //insert only keys, with the same value
    //insert numbers from 0 to 10000
    //
    //
    //
    //delete numbers from 1 to 10000
    //expect no errors throw, expect 0 to be the remaining node, red, size to be 1        
  });
  });
});
