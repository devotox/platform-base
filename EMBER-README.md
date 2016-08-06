# Platform Ember / Ember-Data

### References
	1. [Ember Guides](https://guides.emberjs.com/v2.4.0/)
	2. [Ember Common Mistakes](https://www.toptal.com/emberjs/the-8-most-common-ember-js-developer-mistakes)
	3. [Controllers are singletons](http://balinterdi.com/2014/06/26/ember-gotcha-controllers-are-singletons.html)
	4. [Many To Many Relationsips](http://stackoverflow.com/a/9790225/1608456)


### Gotchas
	* when you run setupController you should start with `this._super(controller, model)`
	* Limit controller usage - Put actions on routes set controller properties from route in setupController
	* Use components for all UI elements
	* Use mixins as much as possible to combine repetitive actions
	* Ember.K is similar to noop and just returns `this`
	* In nested routes to create a model that the all the routes use you will need to do something like
	* Using JSON API and having relationships will allow the Ember model to lazy load anything within the relationships object using the link attribute it provides
	- app/routes
		- language.js
		- language (folder)
			- topics.js
			- index.js
			- topics (folder)
				- topic.js
				- index.js
				- topic (folder)


### Models
	* `this.store.findAll(modelName)` gets the list of the model
	* `this.store.find(modelName, modelID)` gets the specific ID of model
	* `this.store.query(modelName, querystring_object)` gets the list of the model and passes a querystring along with it
	* Do not use data as a key in model
	* A model file name should be the singular version of its api endpoint
		- i.e. Model Name: post API name: posts
	* A model object does not have the ID key as part of the model this is implicit
	* All models from the API should have some kind of ID associated with it that is returned in the API
	* API Requests for the GETS need to return an object with the key being the plural version of the model
		- i.e. { posts: [ array of post data ] }

	* Model Name Is usually the singular version of the api call but if needed to override using a serializer this way will return the exact request as the model name
	```
		import DS from 'ember-data';

		export default DS.RESTSerializer.extend({
			modelNameFromPayloadKey(payloadKey) {
				return payloadKey;
			}
		});
	```
	* If the attribute of a model is similar between 2 models and you need to use the attribute as a route parameter it is best if you use a serializer and change the attribute name
	```
		import DS from 'ember-data';

		export default DS.JSONAPISerializer.extend({
			attrs: {
				"topic_slug": "slug"
			}
		});
	```

### New Model/DB Rules
	* The name of the column you bring out of the db will be the name of the key in the model - we will not allow switching of the names as it helps with debugging when the names are the same all through the application

### Pace
	* Update all index.html scripts with `pace-src` i.e. `<script pace-src="assets/vendor.js"></script>`
	* Update configuration in environment.js file `https://github.com/vectart/ember-cli-pace`
