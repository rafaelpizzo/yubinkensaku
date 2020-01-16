import YubinKensaku from './yubinKensaku.js';

'use strict';

export class Application {
	constructor(args = []) {
		this.t0 = performance.now();
		
		this.yubinKensaku = new YubinKensaku();
		
		var t1 = performance.now();
		console.log('Processing took ' + (t1 - this.t0) + ' milliseconds.');
	}
};

window.Application = new Application();