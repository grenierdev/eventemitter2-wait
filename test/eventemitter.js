"use strict";

var expect = require('chai').expect;
var EventEmitter = require('../main.js');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

describe('EventEmitter', () => {

	var emitter = new EventEmitter();

	it('should be an instance of EventEmitter2', () => {
		expect(emitter).to.be.an.instanceof(EventEmitter2);
	});

	it('emit() return a Promise', () => {
		expect(emitter.emit('test')).to.be.a('promise');
	});

	it('emit() get delayed by listeners', done => {
		var d = false;
		emitter.on('delayed', () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 1000);
			});
		});

		emitter.emit('delayed')
			.then(() => {
				if (d == false) {
					d = true;
					done();
				}
			})
			.catch(done);

		if (d == true) {
			d = true;
			done(new Error('emit() did not get delayed by listener.'));
		}
	});

	it('emit() get cancelled by listeners', done => {
		var d = false;
		emitter.on('cancelled', () => {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					reject();
				}, 1000);
			});
		});

		emitter.emit('cancelled')
			.then(() => {
				if (d == true) {
					d = true;
					done(new Error('emit() did not get cancelled by listener.'));
				}
			})
			.catch(() => {
				if (d == false) {
					d = true;
					done();
				}
			});

		if (d == true) {
			d = true;
			done(new Error('emit() did not get cancelled by listener.'));
		}
	});

});
