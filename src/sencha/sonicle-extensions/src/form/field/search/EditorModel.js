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
		'Sonicle.SearchString'
	],
	
	fields: null,
	
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
				ss = SoSS.parse(s),
				parsed = ss.getParsedQuery(),
				value, kw, txt;
		
		Ext.iterate(me.fields, function(field) {
			kw = field.name;
			value = null;
			if (field.textSink) {
				txt = SoSS.getAllText(ss, false);
				if (!Ext.isEmpty(txt)) value = txt;
			} else if (field.type === 'boolean') {
				kw = field.boolKeyword || 'has';
				if (Ext.isArray(parsed[kw])) value = parsed[kw].indexOf(field.name) > -1;
			} else if (field.type === 'date') {
				if (Ext.isArray(parsed[kw])) value = Ext.Date.parse(parsed[kw][0], 'Y/m/d');
			} else if (field.type === 'tag[]') {
				if (Ext.isArray(parsed[kw])) value = parsed[kw];
			} else {
				if (Ext.isArray(parsed[kw])) value = parsed[kw][0];
			}
			me.set('values.'+field.name, value);
		});
	},
	
	updateSearchString: function() {
		var ss = this.createSearchString(),
				obj = Sonicle.SearchString.toResult(ss);
		this.set('searchString', obj);
		return obj;
	},
	
	createSearchString: function() {
		var me = this,
				values = me.get('values'),
				ss = Sonicle.SearchString.parse(),
				value, kw;
		
		Ext.iterate(me.fields, function(field) {
			kw = field.name;
			value = values[field.name];
			if (field.textSink) {
				if (!Ext.isEmpty(value)) ss.textSegments.push({text: value, negated: false});
			} else if (field.type === 'boolean') {
				kw = field.boolKeyword || 'has';
				if (value === true) ss.addEntry(kw, field.name, false);
			} else if (field.type === 'date') {
				if (Ext.isDate(value)) ss.addEntry(kw, Ext.Date.format(value, 'Y/m/d'), false);
			} else if (field.type === 'tag[]') {
				if (!Ext.isEmpty(value)) {
					//value2 = values[field.name+'_raw'];
					Ext.iterate(value, function(tag) {
						ss.addEntry(kw, tag, false);
					});
				}
			} else {
				if (!Ext.isEmpty(value)) ss.addEntry(kw, value, false);
			}
		});
		return ss;
	}
});
