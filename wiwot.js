#!/usr/bin/env node

/**
 * __      ___         _     ___                  _          _              _           _           
 * \ \    / / |_  __ _| |_  |_ _| __ __ _____ _ _| |_____ __| |  ___ _ _   | |_ ___  __| |__ _ _  _ 
 *  \ \/\/ /| ' \/ _` |  _|  | |  \ V  V / _ \ '_| / / -_) _` | / _ \ ' \  |  _/ _ \/ _` / _` | || |
 *   \_/\_/ |_||_\__,_|\__| |___|  \_/\_/\___/_| |_\_\___\__,_| \___/_||_|  \__\___/\__,_\__,_|\_, |
 *                                                                                             |__/ 
 * @license BSD-3-Clause
 * @author Will Rossiter <will@fullscreen.io>
 */

var fs = require('fs'),
	walk = require('./lib/walk'),
	wiwot = require('./lib/wiwot'),
	_ = require('underscore'),
	argv = require('optimist').argv;

//
// goes through any given folder paths in the script execution to load all the
// repositories on the system.
// 
// > wiwot.js Sites/ Scripts/ Contracts/
// 

wiwot.setConfig({
	'folders': argv._,
	'max-commits': argv['max-commits'] || 25,
	'since': argv.since || "yesterday",
	'until': argv.until || undefined,
	'depth': argv.depth || 2
});

var scms = wiwot.supportedScms,
	d = wiwot.getConfig('depth');

if(argv._.length > 0) {
	_.each(argv._, function(elem, index, list) {
		if(fs.lstatSync(elem).isDirectory()) {
			walk.startWalk(elem, scms, d, function(err, repos) {

				if(err) {
					throw err;
				}

				wiwot.addRepositories(err, repos, function() {
					wiwot.printResults();
				});
			});
		}
		else {
			console.error(elem + " is not a directory, and we cannot read"); 
		}
	});
}
else {
	console.log("Please define a folder for reading from e.g wiwot.js ~/Sites");
}