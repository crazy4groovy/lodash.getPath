[![Travis](https://img.shields.io/travis/crazy4groovy/lodash.getPath.svg)](https://travis-ci.org/crazy4groovy/lodash.getPath)

# lodash-getpath

A [lodash](https://lodash.com/) plugin/extension/[mixin](https://lodash.com/docs#mixin) for [_.get](https://lodash.com/docs#get), which allows intuitive paths eg. 'name[0,1]' and 'a.b[].x[-1].z'

Supported syntax features:

- +/-ve indexes
- `[0,1,-2]` comma list of indexes --> spliced Array
- `[]` all indexes --> whole Array

## Install

`npm install --save lodash-getpath`

## Usage

<pre>
var _ = require('lodash-getpath'); // lodash with the mixin provided
console.log(_.getPath({a:[1,2,3]}, 'a[0]'));
// 1
console.log(_.getPath({a:[1,2,3]}, 'a[0,2]'));
// [1, 3]
console.log(_.getPath({a:[1,2,3]}, 'a[1,1]'));
// [2, 2]
console.log(_.getPath({a:[1,2,3]}, 'a[-1]'));
// 3
console.log(_.getPath({a:[1,2,3]}, 'a[-1,-2]'));
// [3, 2]
console.log(_.getPath({people:[{name:'Steve'},{name:'Sam'}]}, 'people[].name'));
// ['Steve', 'Sam']
</pre>


Also available in the browser as simply `_getPath()` in the global context/window
