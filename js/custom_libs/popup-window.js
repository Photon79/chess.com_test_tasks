/**
 * Library for create Popup window 
 * @author Photon
 **/
(function (w) {

	// module's global vars
	var d = w.document,
		u = w.Utils,
	// static vars
		_overlay = null,
		_popupCnt = 0;

	// popup window class
	window.PopupWindow = function PopupWindow (options) {

			// private vars
			var _opts = options || {},
				_defaults = {
					width: 500,
					height: 500,
					bgColor: '#ffffff',
					title: 'Window',
					content: '',
					modal: false
				},
				screen = u.getScreenSize(),
				body = u.$$('body');

			// extend by defaults options
			for (var o in _defaults) {
				if (typeof(_defaults[o]) != "undefined" && typeof(_opts[o]) == "undefined") {
					_opts[o] = _defaults[o];
				}
			}

			// class constructor
			var Constructor = function () {
				this.dragState = false;
				this.el = d.createElement('div');
				this.title = _opts.title;
				this.width = _opts.width;
				this.height = _opts.width;
				this.bgColor = _opts.bgColor;
				this.content = _opts.content;
				this.x = 0,
				this.y = 0;
				_popupCnt++;
				if (_opts.modal) {
					var tmp = this.createOverlay();
					_overlay = (tmp)?tmp:_overlay;
				}
				_init.call(this);
			}

			// getters and setters
			Constructor.prototype.__defineSetter__('title', function (title) {
				this.setTitle(title);
			});

			Constructor.prototype.__defineSetter__('width', function (width) {
				this.setWidth(width);
			});

			Constructor.prototype.__defineSetter__('height', function (height) {
				this.setHeight(height);
			});

			// prototype
			Constructor.prototype = {
				createOverlay: function(options) {
					if (!_overlay) {
						var overlay = d.createElement('div'),
							_opts = options || {},
							_defaults = {
								overlayColor: '#000000',
								opacity: 0.8
							};
						for (var o in _defaults) {
							if (_defaults[o] && !_opts[o]) {
								_opts[o] = _defaults[o];
							}
						}
						body.style.position = 'relative';
						body.style.zIndex = 1;
						with(overlay.style) {
							width = '100%';
							height = '100%';
							backgroundColor = _opts.overlayColor;
							opacity = _opts.opacity;
							position = 'absolute';
							left = 0;
							top = 0;
							zIndex = 1000;
						}
						body.appendChild(overlay);
						return overlay;
					}
					return false;
				},
				setTitle: function (title) {
					this.title = title;
				},
				resize: function(e, obj, type) {
					var left = parseInt(obj.el.style.left),
						top = parseInt(obj.el.style.top),
						right = left + obj.width + 2,
						bottom = top + obj.height + 2,
						width = parseInt(obj.el.style.width),
						height = parseInt(obj.el.style.height),
						coords = u.mousePageXY(e);
					switch(type) {
						case 'left':
							stepX = obj.dragX - coords.x;
							if (width + stepX > 50) {
								obj.el.style.width = (width + stepX) + 'px';
								obj.width = width + stepX;
								obj.el.style.left = (left - stepX) + 'px';
							}
							break;
						case 'right':
							stepX = obj.dragX - coords.x;
							if (width - stepX > 50) {
								obj.el.style.width = (width - stepX) + 'px';
								obj.width = width - stepX;
							}
							break;
						case 'top':
							stepY = obj.dragY - coords.y;
							if (height + stepY > 54) { 
								obj.el.style.height = (height + stepY) + 'px';
								obj.height = height + stepY;
								obj.el.style.top = (top - stepY) + 'px';
							}
							break;
						case 'bottom':
							stepY = obj.dragY - coords.y;
							if (height - stepY > 54) {
								obj.el.style.height = (height - stepY) + 'px';
								obj.height = height - stepY;
							}
							break;
					}
					obj.dragX = coords.x;
					obj.dragY = coords.y;
					e.stopPropagation();
				},
				close: function (obj) {
					body.removeChild(obj.el);
					_popupCnt--;
					if (_overlay && _popupCnt == 0) {
						body.removeChild(_overlay);
					}
				},
				drag: function(e, obj) {
					var coords = u.mousePageXY(e),
						maxW = 0,
						maxH = 0;
					maxW = Math.max(screen.width, screen.scrollX);
					maxH = Math.max(screen.height, screen.scrollY);
					if (coords.x != obj.x || coords.y != obj.y) {
						stepX = coords.x - obj.x;
						stepY = coords.y - obj.y;
						l = (parseInt(obj.el.style.left) + stepX);
						t = (parseInt(obj.el.style.top) + stepY);
						if (l + obj.width + 2 > maxW) {
							l = maxW - obj.width - 2;
						}
						else if (l < 0) {
							l = 0;
						}
						if (t + obj.height + 2 > maxH) {
							t = maxH - obj.height - 2;
						}
						else if (t < 0) {
							t = 0;
						}
						with(obj.el.style) {
							left = l + 'px';
							top = t + 'px';
						}
						obj.x = coords.x;
						obj.y = coords.y;
					}
					e.stopPropagation();
				}
			}

			// private methods

			function _init() {
				var _self = this,
					title = u.create('div'),
					titleText = u.create('span'),
					wrapper = u.create('div'),
					content = u.create('div'),
					close = u.create('a'),
					topResize = u.create('div'),
					leftResize = u.create('div'),
					rightResize = u.create('div'),
					bottomResize = u.create('div'),
					screen = u.getScreenSize(),
					horMargin = Math.round((screen.width - this.width - 2) / 2),
					vertMargin = Math.round((screen.height - this.height - 2) / 2);

				// TODO: css with "-" symbol
				with(this.el) {
					style.width = this.width + 'px';
					style.height = this.height + 'px';
					style.top = vertMargin + 'px ';
					style.left = horMargin + 'px';
					style.border = '1px solid #000000';
					style.display = 'block';
					style.position = 'absolute';
					style.backgroundColor = this.bgColor;
					style.zIndex = 1001;
					className = 'popup';
					padding = '2px';
				}
				with(title) {
					style.position = 'relative';
					style.top = '2px';
					style.left = 0;
					style.width = '100%';
					style.height = '50px';
					style.lineHeight = '50px';
					style.fontSize = '25px';
					style.fontWeight = 'bold';
					style.textAlign = 'center';
					style.backgroundColor = '#bababa';
					style.color = '#ffffff';
					style.borderBottom = '2px #ffffff solid';
					style.cursor = 'move';
				}
				titleText.appendChild(d.createTextNode(this.title));
				u.bind(titleText, 'selectstart', function(e) { e.preventDefault(); });
				u.bind(titleText, 'mousedown', function(e) { e.preventDefault(); });
				title.appendChild(titleText);
				with(close) {
					style.position = 'absolute';
					style.right = '10px';
					style.top = 0;
					style.color = '#ffffff';
					className = 'close';
					appendChild(d.createTextNode('X'));
					href = 'javascript:void(0)';
					style.textDecoration = 'none';
				}
				with(content) {
					style.margin = '10px';
					style.cssFloat = 'left';
					style.position = 'relative';
				}
				content.innerHTML = this.content;
				title.appendChild(close);
				u.css(topResize, {
					width: '100%',
					height: '4px',
					display: 'block',
					position: 'absolute',
					cursor: 's-resize',
					left: 0,
					top: '-2px'
				});
				u.css(bottomResize, {
					width: '100%',
					height: '4px',
					display: 'block',
					position: 'absolute',
					cursor: 'n-resize',
					bottom: '-2px',
					left: 0
				});
				u.css(leftResize, {
					width: '4px',
					height: '100%',
					display: 'block',
					position: 'absolute',
					cursor: 'e-resize',
					left: '-2px',
					top: 0
				});
				u.css(rightResize, {
					width: '4px',
					height: '100%',
					display: 'block',
					position: 'absolute',
					cursor: 'w-resize',
					right: '-2px',
					top: 0
				})
				u.css(wrapper, {
					width: '100%',
					height: '100%',
					cssFloat: 'left'
				});
				wrapper.appendChild(title);
				wrapper.appendChild(content);
				
				this.el.appendChild(topResize);
				this.el.appendChild(leftResize);
				this.el.appendChild(wrapper);
				this.el.appendChild(rightResize);
				this.el.appendChild(bottomResize);
				/**
				 * Bind necessary events
				 */
				u.bind(close, 'click', function() { _self.close(_self); });
				u.bind(title, 'mousedown', function(e) { _checkDrag(e, _self); });
				u.bind(window, 'mouseup', function(e) { _stopDrag(); });
				u.bind(topResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'top'); });
				u.bind(bottomResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'bottom'); });
				u.bind(leftResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'left'); });
				u.bind(rightResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'right'); });
				/**
				 * Insert popup window into DOM
				 */
				body.appendChild(this.el);
				this.el.obj = this;
			}
			function _stopDrag() {
				var popups = u.$('.popup');
				u.unbind(window, 'mousemove');
				u.each(popups, function() {
					this.obj.dragState = false;
				});
			}
			function _checkDrag(e, obj) {
				var popups = u.$('.popup'),
					coords = u.mousePageXY(e);
				u.each(popups, function() {
					this.style.zIndex = 1001;
				});
				obj.el.style.zIndex = 1002;
				if(obj.dragState) {
					u.unbind(window, 'mousemove');
					obj.dragState = false;
				}
				else {
					obj.x = coords.x;
					obj.y = coords.y;
					u.bind(window, 'mousemove', function(e) {obj.drag(e, obj);});
					obj.dragState = true;
				}
			}
			function _resizeWrap(e, obj, type) {
				var popups = u.$('.popups');
				u.each(popups, function() {
					this.style.zIndex = 1001;
				});
				obj.el.style.zIndex = 1002;
				obj.dragX = u.mousePageXY(e).x;
				obj.dragY = u.mousePageXY(e).y;
				u.bind(window, 'mousemove', function(e) {
					obj.resize(e, obj, type);
				})
				u.bind(obj, 'mouseup', function() {
					u.unbind(window, 'mousemove');
				})
			}
			
			return new Constructor;

		}

})(window);







