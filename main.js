"use strict";

var EventEmitter2 = require('eventemitter2').EventEmitter2;

class EventEmitter extends EventEmitter2 {

	emit () {
		this._events || init.call(this);

		var type = arguments[0];

		if (type === 'newListener' && !this.newListener) {
			if (!this._events.newListener) { return Promise.reject("Uncaught, unspecified 'newListener' event."); }
		}

		var promises = [];

		// Loop through the *_all* functions and invoke them.
		if (this._all) {
			var l = arguments.length;
			var args = new Array(l - 1);
			for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
			for (i = 0, l = this._all.length; i < l; i++) {
				this.event = type;
				promises.push(this._all[i].apply(this, args));
			}
		}

		// If there is no 'error' event listener then throw.
		if (type === 'error') {

			if (!this._all &&
				!this._events.error &&
				!(this.wildcard && this.listenerTree.error)) {

					if (arguments[1] instanceof Error) {
						return Promise.reject(arguments[1]);
					} else {
						return Promise.reject("Uncaught, unspecified 'error' event.");
					}
					return Promise.reject("Uncaught, unspecified 'error' event.");
				}
			}

			var handler;

			if(this.wildcard) {
				handler = [];
				var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
				searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
			}
			else {
				handler = this._events[type];
			}

			if (typeof handler === 'function') {
				this.event = type;
				if (arguments.length === 1) {
					promises.push(handler.call(this));
				}
				else if (arguments.length > 1)
				switch (arguments.length) {
					case 2:
					promises.push(handler.call(this, arguments[1]));
					break;
					case 3:
					promises.push(handler.call(this, arguments[1], arguments[2]));
					break;
					// slower
					default:
					var l = arguments.length;
					var args = new Array(l - 1);
					for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
					promises.push(handler.apply(this, args));
				}
			}
			else if (handler) {
				var l = arguments.length;
				var args = new Array(l - 1);
				for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

				var listeners = handler.slice();
				for (var i = 0, l = listeners.length; i < l; i++) {
					this.event = type;
					promises.push(listeners[i].apply(this, args));
				}
			}
			return Promise.all(promises);
		}
	}

	module.exports = EventEmitter;
