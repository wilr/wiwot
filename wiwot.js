var util = require('util'), 
	fs = require('fs'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	walk = require('./lib/walk.js'),
	depth = 2,
	completed = 0,
	projects = [],
	gitlog = require('gitlog'),
	commits = [],
	exec = require('child_process').exec,
	argv = require('optimist').argv;

var getAuthor = function(callback) {
	exec('git config user.name', function (error, stdout, stderr) {
		callback(error, _s.rtrim(stdout));
	});
};

var getLog = function(repo, author, callback) {
	gitlog({
		repo: repo,
		number: argv['max-commits'] || 50,
		author: author,
		since: argv.since || "yesterday",
		until: argv.until || undefined,
		fields: [ 
			'hash', 'abbrevHash', 'subject', 'authorName', 
			'authorDate', 'authorDateRel'
		]
	}, callback);
};

var getName = function(repo) {
	var s = repo.split("/"),
		p = repo;

	_.each(s, function(v, k, l) {
		if(v != ".git") {
			p = v;
		}
	});

	return p;
};

var processList = function(repos, author, callback) {
	var repo = repos.shift();

	getLog(repo, author, function(err, results) {
		if(err) {
			throw err;
		}

		// filter the commits by the ones
		if(!commits[repo]) {
			commits[repo] = [];
		}

		_.each(results, function(result, i, list) {
			commits[repo].push(result);
		})

		if(repos.length > 0) {
			processList(repos, author, callback);
		}
		else {
			callback(err, commits);
		}
	});
};

var printResults = function(commits) {
	console.log("WIWOT - WHAT I WORKED ON TODAY\n");
	console.log(Object.keys(commits).length + " projects found on system. \n");

	var total = 0;

	_.each(Object.keys(commits), function(repo, index, list) {
		var changes = commits[repo];

		if(changes && Object.keys(changes).length > 0) {
			console.log(getName(repo) + ".git ("+ repo +")");

			_.each(changes, function(commit, i) {
				total++;

				console.log(" " + (i + 1) + ") "+ 
					commit.subject + ".. "+ commit.authorDateRel + 
					" (#" + commit.abbrevHash + ")"
				);
			});

			console.log();
		}
	});

	if(total > 0) {
		console.log("\nSummary: "+ total + " commits\n");
	}
	else {
		console.log("Zero commits for that time period found in those "+
			"directories. \nPerhaps you need some inspiration to get "+
			"cracking..\n");
		console.log("\"Hard work spotlights the character of people: some "+
			"turn up their \nsleeves, some turn up their noses, and some don't "+
			"turn up at all.\"\n"
		);
	}
}

var	read = function(dir, callback) {
	if(fs.lstatSync(dir).isDirectory()) {
		walk(dir, dir, depth, function(err, repos) {
			if(err) {
				throw err;
			}

			callback(err, repos)
		});
	}
	else {
		console.error('elem is not a directory, cannot read'); 
	}
};

var complete = function(repos) {
	if(completed == argv._.length) {
		getAuthor(function(err, author) {	
			processList(repos, author, function(error, commits)  {
				if(error) {
					throw error;
				}

				printResults(commits);
			});
		});
	}
};

_.each(argv._, function(elem, index, list) {
	read(elem, function(err, results) {
		completed++;
		projects = projects.concat(results);

		complete(projects);
	});
});

