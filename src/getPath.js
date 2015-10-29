/*	project: getPath
	author: Steven Olsen @crazy4groovy
	description: A lodash plugin extension for _.get, which allows intuitive paths such as 'a.b[].x[0].z'
*/
if (typeof module === 'object' && require) {
	var _ = require('lodash');
}

function _getPath(obj, path, _default) {
	if (!_.isString(path)) return obj;

	var paths = path.match(/(.*?)(?:\[(-?\d*)\]\.?)/);
	//eg. paths = ["a.b[0]", "a.b", "0"]
	//console.log('get:', obj, paths);

	if (!Array.isArray(paths)) {
		//console.log('not-parsable:', path);
		return _.get(obj, path, _default);
	}

	if (paths[1]) {
		obj = _.get(obj, paths[1], _default);
		//console.log('obj:', obj);
	}

	path = path.slice(paths[0].length);
	if (path) {
		// _getPath the rest of the path...
		//console.log('path:', path);
		if (!_.isObject(obj)) {
			return [_default];
		}
		// ...recursively!
		var _obj = obj;
		obj = [];
		for (var prop in _obj) {
			if (!_obj.hasOwnProperty(prop)) continue;
			//console.log('val:', _obj[prop], path);
			var recurseResult = _getPath(_obj[prop], path, _default);
			//console.log('recurse:', recurseResult);
			obj.push(recurseResult);
		}
	}

	if (paths[2]) {
		paths[2] = +paths[2]; // must be an int, given the RegExp
		// support negative indexes!
		var idx = (paths[2] >= 0) ? (paths[2]) : (obj.length + paths[2]);
		return obj[idx];
	}

	return obj;
}

if (typeof module === 'object') {
	module.exports = require('lodash').runInContext().mixin({
		getPath: _getPath
	});
	//console.log('mixed in: _getPath');
}
