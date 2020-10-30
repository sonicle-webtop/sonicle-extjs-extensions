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
	 * Mapping between a Font Name and its Font Family.
	 * Taken from defaults {@link Sonicle.form.field.tinymce.tool.FontSelect}
	 */
	fonts: {
		'Andale Mono': "'andale mono',times",
		'Arial': "arial,helvetica,sans-serif",
		'Arial Black': "'arial black','avant garde'",
		'Book Antiqua': "'book antiqua',palatino",
		'Comic Sans MS': "'comic sans ms',sans-serif",
		'Courier New': "'courier new',courier",
		'Georgia': "georgia,palatino",
		'Helvetica': "helvetica",
		'Impact': "impact,chicago",
		'Symbol': "symbol",
		'Tahoma': "tahoma,arial,helvetica,sans-serif",
		'Terminal': "terminal,monaco",
		'Times New Roman': "'times new roman',times",
		'Trebuchet MS': "'trebuchet ms',geneva",
		'Verdana': "verdana,geneva",
		'Webdings': "webdings",
		'Wingdings': "wingdings,'zapf dingbats'"
	},
	
	/**
	 * Finds the corresponding font-family of a font name comparing tabled entries.
	 * @param {String} name The font name.
	 * @param {Boolean} [strict] Set as `false` to use wider lowercase comparison. Defaults to `true`.
	 * @returns {String}
	 */
	findFontFamily: function(name, strict) {
		if (arguments.length < 2) strict = true;
		if (strict) {
			return this.fonts[name];
		} else {
			var lower = Sonicle.String.lower,
					comp = Ext.String.trim(lower(name)),
					ret = undefined;
			Ext.iterate(this.fonts, function(key, value) {
				if (lower(key) === comp) {
					ret = value;
					return false;
				}
			});
			return ret;
		}
	},
	
	/**
	 * Converts a Font name to a value to be used in style definition.
	 * @param {String} name The font name.
	 * @returns {String} Family nave value.
	 */
	toFontFamily: function(name) {
		var ff = Sonicle.String.lower(name.trim());
		return ff.indexOf(' ') !== -1 ? "'"+ff+"'" : ff;
	},
	
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
