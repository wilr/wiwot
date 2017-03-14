"use strict";

var
	fs = require('fs'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	scm = require('./scm'),
	completed = 0,
	projects = [],
	ignoredProjects = [],
	commits = [];

/**
 * @function processList
 *
 * Processes the current store of repositories. Uses the correct scm parser for
 * each of the folders. If the folder causes an error, it will be added to the
 * ignoredProjects list.
 *
 * @private
 *
 * @param {array}
 * @param {array}
 * @param {Function}
 */
var processList = function(repos, config, callback) {

	if (!repos || repos.length < 1) {
		return callback([]);
	}

	var repo = repos.shift();

	scm.readCommits(repo, config, function(err, log) {
		if (err) {
			ignoredProjects.push(repo);
		}

		if (!commits[repo]) {
			commits[repo] = [];
		}

		_.each(log, function(result, i, list) {
			commits[repo].push(result);
		});

		if (repos.length > 0) {
			processList(repos, config, callback);
		} else {
			callback(commits);
		}
	});
};


module.exports = {
	/**
	 * Returns a list of valid scm extensions.
	 *
	 * @returns {array}
	 */
	supportedScms: [
		"\.git$"
		// "\.svn$"
		// "\.hg"
	],

	/**
	 * Set the configuration flags for this wiwot instance. Most configuration
	 * flags can be set via command line flags.
	 * 
	 * @param {array}
	 */
	setConfig: function(config) {
		this.config = {
			'folders': config.folders || [],
			'max-commits': config['max-commits'] || 25,
			'since': config.since || "yesterday",
			'until': config.until || undefined,
			'depth': config.depth || 2
		};
	},

	/**
	 * Retrieve a config value.
	 *
	 * @param {array}
	 *
	 * @return {mixed}
	 */
	getConfig: function(key) {
		return this.config[key];
	},

	/**
	 * Add repositories to our list. Mark the given directory as processed.
	 *
	 * Once all the directories are processed, fire the complete handler.
	 *
	 * @param {Error}
	 * @param {array}
	 * @param {Function} executed only on the last call
	 */
	addRepositories: function(err, repos, done) {
		completed++;
		projects = projects.concat(repos);

		if (completed == this.config['folders'].length) {
			processList(projects, this.config, done);
		}
	},

	/**
	 * Print the results generated.
	 *
	 */
	printResults: function(commits) {
		// start output
		console.log("WIWOT - WHAT I WORKED ON TODAY\n");
		console.log(Object.keys(commits).length + " projects found on system. \n");

		// remove any duplicate ignored projects
		ignoredProjects = _.uniq(ignoredProjects);

		if (ignoredProjects.length > 0) {
			console.log(ignoredProjects.length + " projects ignored due to error(s) " +
				"parsing the repo. Ignored:\n * " + ignoredProjects.join("\n * ") + "\n"
			);
		}

		var total = 0;

		_.each(Object.keys(commits), function(repo, index, list) {
			var changes = commits[repo];

			if (changes && Object.keys(changes).length > 0) {
				console.log(repo);

				_.each(changes, function(commit, i) {
					total++;

					console.log(" " + (i + 1) + ") " +
						"(#" + commit.abbrevHash + ") " + commit.subject + ".. " + commit.authorDateRel +
						" ( " + commit.authorDate + " )"
					);
				});

				console.log();
			}
		});

		if (total > 0) {
			console.log("\nSummary: " + total + " commits\n");
		} else {
			console.log("Zero commits for that time period found in those " +
				"directories. \nPerhaps you need some inspiration to get " +
				"cracking..\n");
			console.log("\"Hard work spotlights the character of people: some " +
				"turn up their \nsleeves, some turn up their noses, and some don't " +
				"turn up at all.\"\n"
			);
		}
	}
};