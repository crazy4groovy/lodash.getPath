# lodash.getPath

A lodash plugin/extension/mixin for _.get, which allows intuitive paths such as 'a.b[].x[0].z'

## Install

`npm install --save lodash.getpath`

## Usage

```js
var _ = require('lodash.getpath');
console.log(_.getPath({a:[1,2,3]}, 'a[0]')); // 1
console.log(_.getPath({a:[1,2,3]}, 'a[-1]')); // 3
```

Also available in the browser as simply `_getPath()`
