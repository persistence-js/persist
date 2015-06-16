module.exports = function(grunt) {

  grunt.initConfig({
    babel: {
      dist: {
        files: {
          'dist/BSTNode.js': 'src/binary_trees/BSTNode.es6',
          'dist/BSTree.js': 'src/binary_trees/BSTree.es6',
          'dist/LList.js': 'src/lists/LList.es6',
          'dist/CLList.js': 'src/lists/CLList.es6',
          'dist/Heap.js': 'src/heaps/Heap.es6'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['babel']);
};
