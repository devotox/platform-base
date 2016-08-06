#!/bin/bash

# This script is used to deploy app to elasticbeanstalk


echo "########################################################"
echo "####              Translate Application             ####"
echo "########################################################"
echo

# Retrieve from command line
application_path="../"
target=$1
src=$2

# If not entered in command line ask for details
if [ "$target" = "" ]
then
	read -p "Target: " target
fi

if [ "$src" = "" ]
then
	src="en"
fi

cd "$application_path/server/helpers/utilities"
node ./translate.js "$target" "$src"
