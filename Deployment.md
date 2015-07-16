## Ngrok
* Used to create a tunnel to your local machine
* Can make testing on mobile a lot easier
* You can share the link with others to get instant feedback
* `ngrok http --subdomain=doctify 8081`
* Site - http://doctify.ngrok.io
* Server Requests - localhost:4040

## Cordova App
* we use ember-cli-cordova and npm module cordova installed globally
* Install Xcode (Run it at least once to answer yes to some stuff)
* Install JRE (Java Runtime Environment) & JDK (Java Development Kit)
* cd /cordova; cordova platform add ios; cordova platform add android

#### Installing Android SDK
* Download Android SDK Tools
* Then run /path/to/android/sdk (wherever you downloaded it to)
* Scroll to the bottom of the SDK manager and add to the already selected files (HAXM from intel)
* /path/to/android/sdk avd
* Click on device definitions
* Click on existing definition and then create AVD
* Add remaining parameters
* do not use host gpu
* set cpu to intel atom x86

### Android
* `brew install android-sdk`

#### IOS
* `npm install -g ios-deploy`
* `npm install -g ios-sim`

### Build App
* `ember cordova:build --environment=production --platform=android`
* `ember cordova:build --environment=production --platform=ios`

## Run App
* `ember cordova emulate  --platform android`
* `ember cordova emulate  --platform ios`
* `ember cordova run android`
* `ember cordova run ios`

## Sign App
* `keytool -genkey -v -keystore <appname>.keystore -alias <appname> -keyalg RSA -keysize 2048 -validity 10000`
* `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <appname>.keystore android-release-unsigned.apk <appname>`
* `zipalign -v 4 android-release-unsigned.apk <appname>.apk`

## Remote Debugging
* we use ember-cli-remote-inspector
* Visit localhost:30820 to open up the inspector
* Visit localhost:8081 from another browser.

## Heroku Deployment
* READ FOR OPTIONS: [Heroku Buildpack](https://github.com/tonycoco/heroku-buildpack-ember-cli)
* `heroku create doctify --buildpack https://github.com/tonycoco/heroku-buildpack-ember-cli.git`
* `git commit -am "Empty commit for Heroku deployment" --allow-empty`
* `git push heroku master`

### Ensure Running
* `heroku ps:scale web=1`
* `heroku ps`
* `heroku open`
* `heroku logs --tail`
* Run Heroku commands - heroku run i.e. (heroku run node)

### Addons
* `heroku addons:create papertrail`
* `heroku addons:create heroku-postgresql:hobby-dev`
* `heroku config:set Variable=2 - Set config vars`

#### Heroku Terminate
* `heroku apps:destroy <app-name> --confirm <app-name>`

### Multiple Environments
* https://devcenter.heroku.com/articles/multiple-environments
* heroku domains:add <custom-url> i.e. heroku domains:add example.com

#### Sample DB
	var pg = require('pg');

	app.get('/db', function (request, response) {
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test_table', function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { response.send(result.rows); }
		});
	  });
	})


## More Deployments

#### Azure
* `npm install -g ember-cli-azure-deploy`
* `azure-deploy init`

#### Firebase
* `npm install -g firebase-tools`
* `firebase init`
* `firebase deploy`
* `firebase open`

#### Firebase Terminate
* `firebase delete-site`

#### Elastic Beanstalk
* `eb init`
* `eb create`
* `eb status --verbose`
* `eb deploy`

#### Elastic Beanstalk Terminate
* `eb terminate`
* `eb terminate-all`




## Full Android build (Devonte)
* ember cordova:build --environment=production --platform=android; rm -rf ~/Downloads/android-release-unsigned.apk; cp /Users/devonte/Documents/Doctify/platform/app/cordova/platforms/android/build/outputs/apk/android-release-unsigned.apk ~/Downloads/android-release-unsigned.apk; cd ~/Downloads; rm -rf doctify.apk;

* keytool -genkey -v -keystore doctify.keystore -alias doctify -keyalg RSA -keysize 2048 -validity 10000;
* passphrase: doctify

* jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore doctify.keystore android-release-unsigned.apk doctify; zipalign -v 4 android-release-unsigned.apk doctify.apk

* adb install apk doctify.apk or adb push doctify.apk /sdcard/Download or mv doctify.apk ~/Dropbox then manually install




## Full IOS build (Devonte)
* ember cordova:build --environment=production --platform=ios;
* ember cordova emulate  --platform ios
