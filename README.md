[![Travis](https://img.shields.io/travis/crazy4groovy/lodash.getPath.svg)](https://travis-ci.org/crazy4groovy/lodash.getPath)

# lodash-getpath

A [lodash](https://lodash.com/) plugin/extension/[mixin](https://lodash.com/docs#mixin) for [_.get](https://lodash.com/docs#get), which allows intuitive paths eg. 'name[0,1]' and 'a.b[].x[-1].z'

## What for?

Above-and-beyond pathing syntax for nested-Array properties:

- +/-ve index --> returns value from start/end of Array
- `[0,1,-2]` list of indexes --> returns a (spliced) Array
- `[]` all indexes --> returns a (whole) Array

## Install

`npm install --save lodash-getpath`

## Usage

<pre>
var _ = require('lodash-getpath'); // import lodash with the mixin provided

// simple object example
var obj1 = { a: [1, 2, 3] };
_.getPath(obj1, 'a[0]') === 1;           // positive index
_.getPath(obj1, 'a[0, 2]') === [1, 3];   // positive indexes
_.getPath(obj1, 'a[1, 1]') === [2, 2];   // repeated indexes (ok!)
_.getPath(obj1, 'a[-1]') === 3;          // negative index
_.getPath(obj1, 'a[-1, -2]') === [3, 2]; // negative indexes

// a little more complex object
var pathUsersNames = 'users[].name';
_.getPath({ users: [{ name: 'Steve' },{ name: 'Sam' }] }, pathUsersNames) === ['Steve', 'Sam']; // all indexes, with sub-key

// *any* complex object/array structure you can think of, pull out the data you need in a single query!
...
</pre>

Also available in the browser as simply `_getPath()` in the global context/window

Currently built using `lodash ^4.0.0`
