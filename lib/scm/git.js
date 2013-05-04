var _ = require('underscore'),
	_s = require('underscore.string'),
	gitlog = require('gitlog');


module.exports = {
	/**
	 * Retrieve the authors name from the repository.
	 *
	 * @param {function}
	 *
	 * @returns {void}
	 */
	getAuthor: function(callback) {
		exec('git config user.name', function (error, stdout, stderr) {
			callback(error, _s.rtrim(stdout));
		});
	},

	/**
	 * Retrieve an array of commits from a given repository
	 *
	 * @param {string}
	 * @param {array}
	 * @param {string}
	 * @param {function}
	*/
	getLog: function(repo, config, author, callback) {
		gitlog({
			repo: repo,
			number: config['max-commits'],
			author: config['author'],
			since: config['since'],
			until: config['until'],
			fields: [ 
				'hash', 'abbrevHash', 'subject', 'authorName', 
				'authorDate', 'authorDateRel'
			]
		}, callback);
	},

	/**
	 * Retrieve the nice name of the given repository
	 *
	 * @param {string}
	 *
	 * @returns {string}
	 */ 
	getName: function(repo) {
		var s = repo.split("/"),
			p = repo;

		_.each(s, function(v, k, l) {
			if(v != ".git") {
				p = v;
			}
		});

		return p;
	}
};