var fs = require('fs'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	ignoreInside = [".svn", "assets", ".settings", ".metadata"];


module.exports = function walk(b, dir, depth, callback) {
	b = _s.rtrim(b, ['/']);
	dir = _s.rtrim(dir, ['/']) + '/'

	var results = [];
	
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		
		var pending = list.length;

		if (!pending) {
			return callback(null, results);
		}
		
		list.forEach(function(file) {
			if(_.contains(ignoreInside, file)) {
				if(!--pending) {
					callback(null, results);
				}

				return;
			}

			file = dir + file;

			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					// depth of the search is limited by the depth property
					// we calculate the depth based off the file path.
					if(file.slice(-4) == ".git") {
						results = results.concat(file);
					}

					if(_s.count(file.replace(b, ''), '/') > depth) {
						if (!--pending) {
							callback(null, results);
						}
					}
					else {
						walk(b, file, depth, function(err, res) {
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