/*
 * ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.search.EditorModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.sosearcheditormodel',
	uses: [
		'Sonicle.Object',
		'Sonicle.SearchString'
	],
	
	fields: null,
	trueValue: 'y',
	falseValue: 'n',
	
	data: {
		values: null,
		negations: null,
		searchString: null
	},
	
	constructor: function(cfg) {
		var me = this, values = {}, negations = {}, hiddens = {};
		me.callParent([cfg]);
		
		if (me.fields) {
			Ext.iterate(me.fields, function(field) {
				values[field.name] = null;
				negations[field.name] = false;
				hiddens[field.name] = false;
			});
			me.set('values', values);
			me.set('negations', negations);
			me.set('hiddens', hiddens);
		}
	},
	
	/*
	resetNegations: function() {
		var me = this;
		Ext.iterate(me.fields, function(field) {
			me.set('negations.'+field.name, false);
		});
	},
	*/
	
	/**
	 * Applies passed String to the editor.
	 * @param {String} s The raw search string.
	 * @returns {SearchString} The parsed search object
	 */
	setSearchStringValue: function(s) {
		var me = this,
			SoSS = Sonicle.SearchString,
			ss = SoSS.parseRaw(s),
			parsed = ss.getParsedQuery(),
			lookupParsed = function(keyword) {
				if (keyword === 'exclude') Ext.raise('Unable to lookup keyword: "exclude" is a reserved word!');
				if (Ext.isDefined(parsed[keyword])) {
					return {negated: false, value: parsed[keyword]};
				} else if (Ext.isDefined(parsed.exclude[keyword])) {
					return {negated: true, value: parsed.exclude[keyword]};
				} else {
					return undefined;
				}
			},
			firstOf = function(arr) {
				return Ext.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
			};
		
		Ext.iterate(me.fields, function(field) {
			var kw = field.name,
				value = null,
				negated = false,
				txt, lookup;
			
			if (field.textSink) {
				txt = SoSS.getAllText(ss, false);
				if (!Ext.isEmpty(txt)) {
					value = txt;
				}
			} else if (field.type === 'boolean') {
				if (field.boolKeyword) {
					lookup = lookupParsed(field.boolKeyword);
					if (lookup && Ext.isArray(lookup.value)) {
						value = lookup.value.indexOf(field.name) > -1;
						negated = lookup.negated;
					}
				} else {
					lookup = lookupParsed(kw);
					if (lookup && Ext.isArray(lookup.value)) {
						value = Sonicle.Object.booleanValue(firstOf(lookup.value)) === true ? me.trueValue : me.falseValue;
						negated = lookup.negated;
					}
				}
			} else if (field.type === 'date') {
				lookup = lookupParsed(kw);
				if (lookup && Ext.isArray(lookup.value)) {
					value = Ext.Date.parse(firstOf(lookup.value), 'Y-m-d');
					negated = lookup.negated;
				}
			} else if (field.type === 'time') {
				lookup = lookupParsed(kw);
				if (lookup && Ext.isArray(lookup.value)) {
					value = Ext.Date.parse(firstOf(lookup.value), 'H:i:s');
					negated = lookup.negated;
				}
			} else if (field.type === 'tag') {
				lookup = lookupParsed(kw);
				if (lookup && Ext.isArray(lookup.value)) {
					value = lookup.value;
					negated = lookup.negated;
				}
			} else {
				lookup = lookupParsed(kw);
				if (lookup && Ext.isArray(lookup.value)) {
					value = firstOf(lookup.value);
					negated = lookup.negated;
				}
			}
			me.set('values.'+field.name, value);
			me.set('negations.'+field.name, negated);
		});
		
		return ss;
	},
	
	updateQueryObject: function() {
		var me = this,
			ss = me.createSearchString(),
			qobj = Sonicle.SearchString.toQueryObject(ss);
		me.set('queryObject', qobj);
		return qobj;
	},
	
	createSearchString: function() {
		var me = this,
			values = me.get('values'),
			negations = me.get('negations'),
			ss = Sonicle.SearchString.parseRaw();
		
		Ext.iterate(me.fields, function(field) {
			var kw = field.name,
				value = values[field.name],
				negated = negations[field.name];
			
			if (field.textSink) {
				if (!Ext.isEmpty(value)) {
					ss.textSegments.push({text: value, negated: negated});
				}
			} else if (field.type === 'boolean') {
				if (field.boolKeyword) {
					if (value === true) {
						ss.addEntry(field.boolKeyword, field.name, negated);
					}
				} else {
					if (!Ext.isEmpty(value)) {
						ss.addEntry(kw, value.toString(), negated);
					}
				}
			} else if (field.type === 'date') {
				if (Ext.isDate(value)) {
					ss.addEntry(kw, Ext.Date.format(value, 'Y-m-d'), negated);
				}
			} else if (field.type === 'time') {
				if (Ext.isDate(value)) {
					ss.addEntry(kw, Ext.Date.format(value, 'H:i'), negated);
				}
			} else if (field.type === 'tag') {
				if (!Ext.isEmpty(value)) {
					Ext.iterate(value, function(tag) {
						ss.addEntry(kw, tag.toString(), negated);
					});
				}
			} else {
				if (!Ext.isEmpty(value)) {
					ss.addEntry(kw, value.toString(), negated);
				}
			}
		});
		return ss;
	}
});
