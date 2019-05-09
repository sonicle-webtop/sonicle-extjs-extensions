/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
Ext.define('Sonicle.String', {
	singleton: true,
	requires: [
		'Sonicle.Bytes'
	],
	
	/**
	 * Returns the string value converted to lower case.
	 * @param {String} s The String
	 * @returns {String} The lowercase String, null if null String input.
	 */
	toLowerCase: function(s) {
		return Ext.isEmpty(s) ? s : s.toLowerCase();
	},
	
	/**
	 * Returns the string value converted to upper case.
	 * @param {String} s The String
	 * @returns {String} The uppercase String, null if null String input.
	 */
	toUpperCase: function(s) {
		return Ext.isEmpty(s) ? s : s.toUpperCase();
	},
	
	/**
	 * Gets the leftmost len characters of a String.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {Integer} len The length of the required String.
	 * @returns {String} The leftmost characters, null if null String input.
	 */
	left: function(s, len) {
		return Ext.isEmpty(s) ? s : s.substring(0, len);
	},
	
	/**
	 * Gets the rightmost len characters of a String.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {Integer} len The length of the required String.
	 * @returns {String} The rightmost characters, null if null String input.
	 */
	right: function(s, len) {
		
	},
	
	/**
	 * Removes a substring only if it is at the beginning of a source string, 
	 * otherwise returns the source string.
	 * @param {String} s The source String to search, may be null.
	 * @param {String} remove The String to search for and remove, may be null.
	 * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison.
	 * @returns {String} The substring with the string removed if found, null if null String input
	 */
	removeStart: function(s, remove, ignoreCase) {
		return Ext.String.startsWith(s, remove, ignoreCase) ? s.substr(remove.length) : s;
	},
	
	/**
	 * Removes a substring only if it is at the end of a source string, 
	 * otherwise returns the source string.
	 * @param {String} s The source String to search, may be null.
	 * @param {String} remove The String to search for and remove, may be null.
	 * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison.
	 * @returns {String} The substring with the string removed if found, null if null String input
	 */
	removeEnd: function(s, remove, ignoreCase) {
		return Ext.String.endsWith(s, remove, ignoreCase) ? s.slice(0, -remove.length) : s;
	},
	
	/**
	 * Gets the substring after the last occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} sep The String to search for, may be null.
	 * @returns {String} The substring after the last occurrence of the separator, null if null String input.
	 */
	substrAfterLast: function(s, sep) {
		if (Ext.isEmpty(s)) return s;
		var lio = s.lastIndexOf(sep);
		return (lio === -1) ? '' : s.substring(lio + sep.length);
	},
	
	/**
	 * Gets the substring before the first occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} sep The String to search for, may be null.
	 * @returns {String} The substring before the first occurrence of the separator, null if null String input.
	 */
	substrBeforeLast: function(s, sep) {
		if (Ext.isEmpty(s)) return s;
		var lio = s.lastIndexOf(sep);
		return (lio === -1) ? s : s.substring(0, lio);
	},
	
	/**
	 * Joins passed values into a string of values delimited by provided 
	 * separator. Empty or null values will be ignored.
	 * @param {String} separator The separator.
	 * @param {Mixed...} values Values to join.
	 * @returns {String} The joined string
	 */
	join: function(separator, values) {
		var sep = separator || '',
				s = '', i;
		for (i=1; i<arguments.length; i++) {
			if (!Ext.isEmpty(arguments[i])) {
				s = s.concat(arguments[i], sep);
			}
		}
		return s.slice(0, -sep.length);
	},
	
	/**
	 * Returns passed string if it isn't empty (@link Ext#isEmpty), ifValue otherwise.
	 * @param {String} s The value
	 * @param {String} ifEmpty The fallback value
	 * @returns {String} Returned value
	 */
	deflt: function(s, ifEmpty) {
		return Ext.isEmpty(s) ? ifEmpty : s;
	},
	
	/**
	 * Returns first non-NULL value of provided arguments.
	 * @param {Mixed...} values List of values
	 * @returns {Mixed} The first non-NULL value
	 */
	coalesce: function(values) {
		for(var i=0; i<arguments.length; i++) {
			if((arguments[i] !== null) && (arguments[i] !== undefined)) return arguments[i];
		}
		return null;
	},
	
	/**
	 * Converts white-space char (' ') into its HTML character equivalent for literal display in web pages.
	 * @param {String} value The string to encode.
	 * @returns {String} The encoded text.
	 */
	htmlEncodeWhitespaces: function(value) {
		return !Ext.isString(value) ? value : value.replace(/ /g, '&nbsp;');
	},
	
	/**
	 * Converts line-break char ('\n') into its HTML character equivalent for literal display in web pages.
	 * @param {String} value The string to encode.
	 * @returns {String} The encoded text.
	 */
	htmlEncodeLineBreaks: function(value) {
		return !Ext.isString(value) ? value : value.replace(/\n/g, '<br>');
	},
	
	htmlLineBreaks: function(s) {
		return this.htmlEncodeLineBreaks(s);
	},
	
	/**
	 * Appends content to the query string of a URL, handling logic for whether 
	 * to place a question mark or ampersand.
	 * @param {String} url The URL to append to.
	 * @param {String} string The content to append to the URL.
	 * @returns {String} The resulting URL
	 */
	urlAppend: function(url, qstring) {
		return Ext.String.urlAppend(url, qstring);
	},
	
	/**
	 * Appends content to the path of a URL, handling the query string part properly.
	 * @param {String} url The URL to append path to.
	 * @param {String} path The content to append to the URL path.
	 * @returns {String} The resulting URL
	 */
	urlAppendPath: function(url, path) {
		if (!Ext.isString(url)) return url;
		if (Ext.isEmpty(path)) return url;
		var me = this,
				iofq = url.indexOf('?'),
				base = url.substr(Math.max(iofq, 0)),
				remaining = (iofq !== -1) ? url.substr(iofq) : '';
		return me.removeEnd(base, '/', false) + '/' + me.removeStart(path, '/', false) + remaining;
	},
	
	/**
	 * @deprecated
	 * Converts passed value in bytes in a human readable format.(eg. like '10 kB' or '100 MB')
	 * @param {int} bytes The value in bytes
	 * @param {Object} opts Computation options.
	 * @param {err|iec|si} [opts.units=err] Whether to use the erroneous (but common) 
	 *		representation (1024 magnitude + uppercase labels), 
	 *		the IEC units (1024 magnitude + IEC labels) 
	 *		or SI units (1000 magnitude)
	 * @param {String} [opts.separator] Separator to use between value and symbol.
	 * @param {int} [opts.decimals=2] Number of decimals to keep.
	 * @returns {String} The formatted string
	 */
	humanReadableSize: function(bytes, opts) {
		return Sonicle.Bytes.format(bytes, opts);
	}
});
