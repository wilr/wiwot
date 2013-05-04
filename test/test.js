var should = require('should'), 
	exec = require('child_process').exec,
	walk = require('../lib/walk.js');


describe('wiwot', function() {
	before(function(done) {
		exec(__dirname + '/before-walk.sh', { cwd: __dirname }, function(error, out, err) {
			if(error) {
				throw error;
			}

			done();
		});
	});

	describe('wiwot/walk', function() {
		it('returns an empty list on a random directory', function() {
			walk(__dirname + '/fake-test-dir', 2, function(err, results) {
				results.length.should.equal(0);
			});
		});

		it('returns a list with number of files and directories when no filter', function() {
			walk(__dirname + '/tmp-test-walk-dir', function(err, results) {
				results.length.should.equal(18);
			});
		});

		it('matches all folders with given pattern', function() {
			walk(__dirname + '/tmp-test-walk-dir', ["txt$"], 2, function(err, results) {
				results.length.should.equal(10);
			});

			walk(__dirname + '/tmp-test-walk-dir', ["folder$"], 2, function(err, results) {
				results.length.should.equal(8);
			});

			walk(__dirname + '/tmp-test-walk-dir', ["fake$"], 2, function(err, results) {
				results.length.should.equal(0);
			});
		});

		it('depth parameter controls number depth of walk', function() {
			walk(__dirname + '/tmp-test-walk-dir', 1, function(err, results) {
				results.length.should.equal(4);
			});

			walk(__dirname + '/tmp-test-walk-dir', ["txt$"], 1, function(err, results) {
				results.length.should.equal(0);
			});
		});
	});

	describe('wiwot/git', function() {
		it('works on a git bare repo', function() {

		});
	});

	describe('wiwot/svn', function() {

	});
});