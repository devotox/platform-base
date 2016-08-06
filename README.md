# Platform Base

### Main Components
* Ember / Docker / Nginx / Loopback

### Prerequisites
You will need the following things properly installed on your computer.

* [GIT](http://git-scm.com/)
* [Homebrew](http://brew.sh//)

### Code Generators
* Make use of the many generators for code, try `ember help generate` for more details

### Further Reading / Useful Links
* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
	* [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
	* [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

### Common Dev Practices
* Refer to [Best Practices File](BEST-PRACTICES.md)

### Setting up Dev Environment (Mac)
* Refer to [Docker Readme File](DOCKER-README.md)

### Deployment
* Refer to [Deployment File](DEPLOYMENT.md)

### Live Reload
* Website - Port: 39000, Nginx Incoming Port: 39100
* Intranet - Port: 38000, Nginx Incoming Port: 38100
* App - Port: 37000, Nginx Incoming Port: 37100
* API - Uses Nodemon
* Nginx - Nginx-Watch
* To initiate live reloads (due to the fact we are using self signed certificates) you need to visit these urls
	* [Website Web Socket](https://platform.local.com:39100/livereload)
	* [App Web Socket](https://app.platform.local.com:37100/livereload)
	* [Intranet Web Socket](https://intranet.platform.local.com:38100/livereload)
