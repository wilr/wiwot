#!/bin/bash
TEST_DIR="tmp-test-walk-dir"
FILE_NAME="child.txt"

rm -rf $TEST_DIR
mkdir $TEST_DIR
cd $TEST_DIR

for i in {1..4} 
do
	FOLDER=$i-folder

	mkdir $FOLDER

	cd $FOLDER

	for (( x=1; x<=$i; x++ ))
	do
		FILE=$i-$x-$FILE_NAME

		touch $FILE
	done

	mkdir "1-1-folder"


	cd ../
done