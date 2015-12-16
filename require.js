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
* require('square', function (sq) {
*   sq.square(1000);
* });
*
*/
( function(root) {
'use strict';
// backward compatibility check.
if (typeof root.define !== 'undefined' ||
    typeof root.require !== 'undefined') {
  return false;
}

var modules = {};
function require(moduleList, cb) {
  if (typeof moduleList !== 'string' && moduleList.constructor !== Array) {
    throw new Error('Expect a string or an array of string for require(...) instead of ' + typeof moduleList + '.');

  }
  // convert string-named module to array.
  if (typeof moduleList === 'string') {
    moduleList = [moduleList];
  }

  var exports = [];
  moduleList.forEach(function(module, index) {
    if (module in modules === false) {
      throw new Error(module + ' has yet to be defined.');
    }
    exports[index] = {};
    var mod = modules[module];
    // Each module only needs to be instantiated once.
    if (mod.loaded === false) {
      try {
        var callback = mod.val;
        // Get all deps first.
        var deps = [];
        mod.deps.forEach(function(dep) {
          deps.push(require(dep));
        });
        // Push `exports` to the front of `deps`.
        deps.unshift(exports[index]);
        callback.apply(window, deps);
      } catch ( error ) { // Catch all thrown errors.
        console.error(error.message);
        // If error, set `exports` to `null`.
        exports.push(null);
      }
      finally {
        // Finally, assign `exports` to module, and sets `loaded` to true.
        mod.val = exports[index];
        mod.loaded = true;
      }
    } else {
      exports[index] = mod.val;
    }

  });

  if (typeof cb !== 'function') {
    return exports.length === 1 ? exports[0] : exports;
  } else {
    cb.apply(window, exports);
    return;
  }

}

function define(name, deps, callback) {
  if (typeof name !== 'string') {
    throw new Error('Expect a string. Found ' + typeof name + '.');
  }
  if (deps.constructor !== Array && typeof deps !== 'function') {
    throw new Error('Expect an array or a function. Found ' + typeof deps + '.');
  }
  if (name in modules) {
    console.warn('Redeclaration of ' + name);
    return;
  }
  if (typeof deps === 'function') {
    callback = deps;
    deps = [];
  }

  modules[name] = {
    val: callback,
    loaded: false,
    deps: deps
  };
}

root.require = require;
root.define = define;
} )(window);