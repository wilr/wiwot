// WIP

var _ = require('underscore'),
	_s = require('underscore.string'),
	svnlog = require('svn-log-parser'),
	url = require('url'),
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
	getAuthor: function(repositoryRoot, callback) {
		// There's no such thing as the "current user that is using svn." 
		// Credentials are supplied either explicitly at the command prompt or 
		// implicitly through saved credentials. In light of that, the closest
		// we can do on *nix is to cat the basic auth for the svn repo server
		exec('cat ~/.subversion/auth/svn.simple/*', function(error, stdout, stderr) {
			var lines = stdout.split("\n"),
				count = 0;
				regex = new RegExp(url.parse(repositoryRoot).host);

			_.each(lines, function(line) {
				if(count > 0) {
					count++;
				} 

				if(count > 5) {
					return;
				}
				else if(count == 5) {
					return callback(_s.trim(line));
				}
				else if(regex.test(line)) {
					count = 1;
				}
			})
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
		var self = this;

		this.getRepositoryRootUrl(repo, function(root) {
			self.getAuthor(root, function(author) {
				/**
				var command = 
					"svn log " +
					repo.replace(/.svn$/g, '') +" "+
					"-v " + date +" | "+
					"awk '/^r[0-9]+ / {user=$3} {if (user==\"" +
						username +
					"\") {print $2}}' | sort | uniq"
				exec(command, function(err, ))
				**/
			});
		});
	},

	/**
	 * Return the server name for a given repo
	 *
	 * @param {string}
	 * @param {function}
	 */
	getRepositoryRootUrl: function(repo, callback) {
		exec('svn info '+ repo.replace(/.svn$/g, '') , function(error, stdout, stderr) {
			if(error) {
				throw error;
			}

			root = _s.trim(stdout
				.match(/(Repository\ Root:)(.*)/gi)[0]
				.replace(/Repository\ Root:/, '')
			);

			callback(root);
		});
	}
};