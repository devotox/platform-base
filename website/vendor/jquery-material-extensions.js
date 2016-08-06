(function ($, window, undefined) {

	var methods = {
		init : function(options) {
			var defaults = {
				edge: 'left',
				menuWidth: 300,
				closeOnClick: true
			};

			options = $.extend(defaults, options);

			$(this).each(function(){
				var $this = $(this);
				var menu_id = $("#"+ $this.attr('data-activates'));

				// Set to width
				if (options.menuWidth !== 240) {
					menu_id.css('width', options.menuWidth);
				}

				// Add Touch Area
				var dragTarget = $('<div class="drag-target"></div>');
				$('body').append(dragTarget);

				if (options.edge === 'left') {
					menu_id.css('transform', 'translateX(-100%)');
					dragTarget.css({'left': 0}); // Add Touch Area
				}
				else {
					menu_id.addClass('right-aligned') // Change text-alignment to right
						.css('transform', 'translateX(100%)');
					dragTarget.css({'right': 0}); // Add Touch Area
				}

				// If fixed sidenav, bring menu out
				if (menu_id.hasClass('fixed')) {
					if (window.innerWidth > 992) {
						menu_id.css('transform', 'translateX(0)');
					}
				}

				// Window resize to reset on large screens fixed
				if (menu_id.hasClass('fixed')) {
					$(window).resize( function() {
						if (window.innerWidth > 992) {
							// Close menu if window is resized bigger than 992 and user has fixed sidenav
							if ($('#sidenav-overlay').css('opacity') !== 0 && menuOut) {
								removeMenu(true);
							}
							else {
								menu_id.css('transform', 'translateX(0%)');
							}
						}
						else if (menuOut === false) {
							if (options.edge === 'left'){
								menu_id.css('transform', 'translateX(-100%)');
							}
							else {
								menu_id.css('transform', 'translateX(100%)');
							}
						}

					});
				}

				// if closeOnClick, then add close event for all a tags in side sideNav
				if (options.closeOnClick === true) {
					menu_id.on("click.itemclick", "a:not(.collapsible-header)", function(){
						removeMenu();
					});
				}

				function icon2arrow() {
					$this.find('.material-design-hamburger__layer')
						.removeClass('material-design-hamburger__icon--from-arrow')
						.addClass('material-design-hamburger__icon--to-arrow')
						.redraw();
				}

				function arrow2icon() {
					$this.find('.material-design-hamburger__layer')
						.removeClass('material-design-hamburger__icon--to-arrow')
						.addClass('material-design-hamburger__icon--from-arrow')
						.redraw();
				}

				function removeMenu(restoreNav) {
					panning = false;
					menuOut = false;
					arrow2icon();

					$('body').css({
						overflow: '',
						width: ''
					});

					$('#sidenav-overlay').velocity({
						opacity: 0
					}, {
						queue: false,
						duration: 200,
						easing: 'easeOutQuad',
						complete: function() {
							$(this).remove();
						}
					});

					if (options.edge === 'left') {
						// Reset phantom div
						dragTarget.css({width: '', right: '', left: '0'});
						menu_id.velocity(
							{ 	translateX: '-100%'},
							{ 	duration: 200,
								queue: false,
								easing: 'easeOutCubic',
								complete: function() {
									if (restoreNav === true) {
										// Restore Fixed sidenav
										menu_id.removeAttr('style');
										menu_id.css('width', options.menuWidth);
									}
								}

						});
					}
					else {
						// Reset phantom div
						dragTarget.css({width: '', right: '0', left: ''});
						menu_id.velocity(
							{ 	translateX: '-100%'},
							{ 	queue: false,
								duration: 200,
								easing: 'easeOutCubic',
								complete: function() {
									if (restoreNav === true) {
										// Restore Fixed sidenav
										menu_id.removeAttr('style');
										menu_id.css('width', options.menuWidth);
									}
								}
							}
						);
					}
				}

				// Touch Event
				var panning = false;
				var menuOut = false;

				dragTarget.on('click', function(){
					if (menuOut) {
						removeMenu();
					}
				});

				dragTarget.hammer({
					prevent_default: false
				}).bind('pan', function(e) {

					if (e.gesture.pointerType === "touch") {
						var x = e.gesture.center.x;
						icon2arrow();

						// Disable Scrolling
						var $body = $('body');
						var oldWidth = $body.innerWidth();
						$body.css('overflow', 'hidden');
						$body.width(oldWidth);

						// If overlay does not exist, create one and if it is clicked, close menu
						if ($('#sidenav-overlay').length === 0) {
							var overlay = $('<div id="sidenav-overlay"></div>');
							overlay.css('opacity', 0).click( function(){
								removeMenu();
							});
							$('body').append(overlay);
						}

						// Keep within boundaries
						if (options.edge === 'left') {
							if (x > options.menuWidth) { x = options.menuWidth; }
							else if (x < 0) { x = 0; }
						}

						if (options.edge === 'left') {
							// Left Direction
							if (x < (options.menuWidth / 2)) { menuOut = false; }
							// Right Direction
							else if (x >= (options.menuWidth / 2)) { menuOut = true; }

							menu_id.css('transform', 'translateX(' + (x - options.menuWidth) + 'px)');
						}
						else {
							// Left Direction
							if (x < (window.innerWidth - options.menuWidth / 2)) {
								menuOut = true;
							}
							// Right Direction
							else if (x >= (window.innerWidth - options.menuWidth / 2)) {
								menuOut = false;
							}
							var rightPos = (x - options.menuWidth / 2);
							if (rightPos < 0) {
								rightPos = 0;
							}

							menu_id.css('transform', 'translateX(' + rightPos + 'px)');
						}

						// Percentage overlay
						var overlayPerc = null;
						if (options.edge === 'left') {
							overlayPerc = x / options.menuWidth;
							$('#sidenav-overlay').velocity({
								opacity: overlayPerc
							}, {
								queue: false,
								duration: 50,
								easing: 'easeOutQuad'
							});
						}
						else {
							overlayPerc = Math.abs((x - window.innerWidth) / options.menuWidth);
							$('#sidenav-overlay').velocity({
								opacity: overlayPerc
							}, {
								queue: false,
								duration: 10,
								easing: 'easeOutQuad'
							});
						}
					}

				}).bind('panend', function(e) {
					if (e.gesture.pointerType === "touch") {
						var velocityX = e.gesture.velocityX;
						var x = e.gesture.center.x;
						var leftPos = x - options.menuWidth;
						var rightPos = x - options.menuWidth / 2;
						if (leftPos > 0 ) {
							leftPos = 0;
						}
						if (rightPos < 0) {
							rightPos = 0;
						}

						panning = false;
						if (options.edge === 'left') {
							// If velocityX <= 0.3 then the user is flinging the menu closed so ignore menuOut
							if ((menuOut && velocityX <= 0.3) || velocityX < -0.5) {

								if (leftPos !== 0) {
									menu_id.velocity({
										'translateX': [0, leftPos]
									}, {
										queue: false,
										duration: 300,
										easing: 'easeOutQuad'
									});
								}

								$('#sidenav-overlay').velocity({
									opacity: 1
								}, {
									duration: 50,
									queue: false,
									easing: 'easeOutQuad'
								});
								dragTarget.css({
									width: '50%',
									right: 0,
									left: ''
								});
								menuOut = true;
							}
							else if (!menuOut || velocityX > 0.3) {
								// Enable Scrolling
								$('body').css({
									overflow: '',
									width: ''
								});
								// Slide menu closed
								menu_id.velocity({
									'translateX': [-1 * options.menuWidth - 10, leftPos]
								}, {
									duration: 200,
									queue: false,
									easing: 'easeOutQuad'
								});
								$('#sidenav-overlay').velocity({
									opacity: 0
								}, {
									duration: 200,
									queue: false,
									easing: 'easeOutQuad',
									  complete: function () {
										$(this).remove();
									}
								});
								dragTarget.css({width: '10px', right: '', left: 0});
							}
						}
						else {
							  if ((menuOut && velocityX >= -0.3) || velocityX > 0.5) {
								// Return menu to open
								if (rightPos !== 0) {
									  menu_id.velocity({
										'translateX': [0, rightPos]
									}, {
										duration: 300,
										queue: false,
										easing: 'easeOutQuad'
									});
								}

								$('#sidenav-overlay').velocity({
									opacity: 1
								}, {
									duration: 50, queue: false, easing: 'easeOutQuad'
								});
								dragTarget.css({
									width: '50%',
									right: '',
									left: 0
								});
								menuOut = true;
							  }
							else if (!menuOut || velocityX < -0.3) {
								// Enable Scrolling
								$('body').css({
									overflow: '',
									width: ''
								});

								// Slide menu closed
								menu_id.velocity({
									'translateX': [options.menuWidth + 10, rightPos]
								}, {
									duration: 200,
									queue: false,
									easing: 'easeOutQuad'
								});
								$('#sidenav-overlay').velocity({
									opacity: 0
								}, {
									duration: 200,
									queue: false,
									easing: 'easeOutQuad',
									complete: function () {
										$(this).remove();
									}
								});
								dragTarget.css({width: '10px', right: 0, left: ''});
							}
						}
					}
				});

				$this.click(function() {
					if (menuOut === true) {
						menuOut = false;
						panning = false;
						removeMenu();
					}
					else {
						icon2arrow();

						// Disable Scrolling
						var $body = $('body');
						var oldWidth = $body.innerWidth();
						$body.css('overflow', 'hidden');
						$body.width(oldWidth);

						// Push current drag target on top of DOM tree
						$('body').append(dragTarget);

						if (options.edge === 'left') {
							dragTarget.css({
								width: '50%',
								right: 0,
								left: ''
							});
							menu_id.velocity({
								'translateX': [0, -1 * options.menuWidth]
							}, {
								duration: 300, queue: false, easing: 'easeOutQuad'
							});
						}
						else {
							dragTarget.css({
								width: '50%',
								right: '',
								left: 0
							});
							menu_id.velocity({
								'translateX': [0, options.menuWidth]
							}, {
								duration: 300,
								queue: false,
								easing: 'easeOutQuad'
							});
						}

						var overlay = $('<div id="sidenav-overlay"></div>');
						overlay.css('opacity', 0)
						.click(function(){
							menuOut = false;
							panning = false;
							removeMenu();
							overlay.velocity({
								opacity: 0
							}, {
								duration: 300,
								queue: false,
								easing: 'easeOutQuad',
								complete: function() {
									$(this).remove();
								}
							});

						});
						$('body').append(overlay);
						overlay.velocity({
							opacity: 1
						}, {
							duration: 300,
							queue: false,
							easing: 'easeOutQuad',
							complete: function () {
								menuOut = true;
								panning = false;
							}
						});
					}

					return false;
				});

			});
		},
		show : function() {
			this.trigger('click');
		},
		hide : function() {
			$('#sidenav-overlay').trigger('click');
		}
	};

	$.fn.materialSideNav = function(methodOrOptions) {
		if ( methods[methodOrOptions] ) {
			return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
			// Default to "init"
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
		}
	}; // PLugin end
})( window.jQuery, window );

