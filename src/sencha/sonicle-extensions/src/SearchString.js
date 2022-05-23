/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.SearchString', {
	singleton: true,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.isAvailSearchString = Ext.isDefined(window['SearchString']);
		me.checkAvail();
	},
	
	/**
	 * Parses a String query (with no human-readable optimizations) into search-string object.
	 * @param {String} s A query to parse.
	 * @returns {SearchString}
	 */
	parseRaw: function(s) {
		this.checkAvail();
		return SearchString.parse(s);
	},
	
	/**
	 * Parses a human-readable String query into search-string object.
	 * @param {String} s A human-readable query to parse.
	 * @returns {SearchString}
	 */
	parseHumanQuery: function(s) {
		this.checkAvail();
		return SearchString.parse(this.toRawQuery(s));
	},
	
	/**
	 * Converts passed SearchString into a QueryObject, an immutable and 
	 * expanded representation of the source instance.
	 * @param {SearchString} searchString The source SearchString object.
	 * @returns {Object} Object with value, conditionArray, parsedQuery, textSegments and anyText properties
	 */
	toQueryObject: function(searchString) {
		var ss = searchString.clone();
		return {
			value: ss.toString(),
			conditionArray: ss.getConditionArray(),
			parsedQuery: ss.getParsedQuery(),
			textSegments: ss.getTextSegments(),
			anyText: this.getAllText(ss, false)
		};
	},
	
	/**
	 * Extracts the all-text part from the passed SearchString.
	 * @param {SearchString} searchString The source SearchString object.
	 * @param {Boolean} allowNegated ???
	 * @returns {String} The all-text part of the SearchString
	 */
	getAllText: function(searchString, allowNegated) {
		return allowNegated ? searchString.getAllText() : this.extractTextSegments(searchString.getTextSegments());
	},

	/**
	 * Translate a human-readable query into a raw one, replacing 
	 * round-parentesis notation with double-quotes:
	 *     (abcd) (efgh) -> "abcd" "efgh"
	 * @param {String} s Source string
	 * @returns {String} Output query
	 */
	toRawQuery: function(s) {
		return !Ext.isEmpty(s) ? s.replace(/\((.*?)\)/g, '"$1"') : s;
	},

	/**
	 * Translate a raw query into a human-readable one, replacing 
	 * double-quotes notation with round-parentesis:
	 *     "abcd" "efgh" -> (abcd) (efgh)
	 * @param {String} s Source string
	 * @returns {String} Output query
	 */
	toHumanQuery: function(s) {
		return !Ext.isEmpty(s) ? s.replace(/"(.*?)"/g, '($1)') : s;
	},
	
	privates: {
		checkAvail: function() {
			if (!this.isAvailSearchString) Ext.raise('Library search-string is required (see https://github.com/mixmaxhq/search-string).');
		},
		
		extractTextSegments: function(segments) {
			var txt = '', i;
			for (i=0; i<segments.length; i++) {
				txt += (segments[i].text + ' ');
			}
			return txt.trim();
		}
	}
});
