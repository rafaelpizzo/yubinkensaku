'use strict';

export function deepMerge(target, source) {
		const isObject = (obj) => obj && typeof obj === 'object';

		if (!isObject(target) || !isObject(source)) {
			return source;
		}

		Object.keys(source).forEach(key => {
			const targetValue = target[key];
			const sourceValue = source[key];

			if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
				target[key] = targetValue.concat(sourceValue);
			} else if (isObject(targetValue) && isObject(sourceValue)) {
				target[key] = deepMerge(Object.assign({}, targetValue), sourceValue);
			} else {
				target[key] = sourceValue;
			}
		});

		return target;
	}
	
export function isEmpty(str) {
		return (typeof str !== "undefined" && str !== null && str !== "") ? false : true;
	}

export function ajax(args) {
		return new Promise(function (resolve, reject) {
			var defaults = {
				method: 'POST',
				route: '/',
				responseType: null,
				data: null,
				complete: function(status, data) {},
				success: function(status, data) {},
				error: function(status, data) {},
				onprogress: function () {},
				headers: []
			}

			const request = {};
			for (var key in defaults) {
			   request[key] = (args.hasOwnProperty(key)) ? args[key] : defaults[key];
			}

			// setLog('[APP] ajax', request);

			var xhr = new XMLHttpRequest();
			xhr.open(request.method, request.route, true);
			if (!isEmpty(request.headers)) {
				for (var key in request.headers) {
					if (request.headers.hasOwnProperty(key)) {
						xhr.setRequestHeader(request.headers[key][0], request.headers[key][1]);
					}
				}
			}
			if (!isEmpty(request.responseType)) {
				xhr.responseType = request.responseType;
			}
			xhr.onload = function() {
				if (this.status >= 200 && this.status < 300) {
					resolve(request.success(xhr.statusText, xhr));
				} else {
					reject({
					  status: this.status,
					  statusText: xhr.statusText
					});
					request.error(xhr.statusText, xhr)
				}
				request.complete(xhr.statusText, xhr)
			};
			xhr.onerror = function () {
				reject({
				  status: this.status,
				  statusText: xhr.statusText
				});
				request.error(xhr.statusText, xhr)
			};
			xhr.onprogress = function(event) {
				request.onprogress(event);
			};

			xhr.send(request.data);
		})
		.then(result => { return result })
		.catch(error => { return error });
	}