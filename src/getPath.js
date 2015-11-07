/*
	project: _getPath
	author: Steven Olsen @crazy4groovy
	description: A lodash plugin extension for _.get, which allows intuitive paths eg. 'name[0,1]' and 'a.b[].x[-1].z'
	license: MIT
*/
if (typeof module === 'object' && require) {
	var _ = require('lodash');
}


function _getPath(obj, path, _default) {
	if (!_) throw new Error('lodash variable "_" is undefined.');

	if (!_.isString(path)) return obj;

	function matchPath() {
		var pathsIndicies = path.match(/(.*?)(?:\[(-?\d+)?(,-?\d+)*\]\.?)/);
		//console.log(pathsIndicies);
		//eg. ["a.b[-1]", "a.b", "-1"]
		//eg. ["a.b[0,1,2]", "a.b", "0", ",2"] *not all indicies caught in last match item!

		if (pathsIndicies) {
			var idxs;
			if (pathsIndicies[3]) {
				// a list of indicies
				idxs = pathsIndicies[0].match(/\[([^\]]*)\]/)[1].split(',');
			} else if (pathsIndicies[2]) {
				// a single index
				idxs = [pathsIndicies[2]];
			}
			return {
				matched: pathsIndicies[0],
				_get: pathsIndicies[1],
				indicies: idxs
			}
		}
	}

	//console.log('match:', obj, path);
	var matchResults = matchPath();

	if (!matchResults) {
		//console.log('not-parsable:', path, paths);
		return _.get(obj, path, _default);
	}

	if (matchResults._get) {
		obj = _.get(obj, matchResults._get, _default);
		//console.log('obj:', obj);
	}

	path = path.slice(matchResults.matched.length);
	if (path) {
		//console.log('path:', path);
		if (!_.isObject(obj)) {
			return [_default];
		}
		// _getPath the rest of the path...recursively!
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

	if (matchResults.indicies && Array.isArray(obj)) {
		var vals = [];
		_.forEach(matchResults.indicies, function(idx) {
			idx = +idx;
			if (idx < 0) {
				idx = obj.length + idx;
			}
			vals.push(obj[idx]);
		});
		return vals.length === 1 ? vals[0] : vals;
	}

	return obj;
}

if (typeof module === 'object') {
	module.exports = require('lodash').runInContext().mixin({
		getPath: _getPath
	});
	//console.log('mixed in: _getPath');
}
