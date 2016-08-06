/**
 * Ember select component
 * due to deprecation of view 'select' http://emberjs.com/deprecations/v1.x/#toc_ember-select
 * 20 November 2015
 * This dropdown supports single selections as well as multiple sections. See example usage below.
	 single item selection example
	 {{
		dropdown-list
		content=myDataList
		optionValuePath="content.id"
		optionLabelPath="content.label"
		value=myAwesomeValue
		action="myChangeAction"
		prompt="Choose your poison"
	}}
	multiple item selection example
	{{
		dropdown-list
		content=myDataList
		optionValuePath="content.id"
		optionLabelPath="content.label"
		value=myAwesomeValues
		multiple=true
		class="chosen-select"
		action="myChangeAction"
		prompt="Choose your poison"
	}}
	content: Array<object>
	optionValuePath: string denoting the path to an item in the content array to use when updating the value property (see below for information on value)
	optionLabelPath: string denoting the path to an item in the content array to use as a nice string to render in the list item
	value: object that should be updated with the selected value in the dropdown list. The actual value set is dependent on the optionValuePath
	multiple: boolean value denoting whether multiple items in the list can be selected. Default is false.
	class: string that should be used as class name for the select element
	prompt: optional string to display on the top of the dropdown list when nothing is selected
	action: name of function to invoke when the selected option changes
 */
import Ember from 'ember';

export default Ember.Component.extend({
	content: null,
	selectedValue: null,
	setAttrs: function(){
		let content = (this.get('content') || []).slice();

		//get the label path if there is any if not default to '' which just takes the object
		let labelPath = this.get('optionLabelPath');
		if (labelPath && labelPath.indexOf('content.') === 0) {
			labelPath = labelPath.replace('content.', '');
		}

		let valuePath = this.get('optionValuePath') || '';
		if (valuePath && valuePath.indexOf('content.') === 0) {
			valuePath = valuePath.replace('content.', '');
		}

		//if for some reason the user has not supplied a valuePath or a labelPath show warning
		//map the data to have an id and a label property essentially of the same values
		if (!valuePath || !labelPath) {
			valuePath = valuePath || 'id';
			labelPath = labelPath || 'label';

			content = content.map( item => {
				let value = valuePath === 'content' ? item : Ember.get(item, valuePath),
					label = labelPath === 'content' ? item : Ember.get(item, labelPath);

				return { id: value, label:label };
			});
			valuePath = 'id';
			labelPath = 'label';
			content = content.map((item) => { return { id: item, label: item }; });
			Ember.Logger.warn('You have not set the optionValuePath and the optionLabelPath for the dropdown-list component');
		}

		//get the prompt text if any otherwise set a default
		let prompt = this.get('prompt');

		//prepend the content with the prompt text
		if(prompt) {
			content.unshift({[valuePath]: '', [labelPath]: prompt});
		}

		this.set('labelPath', labelPath);
		this.set('valuePath', valuePath);
		this.set('contentCopy', content);
	},
	init() {
		this._super(...arguments);
		this.setAttrs();
	},
	didUpdateAttrs() {
		this._super(...arguments);
		this.setAttrs();
	},
	change(event) {
		const content = this.get('contentCopy');
		const action = this.get('action');
		let valuePath = this.get('optionValuePath') || '';
		if (valuePath) {
			if (valuePath === 'content') {
				valuePath = '';
			} else if (valuePath.indexOf('content.') === 0) {
				valuePath = valuePath.replace('content.', '');
			}
		}

		let selectedOptions = Object.keys([].slice.call(event.target.selectedOptions))
			.map(key => {
				let option = event.target.selectedOptions[key];
				let optionValue = content[option.getAttribute('data-index')];
				return Ember.get(optionValue, valuePath);
			});

		const selectedValues = content.filter(option => {
			return selectedOptions.indexOf(Ember.get(option, valuePath)) > -1;
		}).map(value => {
			return Ember.get(value, valuePath);
		});

		if (!this.attrs.multiple) {
			this.attrs.value.update(selectedValues[0]);
		} else {
			this.attrs.value.update(selectedValues);
		}

		if (action) {
			this.sendAction('action', selectedValues);
		}
	}
});
