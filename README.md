# Sinaps EventEmitter
Sinaps EE is a extension of [EventEmitter2](https://github.com/asyncly/EventEmitter2) to allow `emit()` function to be delayed or cancelled by listeners.

[![Build Status](https://travis-ci.org/sinapsio/sinaps-ee.svg)](https://travis-ci.org/sinapsio/sinaps-ee)

## Install
```js
npm install --save sinaps-ee
```

## Usage

```js
var EventEmitter = require('sinaps-ee');

// Create new event emitter
var emitter = new EventEmitter();

// Create a listener that delay emitter for 1 second
emitter.on('save', (data) => {
	return new Promise((resolve, reject) => {
		// Delay for 1 second
		setTimeout(() => {
			// Promise is resolved
			resolve();
		}, 1000)
	})
});

// Emit a save event and wait for listener to complete or cancel event
// emit() now return a promise for all listener for save event
emitter.emit('save')
	.then(result => {
		// All listeners for the event have completed
		// Got delayed for 1 second
	})
	.catch(err => {
		// One of the listener cancelled the event
	});
```
