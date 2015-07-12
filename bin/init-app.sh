#!/bin/bash

# This script is used to initiate the application by downloading the 
# right resources and creating an accurate nginx folder

echo ""
echo "########################################################"
echo "####            Initiate Application                ####"
echo "########################################################"
echo ""

## Pre Install Libraries
source "$PWD/bin/pre-install.sh"

## Make Self Signed Certificate
source "$PWD/bin/make-fake-cert.sh"

## Make Self Signed Certificate
source "$PWD/bin/edit-hosts-file.sh"

## Create / Update Nginx Configuration
source "$PWD/bin/nginx-config.sh"

## Install NPM Modules / Bower Components
source "$PWD/bin/npm-bower-install.sh"