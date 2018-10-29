/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
 */
Ext.define('Sonicle.CssUtils', {
    singleton: true,
	
	/**
	 * Adds new dynamic CSS rule.
	 * @param {String} selector A CSS selector for matching
	 * @param {String} style The style declaration.
	 */
	addRule: function(selector, style) {
		var doc = document;
		if (!doc.styleSheets) return;
		if (doc.getElementsByTagName('head').length === 0) return;
		
		var styleSheet, mediaType;
		if (doc.styleSheets.length > 0) {
			for (var i=0, l=doc.styleSheets.length; i<l; i++) {
				if (doc.styleSheets[i].disabled) continue;
				var media = doc.styleSheets[i].media;
				mediaType = typeof media;
				if (mediaType === 'string') {
					if (media === '' || (media.indexOf('screen') !== - 1)) {
						styleSheet = doc.styleSheets[i];
					}
				} else if (mediaType === 'object') {
					if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== - 1)) {
						styleSheet = doc.styleSheets[i];
					}
				}
				
				if (typeof styleSheet !== 'undefined') break;
			}
		}

		if (typeof styleSheet === 'undefined') {
			var styleSheetElement = doc.createElement('style');
			styleSheetElement.type = 'text/css';
			doc.getElementsByTagName('head')[0].appendChild(styleSheetElement);
			for (i = 0; i < doc.styleSheets.length; i++) {
				if (doc.styleSheets[i].disabled) continue;
				styleSheet = doc.styleSheets[i];
			}
			mediaType = typeof styleSheet.media;
		}

		if (mediaType === 'string') {
			for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
				if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
					styleSheet.rules[i].style.cssText = style;
					return;
				}
			}
			styleSheet.addRule(selector, style);
		} else if (mediaType === 'object') {
			var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
			for (var i = 0; i < styleSheetLength; i++) {
				if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
					styleSheet.cssRules[i].style.cssText = style;
					return;
				}
			}
			styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
		}
	}
});
