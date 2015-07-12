#!/bin/bash

# This script is used to initiate the application by downloading the 
# right resources and creating an accurate nginx folder

echo ""
echo "########################################################"
echo "####             Pre Install Commands               ####"
echo "########################################################"
echo ""

ulimit -n 1024

ulimit -u 1024

sudo ulimit -n 1024

sudo ulimit -u 1024

sudo mkdir -p /var/run

sudo mkdir -p /var/log/forever

sudo mkdir -p ~/Library/LaunchAgents

sudo chown -R $(whoami):wheel /usr/local

sudo dseditgroup -o edit -a $(whoami) -t user wheel

sudo dseditgroup -o edit -a $(whoami) -t user admin

defaults write com.apple.finder AppleShowAllFiles YES

ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime

echo ""
echo "########################################################"
echo "####             Development Libraries              ####"
echo "########################################################"
echo ""

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

gem install sass

brew install python

brew install watchman 

brew install node --without-npm

curl -L https://www.npmjs.com/install.sh | sh

npm install npm -g

npm config set prefix /usr

npm config set fetch-retry-maxtimeout 15000

echo ""
echo "########################################################"
echo "####             Optional Dev Libraries             ####"
echo "########################################################"
echo ""

brew tab homebrew/dupes

brew tap homebrew/versions

brew install coreutils

brew install binutils
brew install diffutils
brew install ed --default-names
brew install findutils --with-default-names
brew install gawk
brew install gnu-indent --with-default-names
brew install gnu-sed --with-default-names
brew install gnu-tar --with-default-names
brew install gnu-which --with-default-names
brew install gnutls
brew install grep --with-default-names
brew install gzip
brew install screen
brew install watch
brew install wdiff --with-gettext
brew install wget

brew install bash
brew install emacs
brew install gdb  # gdb requires further actions to make it work. See `brew info gdb`.
brew install gpatch
brew install m4
brew install make
brew install nano

brew install file-formula
brew install git
brew install less
brew install openssh
brew install perl518   # must run "brew tap homebrew/versions" first!
brew install rsync
brew install svn
brew install unzip
brew install vim --override-system-vi
brew install macvim --override-system-vim --custom-system-icons
brew install zsh

brew update && brew upgrade

echo ""
echo "########################################################"
echo "####           Deployment Tools Install             ####"
echo "########################################################"
echo ""

pip install boto 

pip install awscli

pip install awsebcli

pip install --upgrade pip

pip install --upgrade boto

pip install --upgrade awscli

pip install --upgrade awsebcli

aws configure

eb init


echo ""
echo "########################################################"
echo "####                Nginx Install                   ####"
echo "########################################################"
echo ""

brew tap homebrew/nginx

brew tap homebrew/nginx-full

brew install nginx-full --with-spdy --with-file-aio --with-ipv6 --with-http_ssl_module --with-http_spdy_module --with-http_realip_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_stub_status_module --with-http_perl_module --with-pcre --with-debug

brew unlink nginx

brew link nginx-full

sudo cp /usr/local/opt/nginx-full/*.plist /Library/LaunchAgents

sudo chown root:wheel /Library/LaunchAgents/homebrew.mxcl.nginx-full.plist

sudo launchctl load -w /Library/LaunchAgents/homebrew.mxcl.nginx-full.plist

mv /usr/local/etc/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf.bak

cp /usr/local/etc/nginx/nginx.conf.bak /usr/local/etc/nginx/nginx.conf


sudo mkdir /var/cache
sudo mkdir /var/cache/nginx

sudo mkdir /var/log/nginx
sudo mkdir /usr/local/etc/nginx/conf.d

sudo nginx -s reload || sudo nginx









