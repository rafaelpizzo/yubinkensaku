'use strict';

/**
 * YubinKensaku 0.0.5
 *
 * Author Rafael Pizzo <http://www.rafaelpizzo.com/>
 */

import { deepMerge, ajax, isEmpty } from './helpers/general.js';

export default class YubinKensaku {
	constructor(args = []) {
		var defaults = {
			_namespace: '__yubin_kensaku__',
			
			element: null,
			selectors: {},
			
			settings: {
				minChars: 3,
				matchChars: 7,
				autosearch: true,
				appendRegions: true,
				regions: ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"],
				language: "japanese",
				showErrors: true,
				errorMessages: {
					notFound: "This is not a valid Postal Code.",
					failed: "Failed to fetch data."
				},
				dataSource: "https://raw.githubusercontent.com/rafaelpizzo/yubinkensaku/master/build/data/"
			},
			eventListeners: [],
			cachedData: {
				isValid: false,
				groups: {}
			}
		}
		
		defaults.settings = deepMerge(defaults.settings, args);
		for (var key in defaults) {
			if (defaults.hasOwnProperty(key)) { this[key] = defaults[key]; }
		}
		
		if (isEmpty(this.settings.element)) {
			this.element = document.querySelector("[yubin-kensaku]");
		} else {
			this.element = (this.settings.element.nodeType === Node.ELEMENT_NODE) ? this.settings.element : document.querySelector(this.settings.element);
		}
		
		this.init();
	}
	
	get isValid() {
		return this.cachedData.isValid;
	}
	
	init() {
		this.bindElements();
	}
	
	on(eventName, callback) {
		if (typeof callback == "function") {
			var newEventListener = function(event) { callback(event.detail); }
			this.element.addEventListener("yubin:"+eventName, newEventListener);
			this.eventListeners.push({
				eventName: "yubin:"+eventName,
				eventCallback: newEventListener
			});
		} else {
			throw new Error('EventListener callback function is invalid.');
		}
		
		return this;
	}
	
	bindElements() {
		const self = this;
		
		this.selectors.inputCode = this.element.querySelector("[yubin-code]");
		if (!isEmpty(this.selectors.inputCode)) {
			if (this.settings.autosearch) {
				const ignoreKeys = [16,17,18,20,37,38,39,40];
				this.selectors.inputCode.addEventListener("keyup", function(event) {
					if (ignoreKeys.indexOf(event.keyCode) > 0) { return; }
					var requestCode = self.selectors.inputCode.value;
					if (requestCode.length >= self.settings.minChars) {
						self.getAddress(self.selectors.inputCode.value);
					}
				});
				
				this.selectors.inputCode.addEventListener("change", function(event) {
					if (isEmpty(self.selectors.inputCode.value.trim())) {
						self.processAddress(null);
					}
				});
			}
			
			if (this.settings.showErrors) {
				this.selectors.errorDisplay = document.querySelector("[yubin-code-error]");
				if (isEmpty(this.selectors.errorDisplay)) {
					this.selectors.errorDisplay = document.createElement("div");
					this.selectors.errorDisplay.classList.add("yubin-code-error");
					this.selectors.inputCode.parentNode.insertBefore(this.selectors.errorDisplay, this.selectors.inputCode.nextSibling);
				}
				
			}
			
			
			if (!isEmpty(this.selectors.inputCode.value) && this.selectors.inputCode.value.length >= this.settings.minChars && this.settings.autosearch) {
				this.getAddress(this.selectors.inputCode.value);
			}
		}
			
		this.selectors.inputTrigger = this.element.querySelector("[yubin-trigger]");
		if (!isEmpty(this.selectors.inputTrigger)) {
			this.selectors.inputTrigger.addEventListener("click", function(event) {
				event.preventDefault();
				self.getAddress(self.selectors.inputCode.value);
			});
		}
		
		this.selectors.dataFields = this.element.querySelectorAll("[yubin-field]");
		[].forEach.call(this.selectors.dataFields, function(dataField) {
			var fieldKey = dataField.getAttribute("yubin-field");
			if (fieldKey == "region" && self.settings.appendRegions) {
				for (var i = 0; i < self.settings.regions.length; i++) {
					var regionOption = document.createElement("option");
					regionOption.setAttribute("value", self.settings.regions[i]);
					regionOption.innerText = self.settings.regions[i];
					dataField.appendChild(regionOption);
				}
			}
		});
	}
	
