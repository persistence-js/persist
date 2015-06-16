# PersistenceJS

**PersistenceJS** provides specialized, immutable, persistent data structures built on-top of ImmutableJS. PersistenceJS offers highly efficient immutable _linked-lists_, _heaps_, and _search trees_, with more data structures coming soon.

[ ![Current Stable Release Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/persistence-js/persist/releases)
[ ![Codeship Status for PersistenceJS](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://codeship.com/projects/86120/)
[ ![Current Stable npm Release](https://img.shields.io/badge/npm-install%20persistence--js-lightgrey.svg)](https://www.npmjs.com/package/persistence-js)

> Immutable data cannot be changed once created... Persistent data presents a mutative API which does not update the data in-place, but instead always yields new updated data ([source](https://facebook.github.io/immutable-js/)).

---

To learn more about immutable data, persistent data structures, or any of the individual data structures implemented by PersistenceJS, please explore the [appendix](#appendix).

---

> **Created by [Clark Feusier](http://clarkfeusier.com/pages/about) and [Daniel Tsui](http://sdtsui.com)**  


---

1. [Dependencies](#dependencies)
1. [Installation](#installation)
1. [Documentation](#documentation)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing-to-jkif-parser)
1. [Development Requirements](#development-requirements)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Running Tests](#running-tests)
1. [License](#license)
1. [Appendix](#appendix)

---

#### Dependencies

- [immutable](https://facebook.github.io/immutable-js/) — basic immutable collections on which PersistenceJS is constructed
- [core-js](https://www.npmjs.com/package/core-js/) — ES5/6/7 polyfills, shims, and other goodies

---

## Installation

**PersistenceJS** is available as an npm package.

***Install module from command-line***

```sh
npm install persistence-js
```

***Require module for use in desired file***

```js
var Persist = require('persistence-js');
```

---

## Documentation

### *PersistenceJS*

This object provides all of the data structures offered by PersistenceJS.

```js
var Persist = require('persistence-js');
```

## Data Structures

- [Linked List](src/lists/LList.es6)

```js
var LList = Persist.LinkedList;
var exampleLList = new LList();
```

- [Circular Linked List](src/lists/CLList.es6)

```js
var CLList = Persist.CircularLinkedList;
var exampleCLList = new CLList();
```

- [Heap](src/heaps/Heap.es6)

```js
var Heap = Persist.Heap;
var exampleHeap = new Heap();
```

- [Binary Search Tree](src/binary_trees/BSTree.es6)

```js
var BSTree = Persist.BSTree;
var exampleBST = new BSTree();
```

---

## Roadmap

The future of PersistenceJS is managed through this repository's **issues** &mdash; [view the roadmap here](https://github.com/persistence-js/persist/issues).

## Contributing to PersistenceJS

We welcome contributions, but please read our [contribution guidelines](CONTRIBUTING.md) before submitting your work. The development requirements and instructions are below.

## Development Requirements

- Node 0.10.x
- npm 2.x.x
- core-js
- immutable
- babel (global install)
- babel-jest
- jest-cli (global install)
- grunt (global install)
- grunt-cli (global install)
- load-grunt-tasks
- grunt-babel

### Installing Dependencies

Install Node (bundled with npm) using [Homebrew](http://brew.sh/):

```sh
brew install node
```

Install project and development dependencies using npm:

```sh
npm install
```

### Running Tests

After installing the above dependencies, tests can be run using the following command:

```sh
npm test
```

## [License](LICENSE.md)

**PersistenceJS** - specialized persistent collections in javascript

_Copyright 2015 Clark Feusier & Sze-Hung Daniel Tsui_

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

[**COMPLETE LICENSE**](LICENSE)

---

## Appendix

[Persistence](https://en.wikipedia.org/wiki/Persistent_data_structure)

> A persistent data structure ... always preserves the previous version of itself when modified.

[Immutability](https://en.wikipedia.org/wiki/Immutable_object)

An immutable object is an object whose state cannot be modified after it is created. Note, persistent data structures are generally immutable, since the API returns a new structure, despite appearing mutable.

#### [Back to Top](#)

