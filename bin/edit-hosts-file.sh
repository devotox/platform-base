#!/bin/bash

# This script is used to initiate the application by downloading the 
# right resources and creating an accurate nginx folder

echo ""
echo "########################################################"
echo "####               Edit Hosts File                  ####"
echo "########################################################"
echo ""

application_path="$PWD" 

# sudo cp -i "$application_path/nginx/.hosts" "/private/etc/hosts"

sudo paste -d "\n" "/private/etc/hosts" "$application_path/nginx/.hosts"