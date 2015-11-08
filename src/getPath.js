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

	function matchPath(_getPath) {
		_getPath = _getPath || ''; // the _get-friendly path from prev recursions

		var pathsIndices = path.slice(_getPath.length).match(/(.*?)(?:\[(-?\d+)?(,-?\d+)*\]\.?)/);
		//eg. ["a.b[-1]", "a.b", "-1"]
		//eg. ["a.b[0,1,2]", "a.b", "0", ",2"] *not all indices caught in last match item!
		//console.log(pathsIndices, ';;', _getPath);

		if (pathsIndices) {
			var idxs;
			if (pathsIndices[3]) {
				// a list of indices
				idxs = pathsIndices[0].match(/\[([^\]]*)\]/)[1].split(',');
			} else if (pathsIndices[2]) {
				// a single index
				idxs = [pathsIndices[2]];
			}

			if (idxs) {
				idxs = _.map(idxs, function(idx) { return +idx });

				if (idxs.length === 1 && idxs[0] >= 0) {
					// _get can handle [0+] idx already, let's allow it, and match some more!
					_getPath += pathsIndices[0];
					//console.log(_getPath);
					return matchPath(_getPath); // recursion!
				}
			}

			return {
				matched:  _getPath + pathsIndices[0],
				_get:     _getPath + pathsIndices[1],
				indices: idxs
			}
		}
	}

	//console.log('match:', obj, path);
	var matchResults = matchPath();
	//console.log(matchResults);

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
			if (matchResults.indices && matchResults.indices.length == 1) 
				return _default;
			return [_default];
		}
		// _getPath the rest of the path...recursively!
		var _obj = obj;
		obj = [];
		for (var prop in _obj) {
			if (!_obj.hasOwnProperty(prop)) continue;
			//console.log('val:', _obj[prop], path);
			var recurseResult = _getPath(_obj[prop], path, _default); // recursion!
			//console.log('recurse:', recurseResult);
			obj.push(recurseResult);
		}
	}

	if (matchResults.indices && _.isArray(obj)) {
		var vals = [];
		_.forEach(matchResults.indices, function(idx) {
			idx = (idx < 0) ? (obj.length + idx) : idx;
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
