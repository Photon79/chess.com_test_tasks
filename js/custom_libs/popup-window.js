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
				this.el = u.create('div');
				this.titleText = u.create('span');
				this.title = _opts.title;
				this.width = _opts.width;
				this.height = _opts.width;
				this.bgColor = _opts.bgColor;
				this.content = _opts.content;
				this.x = 0,
				this.y = 0;
				_popupCnt++;
				if (_opts.modal) {
					var tmp = _createOverlay();
					_overlay = (tmp) ? tmp : _overlay;
				}
				_init.call(this);
			}





			// prototype
			Constructor.prototype = {
				setTitle: function (title) {
					this.title = title;
					this.titleText.innerHTML = title;
					
				},
				close: function () {
					body.removeChild(this.el);
					_popupCnt--;
					if (_overlay && _popupCnt == 0) {
						body.removeChild(_overlay);
					}
					this.onClose && this.onClose.call(this);
				},
				toFront: function (e) {
					var popups = u.$('.popup');
					u.each(popups, function() {
						this.style.zIndex = '1001';
					});
					this.el.style.zIndex = '1002';
					e.preventDefault();
				}
			}

			// getters and setters
			Constructor.prototype.__defineSetter__('wTitle', function (title) {
				this.setTitle(title);
			});
			
/*
			Constructor.prototype.__defineSetter__('wWidth', function (width) {
				this.setWidth(width);
			});

			Constructor.prototype.__defineSetter__('wHeight', function (height) {
				this.setHeight(height);
			});
*/


			// private methods

			function _init() {
				var _self = this,
					title = u.create('div'),
					wrapper = u.create('div'),
					content = u.create('div'),
					close = u.create('a'),
					topResize = u.create('div'),
					leftResize = u.create('div'),
					rightResize = u.create('div'),
					bottomResize = u.create('div'),
					cornerResize = u.create('div'),
					screen = u.getScreenSize(),
					horMargin = Math.round((screen.width - this.width - 2) / 2),
					vertMargin = Math.round((screen.height - this.height - 2) / 2);
				this.el.className = 'popup';
				this.setTitle(this.title);
				u.bind(this.titleText, 'selectstart', function(e) { e.preventDefault(); });
				u.bind(this.titleText, 'mousedown', function(e) { e.preventDefault(); });
				title.appendChild(this.titleText);
				content.innerHTML = this.content;
				with(close) {
					className = 'close';
					appendChild(d.createTextNode('X'));
					href = 'javascript:void(0)';
				}
				u.css(this.el, {
					'width': this.width + 'px',
					'height': this.height + 'px',
					'top': vertMargin + 'px ',
					'left': horMargin + 'px',
					'border': '1px solid #000000',
					'position': 'absolute',
					'backgroundColor': this.bgColor,
					'zIndex': '1001',
					'borderTopLeftRadius': '20px',
					'borderTopRightRadius': '20px',
				});
				u.css(wrapper, {
					'position': 'relative'
				});
				u.css(content, {
					'padding': '10px',
					'overflow': 'auto'
				});
				u.css(title, {
					'overflow': 'hidden',
					'height': '50px',
					'lineHeight': '50px',
					'fontSize': '25px',
					'fontWeight': 'bold',
					'textAlign': 'center',
					'backgroundColor': '#F7B64B',
					'color': '#01AF0D',
					'cursor': 'move',
					'borderTopLeftRadius': '20px',
					'borderTopRightRadius': '20px',
					'borderBottom': '1px solid black'
				});
				u.css(this.titleText, {
					'display': 'block',
					'marginRight': '38px',
					'overflow': 'auto',
					'textOverflow': 'ellipsis'
				});
				u.css(close, {
					'position': 'absolute',
					'right': '10px',
					'top': '0px',
					'color': '#ffffff',
					'textDecoration': 'none'
				});
				u.css(topResize, {
					'width': '100%',
					'height': '4px',
					'display': 'block',
					'position': 'absolute',
					'cursor': 's-resize',
					'left': '0px',
					'top': '-2px'
				});
				u.css(bottomResize, {
					'width': '100%',
					'height': '4px',
					'display': 'block',
					'position': 'absolute',
					'cursor': 'n-resize',
					'bottom': '-2px',
					'left': '0px'
				});
				u.css(leftResize, {
					'width': '4px',
					'height': '100%',
					'display': 'block',
					'position': 'absolute',
					'cursor': 'e-resize',
					'left': '-2px',
					'top': '0px'
				});
				u.css(rightResize, {
					'width': '4px',
					'height': '100%',
					'display': 'block',
					'position': 'absolute',
					'cursor': 'w-resize',
					'right': '-2px',
					'top': '0px'
				});
				u.css(cornerResize, {
					'width': '20px',
					'height': '20px',
					'display': 'block',
					'position': 'absolute',
					'bottom': 0,
					'right': 0,
					'cursor': 'se-resize',
					'zIndex': 1003,
					'background': 'url(static/resize_corner.png) left top no-repeat'
				});
								
				title.appendChild(close);
				wrapper.appendChild(title);
				wrapper.appendChild(content);
				this.el.appendChild(topResize);
				this.el.appendChild(leftResize);
				this.el.appendChild(wrapper);
				this.el.appendChild(rightResize);
				this.el.appendChild(bottomResize);
				this.el.appendChild(cornerResize);
				/**
				 * Bind necessary events
				 */
				u.bind(close, 'click', function() { _self.close(); });
				u.bind(close, 'mouseover', function(e) { this.style.color = 'red'; });
				u.bind(close, 'mouseout', function(e) { this.style.color = 'white'; });
				u.bind(title, 'mousedown', function(e) { _checkDrag(e, _self); });
				u.bind(window, 'mouseup', function(e) { _stopDrag(); });
				u.bind(topResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'top'); });
				u.bind(bottomResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'bottom'); });
				u.bind(leftResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'left'); });
				u.bind(rightResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'right'); });
				u.bind(cornerResize, 'mousedown', function(e) { _resizeWrap(e, _self, 'corner'); });
				u.bind(this.el, 'click', function(e) { _self.toFront(e); })
				/**
				 * Insert popup window into DOM
				 */
				body.appendChild(this.el);
				this.contentObj = content;
				this.el.obj = this;
			}
			
			
			function _stopDrag() {
				var popups = u.$('.popup');
				u.enableSelection('body');
				u.unbind(window, 'mousemove');
				u.each(popups, function() {
					this.obj.dragState = false;
				});
			}
			
			
			function _checkDrag(e, obj) {
				var coords = u.mousePageXY(e);
				u.disableSelection('body');
				if(obj.dragState) {
					u.unbind(window, 'mousemove');
					obj.dragState = false;
				}
				else {
					obj.x = coords.x;
					obj.y = coords.y;
					u.bind(window, 'mousemove', function(e) {_drag(e, obj);});
					obj.dragState = true;
				}
			}
			
			
			function _resizeWrap(e, obj, type) {
				var popups = u.$('.popups');
				u.disableSelection('body');
				u.each(popups, function() {
					this.style.zIndex = 1001;
				});
				obj.el.style.zIndex = 1002;
				obj.dragX = u.mousePageXY(e).x;
				obj.dragY = u.mousePageXY(e).y;
				u.bind(window, 'mousemove', function(e) {
					_resize(e, obj, type);
				})
				u.bind(obj, 'mouseup', function() {
					u.unbind(window, 'mousemove');
				})
			}
			
			
			function _resize (e, obj, type) {
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
						if (width + stepX > 100) {
							obj.el.style.width = (width + stepX) + 'px';
							obj.width = width + stepX;
							obj.el.style.left = (left - stepX) + 'px';
						}
						break;
					case 'right':
						stepX = obj.dragX - coords.x;
						if (width - stepX > 100) {
							obj.el.style.width = (width - stepX) + 'px';
							obj.width = width - stepX;
						}
						break;
					case 'top':
						stepY = obj.dragY - coords.y;
						if (height + stepY > 150) { 
							obj.el.style.height = (height + stepY) + 'px';
							obj.height = height + stepY;
							obj.el.style.top = (top - stepY) + 'px';
						}
						break;
					case 'bottom':
						stepY = obj.dragY - coords.y;
						if (height - stepY > 150) {
							obj.el.style.height = (height - stepY) + 'px';
							obj.height = height - stepY;
						}
						break;
					case 'corner':
						stepX = obj.dragX - coords.x;
						if (width - stepX > 100) {
							obj.el.style.width = (width - stepX) + 'px';
							obj.width = width - stepX;
						}
						stepY = obj.dragY - coords.y;
						if (height - stepY > 150) {
							obj.el.style.height = (height - stepY) + 'px';
							obj.height = height - stepY;
						}
						break;
				}
				obj.contentObj.style.height = (obj.height - 70) + 'px';
				obj.dragX = coords.x;
				obj.dragY = coords.y;
				e.stopPropagation();
			}	
			
			
			function _drag (e, obj) {
				var coords = u.mousePageXY(e),
					maxW = 0,
					maxH = 0;
				maxW = Math.max(screen.width, screen.scrollX) - 10;
				maxH = Math.max(screen.height, screen.scrollY) - 10;
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
				
				
			function _createOverlay (options) {
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
			}	
	
					
					
						
		return new Constructor;

	}

})(window);







