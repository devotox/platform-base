
## Global Variable

* Name of Application is the name attribute from package.json
* Change config/environment.js - modulePrefix when application name changed
* Name of Application i.e. "doctify" is attached to the window so you get window.Doctify

### Do Not Move - These are the entry points for your application
	app/app.js
	app/styles/app.scss
	app/routes/application.js
	app/templates/application.hbs
	app/controllers/application.js

## Install New Library

* Install using `[ npm or bower ] install <package_name>`
* Use library within app by adding to ember-cli-build.js - app.import('path/to/file');

## Simple Routes
	app/routes/search.js
	app/templates/search.hbs
	app/controllers/search.js

#### Create Routes
* add routes to router.js

#### Map Simple Route Example
	Router.map(function() {
		this.route('search');
	});


## Advanced Routes
* Route Template in a different folder that route of templates folder
* Add the folder name before the route i.e. path is `template/pages/index` -> this.route('pages/index', { path: '/index'})
* Corresponding Controllers & Routes have to also then be in the corresponding folder name i.e. `templates/pages/index` -> `controllers/pages/index`

#### Map Advanced Route Example
	Router.map(function() {
		this.route('pages/index', { path: '/' });
		this.route('pages/index', { path: '/index' });
	});

## Add Content For Hook
* Ember generate in-repo-addon <addon-name>
* In lib/<add-on-name>/index.js add a contentFor function

#### Add Content Example
	contentFor: function(type, config) {
		if(type != 'head') return;
		console.log(type, config);
	},

## Controllers
* All controllers for pages must have a property called pageName - this will allow it to be linked up in places like CSS

#### Controller Link Example
	HTML - <div data-page="<pageName>"></div>
	CSS - [data-page="<pageName>"]

## Update Head
* Document Head is created using a content-hook in ember-cli-inject-head
* Head Template - `app/templates/site-components/head/head.hbs`
* To add a new variable to the context - modify .ember-cli

## CSS
* Place all CSS files in app/styles - We will be using SASS so all files should end in .scss extension
* Do not move the app.scss file, place @import statements to modularize your css
* it would be best if app.scss only had import statements and is used to bootstrap the css

#### app.scss File Example
	//Global Styles & Variables
	@import 'site-components/global/variables';
	@import 'site-components/global/mixins';
	@import 'site-components/global/fonts';
	@import 'site-components/global/base';

	// Page Styles
	@import 'pages/home';
	@import 'pages/search';
	@import 'pages/terms-and-conditions';

## Global CSS
* Place global css styles in site-components/global/base.scss
* Place variables in site-components/global/variables.scss
* Place Fonts in site-components/global/fonts.scss

## Page CSS
* Place page css in `app/styles/pages/<page-template-name>` - this will keep our structure very similar to everything else in the app
* To target just a single page with the css - wrap up each page in a `<section data-page="{{pageName}}">` - which should be coming from the page controller
* In the css file wrap all the css in `[data-page="<pageName>"]` - this would allow just that page to get the css from this file

## Site-Component CSS
* Place site-component css in `app/styles/site-components/<site-component-template-name>` - this will keep our structure very similar to eeverything else in the app

## Mixins
* A mixin can be created using `ember generate mixn <mixin-name>
* A mixin was used to create the `afterRenderEvent` that can be used with views

#### Mixin Example
	import Ember from 'ember';

	export default Ember.Mixin.create({
		afterRenderEvent : Ember.K,

		// This hook is guaranteed to be executed
		// when the root element  of this view has been inserted into the DOM.

		didInsertElement : function(){
			this._super();
			Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
		}
	});

#### After Render Example
	import Ember from 'ember';

	import AfterRender from '../mixins/after-render';

	export default Ember.View.extend(AfterRender, {
		afterRenderEvent: function() {
			$('.button-collapse').sideNav();
		}
	});


## Session
* User is initialized in the setup-user initializer in app/initializers/setup-user.js
* We also use the Ember-cli-simple-auth session to manage sessions client side
* Further Reading -  [Simple Auth](http://ember-simple-auth.com/ember-simple-auth-api-docs.html)

#### To Protect a Route

	import Ember from 'ember';

	import ResetScroll from '../../mixins/reset-scroll';

	import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

	export default Ember.Route.extend(ResetScroll, AuthenticatedRouteMixin);

### To Add the correct authentication to the application
* Adds route actions to the session events
* app/routes/application.js

	import Ember from 'ember';

	import ResetScroll from '../mixins/reset-scroll';

	import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

	export default Ember.Route.extend(ResetScroll, ApplicationRouteMixin);
