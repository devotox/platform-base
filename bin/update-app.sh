#!/bin/bash

# This script is used to initiate the application by downloading the 
# right resources and creating an accurate nginx folder

echo ""
echo "########################################################"
echo "####             Update Application                 ####"
echo "########################################################"
echo ""

## Update App with GIT Fetch
source "$PWD/bin/git-fetch.sh"

## Create / Update Nginx Configuration
source "$PWD/bin/nginx-config.sh"

## Install NPM Modules / Bower Components
source "$PWD/bin/npm-bower-install.sh"