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
	 * Gets the substring after the last occurrence of a separator. The separator is not returned.
	 * @param {String} s The String to get a substring from, may be null.
	 * @param {String} sep The String to search for, may be null.
	 * @returns {String} The substring after the last occurrence of the separator, null if null String input.
	 */
	substrAfterLast: function(s, sep) {
		if (!s) return s;
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
		if (!s) return s;
		var lio = s.lastIndexOf(sep);
		return (lio === -1) ? s : s.substring(0, lio);
	},
	
	/**
	 * Joins passed values into a string of values delimited by provided separator.
	 * @param {String} separator The separator.
	 * @param {Mixed...} values Values to join.
	 * @returns {String} The joined string
	 */
	join: function(separator, values) {
		var sep = separator || '',
				s = '', i;
		for(i=1; i<arguments.length; i++) {
			if(Ext.isEmpty(arguments[i])) continue;
			s = s.concat(arguments[i] || '', (i === arguments.length-1) ? '' : sep);
		}
		return Ext.String.trim(s);
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
	 * Converts line-breaks to HTML representation (in HTML5 <br> is preferred).
	 * @returns {String}
	 */
	htmlLineBreaks: function(s) {
		return Ext.isString(s) ? s.replace(/\n/g, '<br>') : s;
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
