/*
 * ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.search.data.SuggestionModel', {
    extend: 'Ext.data.Model',
	
	fields: [
		{name: 'type', type: 'string'},
		{name: 'query', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'label', type: 'string', depends: ['type', 'query', 'name'],
			convert: function(v, rec) {
				var ME = Sonicle.form.field.search.data.SuggestionModel,
					type = rec.get('type'),
					ret = '';
				if (type === ME.TYPE_FAV) {
					ret =  rec.get('name');
				} else if (type === ME.TYPE_RECENT) {
					ret =  rec.get('query');
				}
				return ret;
			}
		},
		{name: 'preview', type: 'string', depends: ['type', 'query', 'name'],
			convert: function(v, rec) {
				var ME = Sonicle.form.field.search.data.SuggestionModel,
					type = rec.get('type'),
					ret = '';
				if (type === ME.TYPE_FAV) {
					ret = rec.get('query');
				}
				return ret;
			}
		}
	],
	
	statics: {
		TYPE_RECENT: '1',
		TYPE_FAV: '2',
		TYPE_HELP: '9'
	}
});
