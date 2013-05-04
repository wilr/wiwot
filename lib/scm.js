
var git = require('./scm/git');
	svn = require('./scm/svn');

module.exports = {
	/**
	 * @function readCommits
	 *
	 * Reads commits from a given directory. Detects what scm the folder is.
	 *
	 * @param {string}
	 * @param {array}
	 * @param {function}
	 */
	readCommits: function(repo, config, callback) {
		var scm = null;

		if(/.git$/.test(repo)) {
			scm = git;
		}
		else if(/.svn$/.test(repo)) {
			scm = svn;
		}
		else {
			throw new Error("Unknown SCM for folder "+ repo);
		}

		scm.readCommits(repo, config, callback);
	}
};