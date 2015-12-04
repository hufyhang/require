/*
* A Super Tiny Require API for Browsers
*
* Usage:
*
* define('toast', function (exports) {
*   exports.show = function (msg) {
*     console.log(new Date(), msg);
*   }
* });
*
* define('square', ['toast'], function (exports, toast) {
*   var square = function (n) {
*     toast.show(n * n);
*   }
*   exports.square = square;
* });
*
* var sq = require('square').square;
* sq(99);
*
*/
(function (root) {
  'use strict';
  var modules = {};
  function require(module) {
    if (typeof module !== 'string') {
      throw new Error('Expect a string for require(...) instead of ' +
                      typeof module + '.');

    }
    if (module in modules === false) {
      throw new Error(module + ' has yet to be defined.');
    }
    var mod = modules[module];
    var exports = {};
    // Each module only needs to be instantiated once.
    if (mod.hasBeenCalled === false) {
      var callback = mod.val;
      // Get all deps first.
      var deps = [];
      mod.deps.forEach(function (dep) {
        deps.push(require(dep));
      });
      // Push `exports` to the front of `deps`.
      deps.unshift(exports);
      callback.apply(window, deps);
      mod.val = exports;
      mod.hasBeenCalled = true;
    }
    else {
      exports = mod.val;
    }
    return exports;
  }

  function define(name, deps, callback) {
    if (typeof name !== 'string') {
      throw new Error('Expect a string. Found ' + typeof name + '.');
    }
    if (deps.constructor !== Array && typeof deps !== 'function') {
      throw new Error('Expect an array or a function. Found ' + typeof deps + '.');
    }
    if (name in modules) {
      throw new Error('Redeclaration of ' + name);
    }
    if (typeof deps === 'function') {
      callback = deps;
      deps = [];
    }

    modules[name] = {
      val: callback,
      hasBeenCalled: false,
      deps: deps
    };
  }

  root.require = require;
  root.define = define;
})(window);

