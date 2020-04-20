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
		for (var i=0; i<arguments.length; i++) {
			if ((arguments[i] !== null) && (arguments[i] !== undefined)) return arguments[i];
		}
		return null;
	},
	
	/**
	 * Checks if string is in passed list.
	 * @param {String} s The value
	 * @param {String[]} values Values to search in.
	 * @returns {Boolean} `true` if string is found in passed list, `false` otherwise.
	 */
	isIn: function(s, values) {
		if (Ext.isEmpty(s) || !Ext.isArray(values)) return false;
		return values.indexOf(s) !== -1;
	},
	
	/**
	 * Compare two strings, ignoring case.
	 * @param {String} s1 The 1st value, may be null.
	 * @param {String} s2 The 2nd value, may be null.
	 * @returns {Boolean} `true` if strings are equal, `false` otherwise.
	 */
	iequals: function(s1, s2) {
		return this.toLowerCase(s1) === this.toLowerCase(s2);
	},
	
	/**
	 * Compares two String arrays looking for differences: any string not 
	 * contained in each other array is marked as difference.
	 * @param {String[]} values1 First value set.
	 * @param {String[]} values2 Second value set.
	 * @returns {String[]} The different string elements.
	 */
	difference: function(values1, values2) {
		if (!Ext.isArray(values1) || !Ext.isArray(values2)) return [];
		var arrdiff = Ext.Array.difference,
				diff1 = arrdiff(values1, values2),
				diff2 = arrdiff(values2, values1);
		return diff1.concat(diff2);
	},
	
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
	 * @param {String} separator The String to search for, may be null.
	 * @returns {String} The substring before the first occurrence of the separator, null if null String input.
	 */
	substrBeforeLast: function(s, separator) {
		if (Ext.isEmpty(s)) return s;
		var lio = s.lastIndexOf(separator);
		return (lio === -1) ? s : s.substring(0, lio);
	},
	
	prepend: function(s, prefix, safe) {
		if (Ext.isEmpty(s)) return s;
		return !safe ? prefix + s : prefix + this.removeStart(s, prefix);
	},
	
	/**
	 * Searches a string for a specified value, or a regular expression, and 
	 * returns a new string where the specified values are replaced.
	 * @param {String} s The String to be modified, may be null.
	 * @param {String} searchvalue The value, or regular expression, that will be replaced by the new value.
	 * @param {String} newvalue The value to replace the search value with.
	 * @returns {String} A new String, where the specified value(s) has been replaced by the new value.
	 */
	replace: function(s, searchvalue, newvalue) {
		if (Ext.isEmpty(s)) return s;
		return s.replace(searchvalue, newvalue);
	},
	
	/**
	 * Splits a `String` object into an array of strings by separating the string into substrings.
	 * @param {String} s The String to be splitted, may be null.
	 * @param {String} separator Specifies the character to use for separating the string.
	 * The separator is treated as a string or a regular expression. If separator is omitted, the array returned contains one element consisting of the entire string.
	 * @param {Number} limit Integer specifying a limit on the number of splits to be found.
	 * The split method still splits on every match of separator, but it truncates the returned array to at most limit elements.
	 * @returns {String[]} Substrings are returned in an array.
	 */
	split: function(s, separator, limit) {
		if (Ext.isEmpty(s)) return [];
		return s.split(separator, limit);
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
				arr = Ext.isArray(values) ? values : Ext.Array.slice(arguments, 1),
				s = '', i;
		for (i=0; i<arr.length; i++) {
			if (!Ext.isEmpty(arr[i])) s = s.concat(arr[i], sep);
		}
		return s.slice(0, -sep.length);
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
	 * Converts html into pure text rapresentation.
	 * @param {String} value The html content.
	 * @returns {String} The pure text rapresentation.
	 */
	htmlToText: function(html) {
		var text, h2tId = Ext.id(null, 'so-h2t-'), h2tDomEl;
		// Do not use newer .append API on DOM element, it may not work on older browsers. Use Ext's appendChild!
		// Make sure that this el is always visible (eg. do not use visibility:hidden) otherwise below innerText will return empty value.
		h2tDomEl = Ext.getBody().appendChild({
			id: h2tId,
			tag: 'div',
			html: html,
			style: 'pointer-events:none;border:none;position:absolute;top:-100000px;left:-100000px'
		}, true);
		if (h2tDomEl) {
			// Use innerText here: we are looking for the real text layout with new-lines.
			// (textContent will not produce the same output)
			text = h2tDomEl.innerText;
			h2tDomEl.remove();
		}
		return text || '';
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
	 * Parses a string as a boolean value:
	 *  - `true`, `t`, `yes`, `y`, `1` are treated as `true` boolean value
	 *  - `false`, `f`, `no`, `n`, `0` are treated as `false` boolean value
	 * @param {String} s The source string to parse.
	 * @param {Boolean} [defValue=false] Default boolean value to return in case of no match, or null. Defaults to `false`.
	 * @returns {Boolean} The parsed value.
	 */
	parseBoolean: function(s, defValue) {
		if (arguments.length === 1) defValue = false;
		if (s === null) return defValue;
		switch(s.toLowerCase().trim()) {
			case 'true': case 't': case 'yes': case 'y': case '1': return true;
			case 'false': case 'f': case 'no': case 'n': case '0': return false;
			default: defValue;
		}
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
