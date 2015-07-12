#!/bin/bash

# This script installs the required npm globals

echo ""
echo "########################################################"
echo "####             Install NPM Globals                ####"
echo "########################################################"
echo ""

! test -d /usr/local/bin/gulp || npm install -g "gulp"
npm run "install-globals"
npm run "update-globals"

bower install
npm install
npm update

npm run link
