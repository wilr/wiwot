# wiwot - What I Worked On Today

At DNA I have the pleasure to work on a large range of projects both small 
and large on a weekly or even daily basis. Across languages, platforms and
our and others source code repositories.

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
repo is much easier (svn log the repository server).

## Usage

>	node wiwot.js ~/Sites

Will parse the ~/Sites folder for any git repos and generate a report for the
current day. You can also specify a number of other folders to check..

>	node wiwot.js ~/Sites ~/Scripts ~/Infrastructure

### Options

>	node wiwot.js -d yesterday ~/Sites

*-d* allows you to filter the selected time period.

### Caveats

The script sets a maximum of 50 commits per repo.

