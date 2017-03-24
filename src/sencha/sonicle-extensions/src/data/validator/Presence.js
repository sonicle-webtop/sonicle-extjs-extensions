/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Presence', {
	extend: 'Ext.data.validator.Presence',
	alias: 'data.validator.sopresence',
	
	config: {
		/**
		 * @cfg {String} ifField
		 * The field name of the field whose {@link#ifValues values} come from.
		 */
		ifField: null,
		
		/**
		 * @cfg {Mixed[]} ifValues
		 * Array of values for field targeted by {@link#ifField} for which to 
		 * consider the presence of the attached field mandatory.
		 */
		ifValues: null
	},
	
	validate: function(v, rec) {
		var me = this,
				field = me.getIfField(),
				values = me.getIfValues(),
				check = Ext.isString(field) && Ext.isArray(values);
		
		if (check && values.indexOf(rec.get(field)) === -1) return true;
		return me.callParent(arguments);
	}
});