	fetchData(groupCode) {
		console.info("Fetching data from groupCode", groupCode);
		return ajax({
			method: 'GET',
			route: this.settings.dataSource + groupCode + ".json",
			responseType: "json",
			complete: function(status, data) {},
			success: function(status, data) {
				return data.response;
			},
			error: function(status, data) {
				console.error(status, data);
			}
		});
	}
	
	async getData(code) {
		const self = this;
		
		const groupCode = self.getGroupCode(code);
		
		if (!self.cachedData.groups.hasOwnProperty(groupCode)) {
			return self.cachedData.groups[groupCode] = self.fetchData(groupCode);
		} else {
			return self.cachedData.groups[groupCode];
		}
	}
	
	parseCode(code) {
		var parsedCode = code.match(/\d+/g);
		if (!isEmpty(parsedCode) && Array.isArray(parsedCode)) { parsedCode = parsedCode.join(""); }
		return parsedCode;
	}
	
	getGroupCode(parsedCode) {
		return (parsedCode.substring(0,2)+"0").toString();
	}
	
	getAddress(code) {
		const self = this;
		const parsedCode = this.parseCode(code);
		let resolvedAddress = {};
		
		if (isEmpty(parsedCode)) { return false; }
		this.displayError(null);
		
		if (!isEmpty(this.selectors.inputTrigger)) {
			this.selectors.inputTrigger.classList.toggle("is-loading", true);
		}
		
		this.getData(parsedCode)
			.then(function(response) {
				if (!isEmpty(self.selectors.inputTrigger)) {
					self.selectors.inputTrigger.classList.toggle("is-loading", false);
				}
				if (response.hasOwnProperty(parsedCode)) {
					self.cachedData.isValid = true;
					resolvedAddress = self.processAddress(response[parsedCode]);
				} else {
					self.cachedData.isValid = false;
					resolvedAddress = self.processAddress(null);
					if (parsedCode.length >= self.settings.matchChars) {
						self.displayError(self.settings.errorMessages.notFound, parsedCode);
					}
				}
				
				self.dispatchEvent("yubin:fetch", self.selectors.inputCode, {
					isValid: self.isValid,
					code: parsedCode,
					address: resolvedAddress,
				});
			})
			.catch(function(error) {
				self.cachedData.isValid = false;
				self.displayError(self.settings.errorMessages.failed, error);
			});
	}
	
	processAddress(address) {
		const self = this;
		
		var addressData = {
			region: null,
			locality: null,
			street: null
		};
		
		if (address != null) {
			var sourceData = address[this.settings.language];
			for (var key in sourceData) {
				if (addressData.hasOwnProperty(key)) { addressData[key] = sourceData[key]; }
			}
		}
		
		if (!isEmpty(this.selectors.dataFields)) {
			[].forEach.call(this.selectors.dataFields, function(dataField) {
				var fieldKey = dataField.getAttribute("yubin-field");
				if (addressData.hasOwnProperty(fieldKey)) {
					self.assignValue(dataField, addressData[fieldKey]);
				}
			});
		}
		
		return addressData;
	}
	
	assignValue(node, value) {
		//Most old japanese systems does not allow spaces in addresses.
		if(!isEmpty(value)) {
			value = value.replace(/　/g, '');
		}
		switch (node.tagName.toLowerCase()) {
			case "select":
			case "input":
			case "textarea":
				node.value = value;
			break;
			default:
				node.innerText = value;
			break;
		}
		
		this.dispatchChangeEvent(node);
	}
	
	displayError(message, values = null) {
		if (!isEmpty(message)) { console.error(message, values); }
		if (this.settings.showErrors && !isEmpty(this.selectors.errorDisplay)) {
			this.selectors.errorDisplay.innerText = message;
		}
	}
	
	//Force a real text-input change event for postal-code field.
	dispatchChangeEvent(element) {
		if ("createEvent" in document) {
			var event = document.createEvent("HTMLEvents");
			event.initEvent("change", false, true);
			element.dispatchEvent(event);
		} else {
			element.fireEvent("onchange");
		}
	}
	
	//Dispatch custom events
	dispatchEvent(eventNamespace, eventTarget, eventData = []) {
		return this.element.dispatchEvent(new CustomEvent(eventNamespace, {
			detail: {
				target: eventTarget,
				value: eventData
			}
		}));
	}
	
	destroy() {
		for (var i = 0; i < this.eventListeners.length; i++) {
			this.element.removeEventListener(
				this.eventListeners[i].eventName,
				this.eventListeners[i].eventCallback
			);
			this.eventListeners[i] = null;
		}
		this.eventListeners = [];
	}
};