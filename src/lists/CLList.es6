import 'core-js/shim';
let IM = require('immutable');
  LList = require('./LList.es6');

export default class CLList extends LList {

  constructor(itemOrList = [], options = {}) {
    options.circular = true;
    super(itemOrList, options)
  }

  //Returns a new list, removing one node after the specified node.
  removeAfter(nodeToRemove) {
    return this.remove(nodeToRemove.next);
  }

  //Returns a new list, removing one node before the specified node.
  removeBefore(nodeToRemoveBefore) {
    let isTarget = (nodeToCheck) => {
      return nodeToCheck.next === nodeToRemoveBefore;
    }
    return this.remove(this.filter(isTarget)[0]);
  }

  //Returns a new list, adding one node after the specified node.
  addAfter(atNode, addition) {
    return this.addBefore(atNode, addition, false);
  }

  //Returns a new list, adding one node before the specified node.
  addBefore(atNode, addition, before = true) {
    let additionList = new LList(addition);
    let insert = () => {
      let newList = [];
      this.forEach((node) => {
        if(node === atNode && !!before){
          newList = newList.concat(additionList.map(LList.getData));
        }
        newList.push(node.data);
        if(node === atNode && !before){
          newList = newList.concat(additionList.map(LList.getData));
        }
      });

      return new CLList(newList);      
    }.bind(this);

    return (LList.isNode(atNode)) ? insert() :
      new Error("Error, inputs must be LList Nodes.");
  }

  //Helper functions
  remove(nodeToRemove){
    let notNode = (nodeToCheck) => {
      return nodeToCheck !== nodeToRemove;
    }
    return new CLList(this.filter(notNode).map(LList.getData));
  }
}