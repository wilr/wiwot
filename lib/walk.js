//
// walk.js walks down a given directory to a given depth looking for files 
// which match one of a given pattern.
//
// Once all the folders have been accessed, a callback is executed with the 
// list of matching records.
//
//
var fs = require('fs'),
	_ = require('underscore'),
	_s = require('underscore.string');

/**
 * Walk a directory from a given base director
 *
 * @param {string} path of base directory
 * @param {string} path of directory to walk
 * @param {array} a list of patterns to match for file
 * @param {int} depth to walk
 * @param {function}
 */
var walk = function (b, dir, matches, depth, callback) {
	var results, 
		pending;

	b = _s.rtrim(b, ['/']);
	dir = _s.rtrim(dir, ['/']) + '/'
	results = [];

	fs.readdir(dir, function(err, list) {
		pending = list ? list.length : null;

		if (!pending) {
			return callback(null, results);
		}
		
		list.forEach(function(file) {
			file = dir + file;

			fs.stat(file, function(err, stat) {
				// if the path matches one of matches then include it in the 
				// results.
				if(_.any(matches, function(r) { return ( new RegExp(r).test(file)); })) {
					results = results.concat(file);
				}

				// if the path is a folder and we haven't exceeded our depth
				// limit then walk the child director
				if (stat && stat.isDirectory()) {
					if(depth != undefined && _s.count(file.replace(b, ''), '/') >= depth) {
						if (!--pending) {
							callback(null, results);
						}
					}
					else {
						walk(b, file, matches, depth, function(err, res) {
							results = results.concat(res);
							
							if (!--pending) {
								callback(null, results);
							}
						});
					} 
				} else {
					if (!--pending) {
						callback(null, results);
					}
				}
			});
		});
	});
};

/**
 * @param {string} path
 * @param {array} file patterns to match
 * @param {int} depth to recurse
 * @param {function}
 */
module.exports = function startWalk(dir, matches, depth, callback) {
	if(typeof matches == "function") {
		// invoked the walker in it's simplest form, no depth given
		// and no specific filter - startWalk("/path/", function())
		// it is not recommended to run this for performance reasons
		walk(dir, dir, [".*"], undefined, matches);
	}
	else if(typeof depth == "function") {
		// invoked as startWalk("/path/", 2, function(..)). i.e match
		// any file or folder.
		walk(dir, dir, [".*"], matches, depth);
	}
	else {
		walk(dir, dir, matches, depth, callback);
	}
};