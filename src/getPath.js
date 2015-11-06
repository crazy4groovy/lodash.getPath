/*	project: getPath
	author: Steven Olsen @crazy4groovy
	description: A lodash plugin extension for _.get, which allows intuitive paths such as 'a.b[].x[0].z'
	license: MIT
*/
if (typeof module === 'object' && require) {
	var _ = require('lodash');
}

var multiIndexesRegex = '(-?\\d+)(,-?\\d+)+';

function matchPath(path) {
	var result;

	var paths = path.match(/(.*?)(?:\[(-\d+)?\]\.?)/);
	//eg. paths = ["a.b[-1]", "a.b", "-1"]
	//paths && console.log('**matched paths:', paths);

	var pathsIndicies = path.match(new RegExp('(.*?)(?:\\[' + multiIndexesRegex + '\\]\\.?)'));
	//eg. ["a[0,1]", "a", "0", ",1,2"]
	//pathsIndicies && console.log('**matched pathsIndicies:', pathsIndicies);

	if (paths) {
		var p = result = {
			matched: paths[0],
			_get: paths[1],
			indicies: paths[2]? [paths[2]] : undefined
		};
	}

	if (pathsIndicies) {
		var pi = result = {
			matched: pathsIndicies[0],
			_get: pathsIndicies[1],
			indicies: pathsIndicies[0].match(new RegExp(multiIndexesRegex))[0].split(',')
		}
	}

	if (paths && pathsIndicies) {
		// process the *smallest* path matched
		return p.matched.length < pi.matched.length ? p : pi;
	}

	return result;
}

function _getPath(obj, path, _default) {
	if (!_.isString(path)) return obj;

	//console.log('match:', obj, path);
	var matchResults = matchPath(path);

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
