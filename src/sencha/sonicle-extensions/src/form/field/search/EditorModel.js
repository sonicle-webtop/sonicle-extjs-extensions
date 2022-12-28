/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
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
		values: {},
		searchString: null
	},
	
	constructor: function(cfg) {
		var me = this, values = {}, hiddens = {};
		me.callParent([cfg]);
		
		if (me.fields) {
			Ext.iterate(me.fields, function(field) {
				values[field.name] = null;
				hiddens[field.name] = false;
			});
			me.set('values', values);
			me.set('hiddens', hiddens);
		}
	},
	
	setSearchStringValue: function(s) {
		var me = this,
				SoSS = Sonicle.SearchString,
				ss = SoSS.parseRaw(s),
				parsed = ss.getParsedQuery(),
				value, kw, txt;
		
		Ext.iterate(me.fields, function(field) {
			kw = field.name;
			value = null;
			if (field.textSink) {
				txt = SoSS.getAllText(ss, false);
				if (!Ext.isEmpty(txt)) value = txt;
			} else if (field.type === 'boolean') {
				if (field.boolKeyword) {
					if (Ext.isArray(parsed[field.boolKeyword])) value = parsed[field.boolKeyword].indexOf(field.name) > -1;
				} else {
					if (Ext.isArray(parsed[kw])) value = Sonicle.Object.booleanValue(parsed[kw][0]) === true ? me.trueValue : me.falseValue;
				}
			} else if (field.type === 'date') {
				if (Ext.isArray(parsed[kw])) value = Ext.Date.parse(parsed[kw][0], 'Y-m-d');
			} else if (field.type === 'time') {
				if (Ext.isArray(parsed[kw])) value = Ext.Date.parse(parsed[kw][0], 'H:i:s');
			} else if (field.type === 'tag') {
				if (Ext.isArray(parsed[kw])) value = parsed[kw];
			} else {
				if (Ext.isArray(parsed[kw])) value = parsed[kw][0];
			}
			me.set('values.'+field.name, value);
		});
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
				ss = Sonicle.SearchString.parseRaw(),
				value, kw;
		
		Ext.iterate(me.fields, function(field) {
			kw = field.name;
			value = values[field.name];
			if (field.textSink) {
				if (!Ext.isEmpty(value)) ss.textSegments.push({text: value, negated: false});
			} else if (field.type === 'boolean') {
				if (field.boolKeyword) {
					if (value === true) ss.addEntry(field.boolKeyword, field.name, false);
				} else {
					if (!Ext.isEmpty(value)) ss.addEntry(kw, value.toString(), false);
				}
			} else if (field.type === 'date') {
				if (Ext.isDate(value)) ss.addEntry(kw, Ext.Date.format(value, 'Y-m-d'), false);
			} else if (field.type === 'time') {
				if (Ext.isDate(value)) ss.addEntry(kw, Ext.Date.format(value, 'H:i'), false);
			} else if (field.type === 'tag') {
				if (!Ext.isEmpty(value)) {
					Ext.iterate(value, function(tag) {
						ss.addEntry(kw, tag.toString(), false);
					});
				}
			} else {
				if (!Ext.isEmpty(value)) ss.addEntry(kw, value.toString(), false);
			}
		});
		return ss;
	}
});
