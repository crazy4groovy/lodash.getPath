# lodash-getpath

A [lodash](https://lodash.com/) plugin/extension/[mixin](https://lodash.com/docs#mixin) for [_.get](https://lodash.com/docs#get), which allows intuitive paths such as 'a.b[].x[0].z'

## Install

`npm install --save lodash-getpath`

## Usage

```js
var _ = require('lodash-getpath');
console.log(_.getPath({a:[1,2,3]}, 'a[0]')); 
// 1
console.log(_.getPath({a:[1,2,3]}, 'a[-1]')); 
// 3
console.log(_.getPath({people:[{name:'Steve'},{name:'Sam'}]}, 'people[].name')); 
// ['Steve', 'Sam']
```

Also available in the browser as simply `_getPath()`
