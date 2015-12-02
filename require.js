/*
* A Super Tiny Require API for Browsers
*
* Usage: 
*
* define('square', function (exports) {
*   var square = function (n) {
*     return n * n;
*   }
*   exports.square = square;
* });
*
* var sq = require('square').square;
* console.log('99 * 99 =', sq(99));
*
*/
(function (root) {
  var modules = {};
  function require(module) {
    if (typeof module !== 'string') {
      throw new Error('Expect a string for require(...) instead of ' +
                     typeof module + '.');

    }
    if (module in modules === false) {
      throw new Error(module + ' has yet to be defined.');
    }
    
    var callback = modules[module];
    var exports = {};
    callback(exports);

    return exports;
  }
  
  function define (name, callback) {
    if (name in modules) {
      throw new Error('Redeclaration of ' + name);
    }
    
    if (typeof callback !== 'function') {
      throw new Error('Expect a function for require.add. instead of ' + 
                     typeof callback + '.');
    }
    modules[name] = callback;
  };
  root.require = require;
  root.define = define;
})(window);

