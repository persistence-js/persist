jest.autoMockOff();
var IM = require('immutable'),
    LinkedList = require('../../../src/lists/LinkedList');

xdescribe('LinkedList', () => {

  describe('new instance initialization', () => {
    let emptyLL = new LinkedList();

    it('head returns itself', () => {
      expect(emptyLL.head).toEqual(emptyLL);
    });

    it('next is null', () => {
      expect(emptyLL.value).toBeNull();
    });

    it('isEmpty', () => {
      expect(emptyLL.size).toBe(0);
      expect(emptyLL.next).toBeNull();      
    });


    it('stores a number on initialization', () => {
      let sLLNumber = new LinkedList(1);
      expect(sLLNumber.size).toBe(1);
      expect(sLLNumber.head.value).toEqual(1);
      expect(sLLNumber.tail.value).toEqual(1);
    });

    it('stores a string on initialization', () => {
      let sLLString = new LinkedList('string value');
      expect(sLLString.size).toBe(1);
      expect(sLLString.head.value).toEqual('string value');
      expect(sLLString.tail.value).toEqual('string value');
    });

    it('stores an object on initialization', () => {
      let sLLObject = new LinkedList({ name: 'clark' });
      expect(sLLObject.size).toBe(1);
      expect(sLLObject.head.value).toEqual({ name: 'clark' });
      expect(sLLObject.tail.value).toEqual({ name: 'clark' });
    });

    it('stores an array on initialization', () => {
      let sLLArray = new LinkedList(['random string', {'asdfasdf':'asdf'}, { name: 'anna' }, 26, ['tail value']]);
      expect(sLLArray.size).toBe(5);
      expect(sLLArray.head.value).toEqual('random string');
      expect(sLLArray.tail.value).toEqual(['tail value']);
    });

  });

//   describe('public interface instance methods', () => {
//     let sLLNumber = new LinkedList(1);
//     let sLLArray = new LinkedList(['random string', {'asdfasdf':'asdf'}, { name: 'anna' }]);

//     it('gets-head', () => {
//       expect(sLLNumber.head).toEqual(1);
//       expect(sLLArray.head).toEqual('random string');
//     });

//     it('gets-tail', () => {
//       expect(sLLNumber.tail).toEqual(1);
//       expect(sLLArray.tail).toEqual({ name: 'anna' });
//     });

//     it('gets-store', () => {
//       expect(sLLNumber.store.length).toEqual(1);
//       expect(sLLNumber.store[0]).toEqual(1);
//     });

//     it('gets-size', () => {
//       expect(sLLNumber.size).toEqual(1);
//       expect(sLLArray.size).toEqual(3);
//     });

//     it('adds-to-tail', () => {
//       let sLLNumber2 = sLLNumber.addToTail(2);
//       expect(sLLNumber.tail).toEqual(1); // shouldn't mutate original list
//       expect(sLLNumber2.head).toEqual(1);
//       expect(sLLNumber2.tail).toEqual(2);
//     });

//     it('removes-head', () => {
//       let sLLNumber2 = sLLNumber.addToTail(2);
//       let sLLNumber3 = sLLNumber.removeHead();
//       let sLLNumber4 = sLLNumber2.removeHead();
//       expect(sLLNumber.head).toEqual(1); // shouldn't mutate original list
//       expect(sLLNumber2.head).toEqual(1); // shouldn't mutate any copied lists
//       expect(sLLNumber3.head).toBeNull();
//       expect(sLLNumber4.head).toEqual(2);
//       expect(sLLNumber4.tail).toEqual(2);
//     });

//     it('contains', () => {
//       let emptyTest = new LinkedList().contains('random'),
//           matchTest = new LinkedList('random').contains('random'),
//           obj = {},
//           deepObj = { key1: 'key1' , testArr: ['first', 'second'] },
//           deepObj2 = { key1: 'key1' , testArr: ['first', 'second', 'third'], 'other key': 3 },
//           arr = [1, 2, 3, 4, 'test', {}],
//           matchTest2 = new LinkedList(obj).contains(obj),
//           matchTest3 = new LinkedList(deepObj).contains(deepObj),
//           matchTest4 = new LinkedList(deepObj).contains(deepObj2),
//           matchTest5 = new LinkedList(arr).contains('test'),
//           matchTest6 = new LinkedList(arr).contains({});
//       expect(emptyTest).toEqual(false);
//       expect(matchTest).toEqual(true);
//       expect(matchTest2).toEqual(true);
//       expect(matchTest3).toEqual(true);
//       expect(matchTest4).toEqual(false);
//       expect(matchTest5).toEqual(true);
//       expect(matchTest6).toEqual(false);
//     });

//     it('traverses', () => {
//       let sLL = new LinkedList([1, 2, 3]),
//           result = [],
//           cbAdd = (v) => result.push(v),
//           cbDel = () => result.pop();
//       expect(result.length).toEqual(0);
//       sLL.traverse(cbAdd);
//       expect(result.length).toEqual(3);
//       sLL.traverse(cbDel);
//       expect(result.length).toEqual(0);
//     });

//   });

//   describe('static methods', () => {

//     it('generates-lz-store', () => {
//       let seqCheck = (test) => expect(test).toEqual(jasmine.any(IM.Seq));
//       let tests = [
//                     LinkedList.generateLzStore(),
//                     LinkedList.generateLzStore(1),
//                     LinkedList.generateLzStore('hey'),
//                     LinkedList.generateLzStore({ name: 'clark' }),
//                     LinkedList.generateLzStore([1, 2, 3, 4, 5])
//                   ];
//       tests.forEach(seqCheck);
//     });

//   });

});
