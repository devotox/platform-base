#!/bin/bash

# This script creates the default local Nginx Configuration


echo ""
echo "########################################################"
echo "####              Find Current User                 ####"
echo "########################################################"
echo ""

# Default Variables
current_user="$USER"
application_path="$PWD"
nginx_config_path="/usr/local/etc/nginx"

# Get Current User
echo ""
read -n1 -p "Current User is $USER (y/n)? " user_prompt

case $user_prompt in
	  n|N)
		echo ""
		read -p "Current User: " current_user
	  ;;
esac

echo ""
echo "[ CURRENT USER ] $current_user"


echo ""
echo "########################################################"
echo "####              Find Current Path                 ####"
echo "########################################################"
echo ""

# Get Path to Application Directory
read -n1 -p "Application Path is $PWD (y/n)? " user_prompt

case $user_prompt in
	  n|N)
		echo ""
		read -p "Application Path: " application_path
	  ;;
esac

echo ""
echo "[ APPLICATION PATH ] $application_path"
echo ""

echo ""
echo "########################################################"
echo "####         Creating Nginx Configuration           ####"
echo "########################################################"
echo ""

brew install gnu-sed --with-default-names

# Make a copy of nginx folder
mkdir  "$application_path/.nginx"
rm -rf "$application_path/.nginx"
cp -Rv "$application_path/nginx" "$application_path/.nginx/"

# Replace path in nginx.conf and server.conf
user_to_replace="<nginx-user>"
path_to_replace="<application-path>"

sed -i -e "s|$user_to_replace|$current_user|g"     "$application_path/.nginx/nginx.conf"
sed -i -e "s|$path_to_replace|$application_path|g" "$application_path/.nginx/nginx.conf"
sed -i -e "s|$path_to_replace|$application_path|g" "$application_path/.nginx/common/server.conf"
sed -i -e "s|$path_to_replace|$application_path|g" "$application_path/.nginx/common/proxy.ssl.conf"

echo ""
echo "########################################################"
echo "####           Move Nginx Configuration             ####"
echo "########################################################"
echo ""

# Get Path to Nginx Configuration Directory
read -n1 -p "Nginx Configuration Path is $nginx_config_path (y/n)? " user_prompt

case $user_prompt in
	  n|N)
		echo ""
		read -p "Nginx Configuration Path: " nginx_config_path
	  ;;
esac

echo ""
echo "[ NGINX PATH ] $nginx_config_path"
echo ""

mkdir "$nginx_config_path"
cp -Rv "$application_path/.nginx/" "$nginx_config_path/"

# Delete copy of nginx folder
rm -rf "$application_path/.nginx"

sudo nginx -s reload || sudo nginx
