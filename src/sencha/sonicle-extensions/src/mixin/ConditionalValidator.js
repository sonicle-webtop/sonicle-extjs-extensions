/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.mixin.ConditionalValidator', {
	extend: 'Ext.Mixin', 
	mixinConfig: {
		id: 'soconditionalvalidator'
	},
	
	config: {
		ifHasValue: false,
		
		/**
		 * @cfg {String} ifField
		 * The field name of the field whose {@link#ifValues values} come from.
		 */
		ifField: null,
		
		/**
		 * @cfg {Mixed[]} ifFieldValues
		 * Array of values for field targeted by {@link#ifField} for which to 
		 * consider the presence of the attached field mandatory.
		 */
		ifFieldValues: null
	},
	
	shouldValidate: function(value, record) {
		var me = this,
				iffld = me.getIfField();
		if (me.getIfHasValue() === true && Ext.isEmpty(value)) return false;
		if (!Ext.isEmpty(iffld)) {
			return Ext.Array.from(me.getIfFieldValues()).indexOf(record.get(iffld)) !== -1;
		} else {
			return true;
		}
	}
});
