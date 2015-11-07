var assert = require('assert'),
	_ = require('../src/getPath');

describe('getPath', function() {

	function testPath(obj, path, expected, dafaultVal) {
		var result = _.getPath(obj, path, dafaultVal);
		assert.equal(JSON.stringify(result), JSON.stringify(expected));
	}

	describe('x1', function () {
		var x1 = {a:[{b:[{x:2},{x:3}]},{b:[{x:1},{x:9}]}]};

		describe('[] (no index) tests', function () {
			it('should return the expected values', function () {
				testPath(x1, 'a[].b',         [[{x:2},{x:3}],[{x:1},{x:9}]]);
				testPath(x1, 'a[].b[]',       [[{x:2},{x:3}],[{x:1},{x:9}]]);
				testPath(x1, 'a[].b[].x',     [[2,3],[1,9]]);
				testPath(x1, 'a[].b[].x[].z', [[[null],[null]],[[null],[null]]]);
			});
		});
		describe('[n] (index) tests', function () {
			it('should return the expected values', function () {
				testPath(x1, 'a[1].b',         [{x:1},{x:9}]);
				testPath(x1, 'a[0].b',         [{x:2},{x:3}]);
				testPath(x1, 'a[-2].b',        [{x:2},{x:3}]);
				testPath(x1, 'a[].b[0].x',     [2,1]);
				testPath(x1, 'a[].b[].x[0].z', [[[null],[null]],[[null],[null]]]);
			});
		});
		describe('[n,m] (indexes) tests', function () {
			it('should return the expected values', function () {
				testPath(x1, 'a[0,1].b',       [[{x:2},{x:3}],[{x:1},{x:9}]]);
				testPath(x1, 'a[1,0].b',       [[{x:1},{x:9}],[{x:2},{x:3}]]);
				testPath(x1, 'a[1,0].b[]',     [[{x:1},{x:9}],[{x:2},{x:3}]]);
				testPath(x1, 'a[-2,-1].b',     [[{x:2},{x:3}],[{x:1},{x:9}]]);
				testPath(x1, 'a[].b[0,1].x',   [[2,3],[1,9]]);
				testPath(x1, 'a[].b[0,1].x[-1].z', [[[null],[null]],[[null],[null]]]);
			});
		});
	});

	describe('x2', function () {
		var x2 = {a:[{b:[{y:2},{x:3}]},{b:[{x:1},{y:9}]}]};

		describe('[] (no index) tests', function () {
			it('should return the expected values', function () {
				testPath(x2, 'a[].b[].x', [[null,3],[1,null]]);
				testPath(x2, 'a[].b[].y', [[2,null],[null,9]]);
			});
		});
		describe('[n] (index) tests', function () {
			it('should return the expected values', function () {
				testPath(x2, 'a[].b[1].x',  [3,null]);
				testPath(x2, 'a[].b[-2].y', [2,null]);
			});
		});
		describe('[n,m] (indexes) tests', function () {
			it('should return the expected values', function () {
				testPath(x2, 'a[].b[1,0].x',  [[3,null],[null,1]]);
				testPath(x2, 'a[].b[-2,0].y', [[2,2],[null,null]]);
			});
		});
	});

	describe('x3', function () {
		var x3 = [{b:[{x:2},{x:3}]},{b:[{x:1},{y:9}]}];

		describe('[] (no index) tests', function () {
			it('should return the expected values', function () {
				testPath(x3, '[].b[].x',         [[2,3],[1,null]]);
				testPath(x3, '[].b[].y',         [[null,null],[null,9]]);
				testPath(x3, '[].b[].y[].z[].q', [[[true],[true]],[[true],[true]]], true);
			});
		});
		describe('[n] (index) tests', function () {
			it('should return the expected values', function () {
				testPath(x3, '[0].b[].x',             [2,3]);
				testPath(x3, '[-1].b[-1].y',          9);
				testPath(x3, '[0].b[-1].y[-1].z[].q', [true], true);
			});
		});
		describe('[n,m] (indexes) tests', function () {
			it('should return the expected values', function () {
				testPath(x3, '[0,0,0].b[].x', [[2,3],[2,3],[2,3]]);
			});
		});
	});

	describe('x4', function () {
		var x4 = {a:[{b:{c:10}},{b:{c:20}}]};

		describe('[] (no index) tests', function () {
			it('should return the expected values', function () {
				testPath(x4, 'a[].b.c', [10,20]);
			});
		});
		describe('[n] (index) tests', function () {
			it('should return the expected values', function () {
				testPath(x4, 'a[-2].b.c', 10);
			});
		});
	});

	describe('x5', function () {
		var x5 = [[[1,2],[3,4]],[5,6],[7,8]];

		describe('[] (no index) tests', function () {
			it('should return the expected values', function () {
				testPath(x5, '[]',   [[[1,2],[3,4]],[5,6],[7,8]]);
				testPath(x5, '[][]', [[[1,2],[3,4]],[5,6],[7,8]]);
			});
		});
		describe('[n] (index) tests', function () {
			it('should return the expected values', function () {
				testPath(x5, '[][0]',    [[1,2],5,7]);
				testPath(x5, '[][-1]',   [[3,4],6,8]);
				testPath(x5, '[0]',      [[1,2],[3,4]]);
				testPath(x5, '[1]',      [5,6]);
				testPath(x5, '[][1]',    [[3,4],6,8]);
				testPath(x5, '[][1][1]', [4,6,8]);
				testPath(x5, '[1][1]',   6);
			});
		});
		describe('[n,m] (indexes) tests', function () {
			it('should return the expected values', function () {
				testPath(x5, '[0,0,0]',       [[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]]]);
				testPath(x5, '[0,0,0][0]',    [[1,2],[1,2],[1,2]]);
				testPath(x5, '[0,0,0][0][0]', [1,1,1]);
				testPath(x5, '[1,2,1]',       [[5,6],[7,8],[5,6]]);
				testPath(x5, '[1,-1,0,-2]',   [[5,6],[7,8],[[1,2],[3,4]],[5,6]]);
			});
		});
	});

	describe('funky', function  () {
		it('should bail out nicely', function () {
			testPath({a:[1,2,3]}, 'a[applesauce]', undefined);
		});
	});
});
