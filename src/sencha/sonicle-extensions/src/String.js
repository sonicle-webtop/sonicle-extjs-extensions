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
	 * Pattern that matches URLs in non trivial situations.
	 * There are numerous examples online but not all pass rigoruous test: 
	 *		https://mathiasbynens.be/demo/url-regex
	 * The only one that looks to be comprehensive and bulletproof is this one:
	 *		https://gist.github.com/dperini/729294
	 *		(which requires inclusion of a copyright header )
	 */
	MATCH_SIMPLE_URL: '(?:http:\/\/|https:\/\/|ftp:\/\/|\/\/)(?:[-a-zA-Z0-9@:%_\+.~#?&\/=])+',
	reSimpleURL: /(?:http:\/\/|https:\/\/|ftp:\/\/|\/\/)(?:[-a-zA-Z0-9@:%_\+.~#?&\/=])+/i,
	reSimpleURLs: /(?:http:\/\/|https:\/\/|ftp:\/\/|\/\/)(?:[-a-zA-Z0-9@:%_\+.~#?&\/=])+/gi,
	
	// https://www.sitepoint.com/community/t/phone-number-regular-expression-validation/2204/2 
	rePhone: new RegExp(
		'^ *' +
		// optional country code 
		'(?:' +
			'\\+?' + // maybe + prefix 
			'(\\d{1,3})' +
			// optional separator 
			'[- .]?' +
		')?' +
		// optional area code 
		'(?:' +
			'(?:' +
				'(\\d{3})' + //without () 
				'|' +
				'\\((\\d{3})\\)' + //with () 
			')?'+
			// optional separator 
			'[- .]?'+
		')' +
		// CO code (3 digit prefix) 
		'(?:' +
			'([2-9]\\d{2})'+
			// optional separator 
			'[- .]?' +
		')' +
		// line number (4 digits) 
		'(\\d{4})' +
		// optional extension 
		'(?: *(?:e?xt?) *(\\d*))?' +
		' *$'
	),
	
	// http://stackoverflow.com/questions/23483855/javascript-regex-to-validate-ipv4-and-ipv6-address-no-hostnames 
	reIPAddress: new RegExp(
		'^(' +
		// ipv4 
		'((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' +
		'|' +
		// ipv6 
		'((([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))' +
		')$'
	),
	
	// https://github.com/flipjs/cidr-regex 
	// http://www.regexpal.com/93987 
	reCIDRv4: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/,
	reCIDRv6: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/,
	
	/**
	 * Convert certain characters to their HTML character equivalents for literal display in web pages.
	 * @param {String} s The string to encode
	 * @returns {String} The resulting string
	 */
	htmlEncode: function(s) {
		return Ext.String.htmlEncode(s);
	},
	
	/**
	 * Convert certain characters from their HTML character equivalents.
	 * @param {String} s The string to decode
	 * @returns {String} The resulting string
	 */
	htmlDecode: function(s) {
		return Ext.String.htmlDecode(s);
	},
	
	/**
	 * Checks if a string starts with a substring
	 * @param {String} s The original string
	 * @param {String} start The substring to check
	 * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
	 * @returns {Boolean}
	 */
	startsWith: function(s, start, ignoreCase) {
		return Ext.String.startsWith(s, start, ignoreCase);
	},
	
	/**
	 * Checks if a string ends with a substring
	 * @param {String} s The original string
	 * @param {String} end The substring to check
	 * @param {Boolean} [ignoreCase=false] True to ignore the case in the comparison
	 * @returns {Boolean}
	 */
	endsWith: function(s, end, ignoreCase) {
		return Ext.String.endsWith(s, end, ignoreCase);
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
	 * @param {Mixed...} values List of values.
	 * @returns {Mixed} The first non-NULL value.
	 */
	coalesce: function(values) {
		for (var i=0; i<arguments.length; i++) {
			if ((arguments[i] !== null) && (arguments[i] !== undefined)) return arguments[i];
		}
		return null;
	},
	
	/**
	 * Checks if value is contained in passed string.
	 * @param {String} s The value, may be null.
	 * @param {String} value The value to look for.
	 * @returns {Boolean} `true` if value is found in string, `false` otherwise.
	 */
	contains: function(s, value) {
		return Ext.isString(s) ? s.indexOf(value) !== -1 : false;
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
		return this.lower(s1) === this.lower(s2);
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
	lower: function(s) {
		return Ext.isEmpty(s) ? s : s.toLowerCase();
	},
	
	/**
	 * Returns the string value converted to upper case.
	 * @param {String} s The String
	 * @returns {String} The uppercase String, null if null String input.
	 */
	upper: function(s) {
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
	 * Gets the substring after the first occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} separator The String to search for, may be null.
	 * @param {Boolean} [strict=true] `false` to return String itself in case of no match.
	 * @returns {String} The substring after the first occurrence of the separator, null if null String input or the String itself.
	 */
	substrAfter: function(s, separator, strict) {
		if (arguments.length < 3) strict = true;
		if (Ext.isEmpty(s)) return s;
		var lio = s.indexOf(separator);
		return (lio === -1) ? (strict === false ? s : '') : s.substring(lio + separator.length);
	},
	
	/**
	 * Gets the substring before the first occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} separator The String to search for, may be null.
	 * @param {Boolean} [strict=true] `false` to return String itself in case of no match.
	 * @returns {String} The substring before the first occurrence of the separator, null if null String input.
	 */
	substrBefore: function(s, separator, strict) {
		if (arguments.length < 3) strict = true;
		if (Ext.isEmpty(s)) return s;
		var lio = s.indexOf(separator);
		return (lio === -1) ? (strict === false ? s : '') : s.substring(0, lio);
	},
	
	/**
	 * Gets the substring after the last occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} separator The String to search for, may be null.
	 * @returns {String} The substring after the last occurrence of the separator, null if null String input.
	 */
	substrAfterLast: function(s, separator) {
		if (Ext.isEmpty(s)) return s;
		var lio = s.lastIndexOf(separator);
		return (lio === -1) ? '' : s.substring(lio + separator.length);
	},
	
	/**
	 * Gets the substring before the last occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} separator The String to search for, may be null.
	 * @returns {String} The substring before the last occurrence of the separator, null if null String input.
	 */
	substrBeforeLast: function(s, separator) {
		if (Ext.isEmpty(s)) return s;
		var lio = s.lastIndexOf(separator);
		return (lio === -1) ? s : s.substring(0, lio);
	},
	
	/**
	 * Appends a suffix to passed String.
	 * @param {String} s The String to be suffixed, may be null.
	 * @param {String} suffix The suffix to add.
	 * @param {Boolean} safe `true` to make sure suffix will not appended twice. 
	 * @returns {String} The resulting String
	 */
	append: function(s, suffix, safe) {
		if (Ext.isEmpty(s)) return s;
		return (!safe ? s : this.removeEnd(s, suffix)) + suffix;
	},
	
	/**
	 * Prepends a prefix to passed String.
	 * @param {String} s The String to be prefixed, may be null.
	 * @param {String} prefix The prefix to add.
	 * @param {Boolean} safe `true` to make sure prefix will not prepended twice. 
	 * @returns {String} The resulting String
	 */
	prepend: function(s, prefix, safe) {
		if (Ext.isEmpty(s)) return s;
		return prefix + (!safe ? s : this.removeStart(s, prefix));
		//return !safe ? prefix + s : prefix + this.removeStart(s, prefix);
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
	htmlToText: function(html, opts) {
		opts = opts || {};
		var me = this,
				presAHref = Ext.isBoolean(opts.preserveHyperlinksHref) ? opts.preserveHyperlinksHref : false,
				presAHtml = Ext.isBoolean(opts.preserveHyperlinksName) ? opts.preserveHyperlinksName : true,
				text, h2tId = Ext.id(null, 'so-h2t-'), h2tDomEl;
		// Do not use newer .append API on DOM element, it may not work on older browsers. Use Ext's appendChild!
		// Make sure that this el is always visible (eg. do not use visibility:hidden) otherwise below innerText will return empty value.
		h2tDomEl = Ext.getBody().appendChild({
			id: h2tId,
			tag: 'div',
			html: html,
			style: 'pointer-events:none;border:none;position:absolute;top:-100000px;left:-100000px'
		}, true);
		if (h2tDomEl) {
			if (presAHref) {
				var els = h2tDomEl.getElementsByTagName('a');
				Ext.iterate(els, function(el) {
					var href = el.getAttribute('href');
					if (!Ext.isEmpty(href)) {
						el.innerHTML = (presAHtml ? '[' + el.innerHTML + '] ' : '') + me.htmlEncode(href);
					}
				});
			}
			// Use innerText here: we are looking for the real text layout with new-lines.
			// (textContent will not produce the same output)
			text = h2tDomEl.innerText;
			h2tDomEl.remove();
		}
		return text || '';
	},
		
	/**
	 * Alias of (@link Ext.String#urlAppend).
	 * @param {String} url The URL to append to.
	 * @param {String} string The content to append to the URL.
	 * @returns {String} The resulting URL
	 */
	urlAppend: function(url, qstring) {
		return Ext.String.urlAppend(url, qstring);
	},
	
	/**
	 * Alias of (@link Ext.String#repeat).
	 * @param {String} pattern The pattern to repeat.
	 * @param {Number} count The number of times to repeat the pattern (may be 0).
	 * @param {String} sep An option string to separate each pattern.
	 */
	repeat: function(pattern, count, sep) {
		return Ext.String.repeat(pattern, count, sep);
	},
	
	/**
	 * Alias of (@link Ext.String#insert).
	 * @param {String} s The original string.
	 * @param {String} value The substring to insert.
	 * @param {Number} index The index to insert the substring. Negative indexes will insert from the end.
	 * @return {String} The value with the inserted substring
	 */
	insert: function(s, value, index) {
		return Ext.String.insert(s, value, index);
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
		if (Ext.isBoolean(s)) return s;
		switch(s.toLowerCase().trim()) {
			case 'true': case 't': case 'yes': case 'y': case '1': return true;
			case 'false': case 'f': case 'no': case 'n': case '0': return false;
			default: defValue;
		}
	},
	
	/**
	 * Parses a string as array of values divided by a separator and returns 
	 * them as an array of elements. If source is not a string the specified 
	 * default value will be returned.
	 * @param {String} s The source string to parse.
	 * @param {Mixed} [defValue] Default value to return when source string is invalid.
	 * @param {Function} [transformFn] Callback transform function for each item.
	 * @param {String} transformFn.value Current element value.
	 * @param {Number} transformFn.index Index of the element.
	 * @param {String} [itemsSep] Custom items separator. Defaults to colon (,) character.
	 * @returns {Array|Mixed} Resulting elements.
	 */
	parseArray: function(s, defValue, transformFn, itemsSep) {
		if (!Ext.isString(itemsSep)) itemsSep = ',';
		if (Ext.isEmpty(s)) defValue;
		var fn = Ext.isFunction(transformFn) ? transformFn : function(value, index) {
			return value;
		};
		return Ext.Array.map(s.split(itemsSep), function(value, idx) {
			return fn.apply(this, [value.trim(), idx]);
		});
	},
	
	/**
	 * 
	 * @param {String} s The source string to parse.
	 * @param {Mixed} [defValue] Default value to return when source string is invalid.
	 * @param {Function} [transformFn] Callback transform function for each item.
	 * @param {String[]} transformFn.values Current element values (separated by value separator char).
	 * @param {Number} transformFn.index Index of the element.
	 * @param {String} [itemsSep] Custom items separator. Defaults to colon (,) character.
	 * @param {String} [valueSep] Custom items separator. Defaults to equal (=) character.
	 * @returns {Array|Mixed} Resulting elements.
	 */
	parseKVArray: function(s, defValue, transformFn, itemsSep, valueSep) {
		if (!Ext.isString(itemsSep)) itemsSep = ',';
		if (!Ext.isString(valueSep)) valueSep = '=';
		if (Ext.isEmpty(s)) defValue;
		var fn = Ext.isFunction(transformFn) ? transformFn : function(values, index) {
			return values.length > 1 ? [values[0], values[1]] : ['key'+index, values[0]];
		};
		return Ext.Array.map(s.split(itemsSep), function(value, idx) {
			return fn.apply(this, [value.split(valueSep, 2), idx]);
		});
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
