# wiwot - what i worked on today

By and large, jumping between projects on an hourly basis can result in my 
brain being fried enough to forget everything I did over the course of the 
day. After too many emails asking for what I had done on a given day, and
struggling to remember where that lost hour went, I wrote a little script 
to generate a report of my work to remind me what I'd done and to what 
projects.

## About

wiwot is a node utility that parses a given set of folders for changes through 
version control, collates them and outputs a report detailing the list of work
for the day. For the moment it only supports git based repositories as most of 
our projects are using git. Generating a list of all your commits to an svn
repo is much easier (svn log the repository server) whereas with a distributed
system, all the log information is spread. This aims to simplify the process
by running git log on a collection of folders.

## Requirements

 * Node
 * NPM

## Installation
	
	git clone https://github.com/wilr/wiwot.git wiwot
	cd wiwot
	npm install

## Usage

	wiwot.js ~/Sites

Will parse the ~/Sites folder for any git repos and generate a report for the
current day. You can also specify a number of other folders to check..

	wiwot.js ~/Sites ~/Scripts ~/Infrastructure

It will generate output something like the following..

	WIWOT - WHAT I WORKED ON TODAY

	117 projects found on system. 

	node-gitlog.git (/Users/Will/Scripts/node-gitlog/.git)
 	 1) Add options for manipulating since and until git log flags... 6 minutes ago (#67057ef)

	wiwot.git (/Users/Will/Scripts/wiwot/.git)
 	 1) Update code snippets... 28 minutes ago (#350c03f)
 	 2) Resolve issue with retrieving multiple logs... 29 minutes ago (#22d80af)
 	 3) No longer using async, nodegit.. 30 minutes ago (#059f7fd)
 	 4) Initial commit.. 89 minutes ago (#7075934)

	src-gs.git (/Users/Will/Scripts/src-gs/.git)
 	 1) Version bump.. 2 days ago (#79baa04)

	fgr.git (/Users/Will/Sites/fgr/.git)
 	 1) Documentation for user... 2 days ago (#4a0d857)
 	 2) Copy has_one content so user can delete records... 2 days ago (#c3af3a6)
 	 3) FIX member import with duplication supervisors... 2 days ago (#e299ec9)

	goodness.git (/Users/Will/Sites/goodness/.git)
 	 1) Add update_products for cron.. 10 hours ago (#6cc1490)
 	 2) Shopify changes.. 12 hours ago (#a4f90b5)

	framework.git (/Users/Will/Sites/sstrunk/framework/.git)
 	 1) Merge pull request #1800 from willmorgan/patch-1.. 2 days ago (#a6b0807)

	wilr.git (/Users/Will/Sites/wilr/.git)
 	 1) Set max-width.. 2 days ago (#4ac697a)

	Summary: 13 commits

### Options

#### since / until

	wiwot.js --since=1.week --until=1.day.ago yesterday ~/Sites

*(Note: is waiting on https://github.com/domharrington/node-gitlog/pull/3)*

*--since* and *--until* can be combined to allow you to filter the selected 
time period for the reporting. By default git log is filtered to commits 
since yesterday. The format specified is the same as [git-log(1)](https://www.kernel.org/pub/software/scm/git/docs/git-log.html)

	wiwot.js --since="yesterday" ~/Sites
	wiwot.js --since="24 Apr" ~/Sites
	wiwot.js --since="7 days ago" --until="2 days ago" ~/Sites

#### max-commits

Commits logged from each separate git repo. Defaults to 50.

	wiwot.js --max-commits="200" yesterday ~/Sites

#### depth

Configure how deep from each folder you want the script the analyse. By default,
the script will only look 2 directories deep, if you store nested git repositories
(i.e as submodules) you may need to increase this to 3 or 4.

	wiwot.js --depth="5" ~/Sites 
