var git = require('./scm/git');
	// svn = require('scm/svn');

module.exports = {
	/**
	 * @function readCommits
	 *
	 * Reads commits from a given directory. Detects what scm the folder is.
	 */
	readCommits: function(repo, config, callback) {
		if(/.git$/.test(repo)) {
			git.getAuthor(repo, function(err, name) {
				if(err) {
					throw err;
				}
				
				git.getLog(repo, config, name, callback);
			});
		}
		else if(/.svn$/.test(repo)) {
			// todo
		}
	},
};