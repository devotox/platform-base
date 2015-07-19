/*!
 * jQuery Extensions
 *
 * Copyright 2014 Devonte
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 *
 */
(function($, window) {
	'use strict';

	$.fn.extend({
		redraw: function() {
			$(this).each(function() {
				return this.offsetHeight;
			});
			return this;
		},
		passwordReveal: function() {
			var $this = $(this),
				namespace = '.passwordReveal',
				supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints,
				bind_event = ( supportsTouch ? 'tap' : 'click' ) + namespace;

			var open = 'fa-eye';
			var closed = 'fa-eye-slash';
			var classes = 'fa right password-reveal';

			var _class = function(_classes) {
				return [ classes, _classes ].join(' ');
			};

			var _title = function() {
				return 'toggle show / hide password';
			};

			var _style = function() {
				return {
					right: '0',
					top: '0.8em',
					zIndex: '9999',
					fontSize: '1.4em',
					cursor: 'pointer',
					position: 'absolute',
					marginRight: '0.75rem'
				};
			};

			var toggleEye = function($element, $icon, old_type) {
				var type = $element.attr('type');
				var default_type = 'password';
				var new_type = 'text';

				if(type === default_type) {
					$element.attr('type', new_type);
					$icon.addClass(open).removeClass(closed);
				} else {
					$element.attr('type', old_type);
					$icon.addClass(closed).removeClass(open);
				}
			};

			var icon = $('<i/>', {
				"class": _class(closed),
				"title": _title(),
			}).css( _style() );

			$this.each(function() {
				var $this = $(this);
				var $type = $this.attr('type');
				var $icon = icon.clone().bind(bind_event, function(e) {
					toggleEye($this, $icon, $type);
					e.stopImmediatePropagation();
					return false;
				});

				$icon.insertAfter($this);
			});

			return this;
		},
		materialForm: function(opts){
			var $this = $(this);

			opts = _.defaults({
				formatSubmit: 'yyyy-mm-dd',
				selectMonths: true,
				selectYears: 50,
				max: true
			}, opts || {});

			$this.find('select').material_select(opts);
			$this.find(':password').passwordReveal(opts);
			$this.find('input[type=date]').pickadate(opts);

			return this;
		},
		materializeNav: function() {

			var $this = $(this),
				$doc = $(document),
				namespace = '.materializeNav',
				$elem = $this.find('.material-design-hamburger__layer'),
				supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints,
				bind_event = ( supportsTouch ? 'tap' : 'click' ) + namespace,
				doc_bind_event = bind_event + ' swipeleft' + namespace;

			var docBind = function(do_bind) {
				if(!do_bind){ return $doc.unbind(namespace); }
				setTimeout(function(){ $doc.bind(doc_bind_event, arrow2icon); }, 0);
			};

			var icon2arrow = function() {
				$elem
					.removeClass('material-design-hamburger__icon--from-arrow')
					.addClass('material-design-hamburger__icon--to-arrow');
				docBind(true); return false;
			};

			var arrow2icon = function() {
				$elem
					.removeClass('material-design-hamburger__icon--to-arrow')
					.addClass('material-design-hamburger__icon--from-arrow');
				docBind(false); return false;
			};

			$this.bind(bind_event, function(e) {
				if ($elem.hasClass('material-design-hamburger__icon--to-arrow')) {
					arrow2icon();
				} else {
					icon2arrow();
				}
				return false;
			});

			return this;
		}
	});
}(window.jQuery, window));
