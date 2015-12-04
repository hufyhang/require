### A Tiny CommonJS Require library for browsers.

#### define(_name_, [_dependencies_], _function_)

To define a module.

+ _name_: The (_unique_) name of the module.
+ _dependencies_: [__optional__] An array indicates the dependencies of this module.
+ _function_: The function to be called to define the module. This `function` takes at least an `exports` parameter. All the methods/data members to be exposed should be attached to `exports`. Depending on `dependencies`, the `function` can also take parameters representing each dependency.

#### require(_name_)

To require a module. It __returns__ the exposed methods/data members of the required module.

+ _name_: The (_unique_) name of the module to be required.

#### Usage

~~~js
define('toast', function (exports) {
  exports.show = function (msg) {
    console.log(new Date(), msg);
  }
});

define('square', ['toast'], function (exports, toast) {
  var square = function (n) {
    toast.show(n * n);
  }
  exports.square = square;
});

var sq = require('square').square;
sq(99);
~~~

#### License

MIT