## Platform Base

#### Ember

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Common Dev Practices

#### General
	* Run all commands from root of application
	* Install all Node Modules at root of application
	* If new global npm module is used then also add it to gulpfile.js (install-globals task)

#### GIT
	* Never work on your master branch - This should only be used to synchronize with the upstream repo
	* Every new ticket worked on should have its own branch - `git checkout -b DW-123`
	* This branch will now send a pull request to the upstream master branch and ONLY after it is merged
	* `git fetch upstream; git merge --no-edit upstream/master`

#### CSS / SCSS
	* Always use .scss files rather than css
	* Break up scss files per page / per module and import them all in app.scss

#### JS
	* All files should not be more than 300 lines long
	* Always put this at top of ember apps `import Ember from 'ember';`
	* Always fix all JSHint errors as they show up or they will grow too large and tedious

## Setting up Dev Environment (Mac)

* Make sure you own /usr/local
	* `sudo chown -R (whoami) /usr/local`

* Show All Hidden Files
	* `defaults write com.apple.finder AppleShowAllFiles YES`

* Setup Sublime 3 as a terminal command (optional)
	* Install Sublime -> [Sublime Text 3](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203083.dmg)
	* `ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/sublime`

* Install Atom ( Text Editor )
	* Install Atom -> [Atom](https://atom.io/download/mac)

* Install Homebrew
	* `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
	* Upgrade Brew -> `brew update && brew upgrade`

* Install Watchman and python
	* `brew install watchman && brew install python`

* Install Postgres
	* [Postgres](https://github.com/PostgresApp/PostgresApp/releases/download/9.4.4.0/Postgres-9.4.4.0.zip)
	* Add /Applications/Postgres.app/Contents/Versions/9.4/bin to your $PATH

* Install MongoDB
	* `brew install mongodb --with-openssl`
	* [MongoDB PrefPane](https://github.com/remysaissy/mongodb-macosx-prefspane/raw/master/download/MongoDB.prefPane.zip)

* Install Sass
	* `gem install sass`

* Install Node / NPM
	* `brew install node`
	* `npm install npm -g`

* Download Source Code
	* `cd /path/where/you/want/to/install/code/base`
	* Go to platform url -> [Platform](https://github.com/platform/platform.git)`
	* Fork Repo
	* `git clone https://github.com/<your-github-username>/platform.git`
	* `cd platform`

### Add upstream
* `git remote add upstream https://github.com/DnD-Enterprises/platform-base.git`
* `git branch --unset-upstream`

### Configuring Application
* `npm run init-app`

* Install Global Modules
	* `npm run install-globals`
	* OR
	* `npm install -g gulp`
	* `npm install -g bower`
	* `npm install -g ember-cli`
	* `npm install -g grunt-cli`
	* `npm install -g broccoli-cli`

	* `npm install -g pm2`
	* `npm install -g nodemon`
	* `npm install -g phantomjs`
	* `npm install -g node-inspector`

* Create Certificates
	* sh bin/make-fake-cert.sh

## Install Nginx - We are going to also make sure we can use port 80
* Further Reading - [Set up Nginx on Port 80](http://derickbailey.com/2014/12/27/how-to-start-nginx-on-port-80-at-mac-osx-boot-up-log-in/)
	* `brew tap homebrew/nginx-full`
	* `brew install nginx-full --with-spdy --with-file-aio --with-ipv6 --with-http_ssl_module --with-http_spdy_module --with-http_realip_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_stub_status_module --with-http_perl_module --with-pcre --with-debug`
	* `brew unlink nginx; brew link nginx-full`

	* To have launchd start nginx at login:
		* `sudo cp /usr/local/opt/nginx-full/*.plist /Library/LaunchDaemons`

	* Then to load nginx now:
		* `sudo chown root:wheel /Library/LaunchDaemons/homebrew.mxcl.nginx-full.plist`
		* `sudo launchctl load -w /Library/LaunchDaemons/homebrew.mxcl.nginx-full.plist`

	* First backup Config
		* `mv /usr/local/etc/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf.bak`
		* `cp /usr/local/etc/nginx/nginx.conf.bak /usr/local/etc/nginx/nginx.conf`

	* Setup Config
		* `sudo mkdir /var/log/nginx`
		* `sudo mkdir /usr/local/etc/nginx/conf.d`
		* `sudo mkdir /var/cache; sudo mkdir /var/cache/nginx`
		* `sudo cp -R nginx/conf.d/* /usr/local/etc/nginx/conf.d/`
		* `sudo cp -R nginx/common/* /usr/local/etc/nginx/common/`
		* `sudo cp -f nginx/nginx.conf /usr/local/etc/nginx/nginx.conf`
		* `nano /usr/local/etc/nginx/nginx.conf` OR `sublime /usr/local/etc/nginx/nginx.conf`
		* `nano /usr/local/etc/nginx/common/server.conf` OR `sublime /usr/local/etc/nginx/common/server.conf`
		* find all references to /Users/devonte/Documents/platform/platform and replace with path to your platform application
		* `sudo nginx -s reload`

	* Setup Private Hosts
		* `sudo nano /private/etc/hosts` OR `sudo sublime /private/etc/hosts`
		* Copy The text below into this file (one per line)

			127.0.0.1 platform.local.com
			127.0.0.1 platform.local.co.uk
			127.0.0.1 www.platform.local.com
			127.0.0.1 www.platform.local.co.uk

			127.0.0.1 app.platform.local.com
			127.0.0.1 app.platform.local.co.uk
			127.0.0.1 www.app.platform.local.com
			127.0.0.1 www.app.platform.local.co.uk

			127.0.0.1 intranet.platform.local.com
			127.0.0.1 intranet.platform.local.co.uk
			127.0.0.1 www.intranet.platform.local.com
			127.0.0.1 www.intranet.platform.local.co.uk

		* `dscacheutil -flushcache; sudo killall -HUP mDNSResponder`

	* test it works
		* `sudo nginx -s stop`
		* `kill -QUIT $( cat /usr/local/nginx/logs/nginx.pid )`
		* `sudo nginx`
		* You should see no errors on the console
		* Go to platform.local.com or intranet.platform.local.com and a site should load

### Starting Application
* Make sure postgres is started
* `bower install`
* `npm install`
* `npm run link`
* `npm run build`
* `npm start`

## Deployment
* Install Deployment tools
	* `pip install boto && pip install awscli && pip install awsebcli`
	* `aws configure`

#### Elastic Beanstalk Create
* `eb init`
* `eb create`
* `eb status --verbose`
* `eb deploy`

#### Elastic Beanstalk SSH
* `eb ssh --setup`
* `eb ssh`

#### Elastic Beanstalk Terminate
* `eb terminate`
* `eb terminate-all`

#### AWS Create Version
* `git tag -a <version-tag> -m "Deployment Tag"`
* `eb deploy`

#### How to deploy
* `npm run deploy`

#### Configuring Nginx / Application / Environment
* `npm run init-app`

#### Updating Application
* `npm run update-app`

### Deployment Files
* All files can be found in the .ebextensions directory
* files.config - holds the files we will be storing on the system i.e. nginx.conf
* packages.config - holds the commands we will run on elastic beanstalk before and after the application is retrieved
* settings.config - holds the settings we pass to set up the elastic beanstalk console
* services.config - holds the sysvinit settings we want to have the system run
* environment.config - holds environment variables like passwords and keys and should never be checked in to the repo

## Live Reload
* Website - Port: 39000, Nginx Incoming Port: N/A
* Intranet - Port: 38000, Nginx Incoming Port: 38100
* App - Port: 39000, Nginx Incoming Port: 39100
* API - Uses Nodemon
* To initiate live reloads (due to the fact we are using self signed certificates) you need to visit these urls
	* [Website Web Socket](https://platform.local.com:37100/livereload)
	* [App Web Socket](https://app.platform.local.com:39100/livereload)
	* [Intranet Web Socket](https://intranet.platform.local.com:38100/livereload)
