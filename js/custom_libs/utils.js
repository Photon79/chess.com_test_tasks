/*
 *  Depends on event.js
 **/
window.Utils = (function (w) {

	var d = w.document,
		Event = w.Event;

	if (Event == null) {
		throw "utils.js depends on event.js";
	}

	function fbind (instance, fn) {
		fn
	}

	return {
		$: function (selector) {
			return d.querySelectorAll(selector);
		},
		$$: function(selector) {
			return d.querySelector(selector);
		},
		create: function (tag) {
			return d.createElement(tag);
		},
		bind: function (elem, type, fn) {
			Event.add(elem, type, fn);
		},
		unbind: function (elem, type, fn) {
			Event.remove(elem, type, fn);
		},
		each: function(object, callback, args) {
			var name, i = 0,
				length = object.length,
				isObj = length === undefined || typeof(object) === "function";
			if ( args ) {
				if ( isObj ) {
					for ( name in object ) {
						if ( callback.apply( object[ name ], args ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.apply( object[ i++ ], args ) === false ) {
							break;
						}
					}
				}
			} else {
				if ( isObj ) {
					for ( name in object ) {
						if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
							break;
						}
					}
				}
			}
		},
		ready: function (fn) {
			var self = this;
			if (d.readyState === "complete") {
				setTimeout(done, 1);
			} else {
				setTimeout(function () {
					self.ready.call(self, done);
				}, 1);
			}
			function done () {
				fn.call(self);
			}
		},
		css: function(obj, definitions) {
			for(var name in definitions) {
				obj.style[name] = definitions[name];
			}
		},
		getScreenSize: function () {
			var xScroll, yScroll;

			if (window.innerHeight && window.scrollMaxY) {
				xScroll = document.body.scrollWidth;
				yScroll = window.innerHeight + window.scrollMaxY;
			} 
			else if (document.body.scrollHeight > document.body.offsetHeight){
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} 
			else if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight){
				xScroll = document.documentElement.scrollWidth;
				yScroll = document.documentElement.scrollHeight;
			} 
			else {
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}

			var windowWidth, windowHeight;
			if (self.innerHeight) {
				windowWidth = self.innerWidth;
				windowHeight = self.innerHeight;
			} 
			else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} 
			else if (document.body) {
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}

			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} 
			else {
				pageHeight = yScroll;
			}

			if(xScroll < windowWidth){
				pageWidth = windowWidth;
			} 
			else {
				pageWidth = xScroll;
			}
			return {
				width: w.innerWidth ? w.innerWidth : (d.documentElement.clientWidth ? d.documentElement.clientWidth : d.body.offsetWidth),
				height: w.innerHeight ? w.innerHeight : (d.documentElement.clientHeight ? d.documentElement.clientHeight : d.body.offsetHeight),
				scrollX: pageWidth,
				scrollY: pageHeight,
			};
			
		},
		mousePageXY: function (e) {
			var x = 0, y = 0;
			if (!e) {
				e = window.event;
			}
			if (e.pageX || e.pageY) {
				x = e.pageX;
				y = e.pageY;
			}
			else if (e.clientX || e.clientY) {
				x = e.clientX + (d.documentElement.scrollLeft || d.body.scrollLeft) - d.documentElement.clientLeft;
				y = e.clientY + (d.documentElement.scrollTop || d.body.scrollTop) - d.documentElement.clientTop;
			}

			return {"x":x, "y":y};
		}		
	};
	
})(window);
