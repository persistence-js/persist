jest.autoMockOff();
var IM = require('immutable'),
    DLinkedList = require('../../../src/lists/DLinkedList');

xdescribe('DLinkedList', () => {

  describe('new instance initialization', () => {
     let dLLEmpty = new DLinkedList();

    it('starts with a null head', () => {
      expect(dLLEmpty.head).toBeNull();
    });

    it('starts with a null tail', () => {
      expect(dLLEmpty.tail).toBeNull();
    });

    it('starts with an empty _lzStore', () => {
      expect(dLLEmpty._lzStore.size).toBe(0);
    });

    it('stores a number on initialization', () => {
      let dLLNumber = new DLinkedList(1);
      expect(dLLNumber._lzStore.size).toBe(1);
      expect(dLLNumber.head).toEqual(1);
      expect(dLLNumber.tail).toEqual(1);
    });

    it('stores a string on initialization', () => {
      let dLLString = new DLinkedList('string value');
      expect(dLLString._lzStore.size).toBe(1);
      expect(dLLString.head).toEqual('string value');
      expect(dLLString.tail).toEqual('string value');
    });

    it('stores an object on initialization', () => {
      let dLLObject = new DLinkedList({ name: 'clark' });
      expect(dLLObject._lzStore.size).toBe(1);
      expect(dLLObject.head).toEqual({ name: 'clark' });
      expect(dLLObject.tail).toEqual({ name: 'clark' });
    });

    it('stores an array on initialization', () => {
      let dLLArray = new DLinkedList(['random string', { 'asdfasdf':'asdf' }, { name: 'anna' }, 26, ['tail value']]);
      expect(dLLArray._lzStore.size).toBe(5);
      expect(dLLArray.head).toEqual('random string');
      expect(dLLArray.tail).toEqual(['tail value']);
    });

  });

  describe('public interface instance methods', () => {
    let dLLNumber = new DLinkedList(1);
    let dLLArray = new DLinkedList(['random string', { 'asdfasdf':'asdf' }, { name: 'anna' }]);

    it('gets-head', () => {
      expect(dLLNumber.head).toEqual(1);
      expect(dLLArray.head).toEqual('random string');
    });

    it('gets-tail', () => {
      expect(dLLNumber.tail).toEqual(1);
      expect(dLLArray.tail).toEqual({ name: 'anna' });
    });

    it('gets-store', () => {
      expect(dLLNumber.store.length).toEqual(1);
      expect(dLLNumber.store[0]).toEqual(1);
    });

    it('gets-size', () => {
      expect(dLLNumber.size).toEqual(1);
      expect(dLLArray.size).toEqual(3);
    });

    it('inserts-before', () => {
      let dLLNumber2 = dLLNumber.insertBefore(1, 2);
      expect(dLLNumber.head).toEqual(1); // shouldn't mutate original list
      expect(dLLNumber2.head).toEqual(2);
      expect(dLLNumber2.tail).toEqual(1);
      let obj = { name: 'anna' };
      let dLLNumberAndObj = dLLNumber.insertBefore(1, obj);
      expect(dLLNumber.head).toEqual(1); // shouldn't mutate original list
      expect(dLLNumberAndObj.head).toEqual(obj);
      expect(dLLNumberAndObj.tail).toEqual(1);
      let obj2 = { name: 'fiddle' };
      let dLLNumberAndObj2 = dLLNumberAndObj.insertBefore(obj, obj2);
      expect(dLLNumberAndObj.head).toEqual(obj); // shouldn't mutate original list
      expect(dLLNumberAndObj2.head).toEqual(obj2);
      expect(dLLNumberAndObj2.tail).toEqual(1);
    });

    it('inserts-after', () => {
      let dLLNumber2 = dLLNumber.insertAfter(1, 2);
      expect(dLLNumber.tail).toEqual(1); // shouldn't mutate original list
      expect(dLLNumber2.tail).toEqual(2);
      expect(dLLNumber2.head).toEqual(1);
      let obj = { name: 'anna' };
      let dLLNumberAndObj = dLLNumber.insertAfter(1, obj);
      expect(dLLNumber.tail).toEqual(1); // shouldn't mutate original list
      expect(dLLNumberAndObj.head).toEqual(1);
      expect(dLLNumberAndObj.tail).toEqual(obj);
      let obj2 = { name: 'fiddle' };
      let dLLNumberAndObj2 = dLLNumberAndObj.insertAfter(obj, obj2);
      expect(dLLNumberAndObj.tail).toEqual(obj); // shouldn't mutate original list
      expect(dLLNumberAndObj2.head).toEqual(1);
      expect(dLLNumberAndObj2.tail).toEqual(obj2);
    });


    it('removes-head', () => {
      let dLLNumber2 = dLLNumber.insertAfter(1, 2);
      let dLLNumber3 = dLLNumber.removeHead();
      let dLLNumber4 = dLLNumber2.removeHead();
      expect(dLLNumber.head).toEqual(1); // shouldn't mutate original list
      expect(dLLNumber2.head).toEqual(1); // shouldn't mutate any copied lists
      expect(dLLNumber3.head).toBeNull();
      expect(dLLNumber4.head).toEqual(2);
      expect(dLLNumber4.tail).toEqual(2);
    });

    it('contains', () => {
      let emptyTest = new DLinkedList().contains('random'),
          matchTest = new DLinkedList('random').contains('random'),
          obj = {},
          deepObj = { key1: 'key1' , testArr: ['first', 'second'] },
          deepObj2 = { key1: 'key1' , testArr: ['first', 'second', 'third'], 'other key': 3 },
          arr = [1, 2, 3, 4, 'test', {}],
          matchTest2 = new DLinkedList(obj).contains(obj),
          matchTest3 = new DLinkedList(deepObj).contains(deepObj),
          matchTest4 = new DLinkedList(deepObj).contains(deepObj2),
          matchTest5 = new DLinkedList(arr).contains('test'),
          matchTest6 = new DLinkedList(arr).contains({});
      expect(emptyTest).toEqual(false);
      expect(matchTest).toEqual(true);
      expect(matchTest2).toEqual(true);
      expect(matchTest3).toEqual(true);
      expect(matchTest4).toEqual(false);
      expect(matchTest5).toEqual(true);
      expect(matchTest6).toEqual(false);
    });

    it('traverses', () => {
      let dLL = new DLinkedList([1, 2, 3]),
          result = [],
          cbAdd = (v) => result.push(v),
          cbDel = () => result.pop();
      expect(result.length).toEqual(0);
      dLL.traverse(cbAdd);
      expect(result.length).toEqual(3);
      expect(result[2]).toEqual(3);
      dLL.traverse(cbDel);
      expect(result.length).toEqual(0);
    });

    it('traverses-backwards', () => {
      let dLL = new DLinkedList([1, 2, 3]),
          result = [],
          cbAdd = (v) => result.push(v),
          cbDel = () => result.pop();
      expect(result.length).toEqual(0);
      dLL.traverseBackwards(cbAdd);
      expect(result.length).toEqual(3);
      expect(result[2]).toEqual(1);
      dLL.traverseBackwards(cbDel);
      expect(result.length).toEqual(0);
    });

  });

  describe('static methods', () => {

    it('generates-lz-store', () => {
      let seqCheck = (test) => expect(test).toEqual(jasmine.any(IM.Seq));
      let tests = [
                    DLinkedList.generateLzStore(),
                    DLinkedList.generateLzStore(1),
                    DLinkedList.generateLzStore('hey'),
                    DLinkedList.generateLzStore({ name: 'clark' }),
                    DLinkedList.generateLzStore([1, 2, 3, 4, 5])
                  ];
      tests.forEach(seqCheck);
    });

  });

});