(function ($, window, undefined) {
	'use strict';

	$.fn.extend({
		selectText: function() {
			var range, selection;
			return this.each(function() {
				if (document.body.createTextRange) {
					range = document.body.createTextRange();
					range.moveToElementText(this);
					range.select();
				} else if (window.getSelection) {
					selection = window.getSelection();
					range = document.createRange();
					range.selectNodeContents(this);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			});
		},
		redraw: function() {
			$(this).each(function() {
				var $elem = $(this).parent();
				var display = $elem.css('display');
				$elem.css({ display: 'none' });
				setTimeout(function(){
					$elem.css({ display: display });
				}, 0);
			});
			return this;
		},
		passwordReveal: function() {
			var $this = $(this),
				namespace = '.passwordReveal',
				supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints,
				bind_event = ( supportsTouch ? 'touchstart' : 'click' ) + namespace;

			var open = 'fa-eye';
			var closed = 'fa-eye-slash';
			var classes = 'fa right password-reveal';

			var _class = function(_classes) {
				return [ classes, _classes ].join(' ');
			};

			var _style = function() {
				return {
					right: '0',
					zIndex: '1',
					top: '0.8em',
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
				"class": _class(closed)
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
		materialFAB: function() {
			var $this = $(this);

			$this.each(function() {
				var $fab = $(this);
				$fab.bind('touchend.fab', function(e){
					e.stopImmediatePropagation();
					var isActive = $fab.hasClass('active');

					if(!isActive) { $fab.openFAB(); }
					else { setTimeout($fab.closeFAB, 0); }
				});
			});

			return this;
		},
		materialForm: function(opts){
			var $this = $(this);

			opts = Object.assign({
				formatSubmit: 'yyyy-mm-dd',
				selectMonths: true,
				selectYears: 50,
				max: true
			}, opts || {});

			$this.find(':password').passwordReveal(opts);
			$this.find('input[type=date]').pickadate(opts);
			$this.find('select').material_select(opts.callback);

			return this;
		},
		materialNav: function() {

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

			$this.bind(bind_event, function() {
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
})(window.jQuery, window);
