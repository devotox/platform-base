#!/bin/bash

# This script is used to deploy app to elasticbeanstalk


echo "########################################################"
echo "####              Deploy Application                ####"
echo "########################################################"
echo ""

# Retrieve from command line
version=$1
description=$2

# If not entered in command line ask for details
if [ "$version" = "" ]
then
	read -p "Version: " version
fi

if [ "$description" = "" ]
then
	read -p "Description: " description
fi

gitignore_path="$PWD/.gitignore"
deployment_branch="deployment-$( date +%s )"
current_branch="$(git symbolic-ref --short -q HEAD)"

# Create deployment branch
git checkout -b $deployment_branch
echo ""

# Make sure deployment branch is exact copy of upstream master
# git fetch upstream
# git reset --hard upstream/master
# echo ""

# Remove .gitignore lines
sed -i -e "s|.ebextensions/environment.config|<env-config>|g" $gitignore_path
sed -i -e "s|api/tests/config.js|<api-test-config>|g" $gitignore_path
sed -i -e "s|sslcert/\*|<sslcert>|g" $gitignore_path

# Create application version
git add --all .
git commit -am "$description" --allow-empty
git tag -a "$version" -m "$description"
echo ""

# Deploy application version
eb init && eb deploy
echo ""

# Return to current branch
git checkout $current_branch
git merge $deployment_branch
git reset --soft HEAD~1

# Add .gitignore lines back
sed -i -e "s|<env-config>|.ebextensions/environment.config|g" $gitignore_path
sed -i -e "s|<api-test-config>|api/tests/config.js|g" $gitignore_path
sed -i -e "s|<sslcert>|sslcert/\*|g" $gitignore_path

# Revert recently added files to untracked
git reset HEAD .ebextensions/environment.config
git reset HEAD api/tests/config.js
git reset HEAD .bin/deploy-app.sh
git reset HEAD .gitignore
git reset HEAD sslcert

# Clean up deployment branch
git branch -D $deployment_branch
git tag -d $version
