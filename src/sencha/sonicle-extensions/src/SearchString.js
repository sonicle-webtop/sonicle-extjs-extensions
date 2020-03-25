/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
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
	
	parseRaw: function(s) {
		this.checkAvail();
		return SearchString.parse(s);
	},
	
	parseHumanQuery: function(s) {
		this.checkAvail();
		return SearchString.parse(this.toRawQuery(s));
	},
	
	toQueryObject: function(ss) {
		return {
			value: ss.toString(),
			conditionArray: ss.getConditionArray(),
			parsedQuery: ss.getParsedQuery(),
			textSegments: ss.getTextSegments(),
			anyText: this.getAllText(ss, false)
		};
	},
	
	getAllText: function(ss, allowNegated) {
		return allowNegated ? ss.getAllText() : this.extractTextSegments(ss.getTextSegments());
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
