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

export function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	
export function radToDegree(radians) {
		return radians * 180 / Math.PI;
	}
	
export function degreeToRad(degrees) {
		return degrees * Math.PI / 180;
	}

export function createHash(s) {
		for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
			h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
		return (h ^ h >>> 16) >>> 0;
	}
	
export function toggleClass(target, className, enabled) {
		(enabled) ? target.classList.add(className) : target.classList.remove(className);
	}
	
export function countObject(obj) {
		var result = 0;
		for (var prop in obj) { if (obj.hasOwnProperty(prop)) { result++; } }
		return result;
	}
	
export function unCamelCase(str) {
		str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, "$1 $2");
		str = str.toLowerCase().split(/\s/);
		return str;
	}
	
export function bytesToSize(bytes) {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
		if (bytes === 0) return 'n/a'
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
		if (i === 0) return `${bytes} ${sizes[i]}`
		return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
	}

export function base64ToArrayBuffer(base64) { 
		base64 = base64.replace(/^data\:([^\;]+)\;base64,/gim, "");
		var binaryString = atob(base64);
		var len = binaryString.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i) } 
		return bytes.buffer
	}

export function wrap(el, wrapper) {
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);
	}
	
export function isMobile() {
		var _isMobile = false;
		if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
				|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) _isMobile = true;
		if (window.outerWidth <= 993) { _isMobile = true; }
		return _isMobile;
	}

export function isIE() {
		const ua = navigator.userAgent;
		const is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1 || ua.indexOf("Edge/") > -1;
		return is_ie; 
	}

export function setLog(msg, value, type = "log") {
		switch (type) {
			case "error": if (value) { console.error(msg, value); } else { console.error(msg); } break;
			case "info": if (value) { console.info(msg, value); } else { console.info(msg); } break;
			default: if (value) { console.log(msg, value); } else { console.log(msg); } break;
		}
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
	
	
export function serialize(form) {
		//IE11 compatible serialize
		var object = {};
		for (var i = 0; i < form.elements.length; i++) {
			var field = form.elements[i];
			if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;
			if (field.type === 'select-multiple') {
				for (var n = 0; n < field.options.length; n++) {
					if (!field.options[n].selected) continue;
					object[encodeURIComponent(field.name)] = encodeURIComponent(field.options[n].value);
				}
			}
			else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
				object[encodeURIComponent(field.name)] = encodeURIComponent(field.value);
			}
		}
		return JSON.stringify(object);
	}