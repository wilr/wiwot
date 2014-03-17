var _ = require('underscore'),
	_s = require('underscore.string'),
	gitlog = require('gitlog'),
	exec = require('child_process').exec;


module.exports = {
	/**
	 * Retrieve the authors name from the repository.
	 *
	 * @param {string}
	 * @param {function}
	 *
	 * @returns {void}
	 */
	getAuthor: function(repo, callback) {
		exec('git config user.name', { cwd: repo }, function (error, stdout, stderr) {
			callback(error, _s.rtrim(stdout));
		});
	},

	/**
	 * Retrieve an array of commits from a given repository
	 *
	 * @param {string}
	 * @param {array}
	 * @param {function}
	*/
	readCommits: function(repo, config, callback) {
		this.getAuthor(repo, function(err, name) {
			if(err) {
				throw err;
			}
			
			gitlog({
				repo: repo,
				number: config['max-commits'],
				author: name,
				since: config['since'],
				until: config['until'],
				fields: [ 
					'hash', 'abbrevHash', 'subject', 'authorName', 
					'authorDate', 'authorDateRel'
				]
			}, callback);
		});
	}
};