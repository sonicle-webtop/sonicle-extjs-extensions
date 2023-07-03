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
		/**
		 * @cfg {Boolean} [ifHasValue]
		 * Set to `true` to enable validation only if current field's value is NOT empty.
		 */
		ifHasValue: undefined,
		
		/**
		 * @cfg {String} [ifField]
		 * The name of the field referenced by {@link#ifFieldHasValue} and {@link#ifFieldValues} configs.
		 */
		ifField: undefined,
		
		/**
		 * @cfg {Boolean} [ifHasValue]
		 * Set to `true` to enable validation only if {@link#ifField specified field's} value is NOT empty.
		 */
		ifFieldHasValue: undefined,
		
		/**
		 * @cfg {Mixed[]} [ifFieldValues]
		 * An array of values to enable validation only if {@link#ifField specified field's} value is one of this list.
		 */
		ifFieldValues: undefined
	},
	
	shouldValidate: function(value, record) {
		var me = this,
			ifhv = me.getIfHasValue(),
			iff = me.getIfField();
		
		if (ifhv !== undefined) {
			if (ifhv === true && Ext.isEmpty(value)) return false;
			if (ifhv === false && !Ext.isEmpty(value)) return false;
			
		} else if (Ext.isString(iff)) {
			var fvalue = record.get(iff),
				iffhv = me.getIfFieldHasValue(),
				iffvalues = me.getIfFieldValues();
			
			if (iffhv !== undefined) {
				if (iffhv === true && Ext.isEmpty(fvalue)) return false;
				if (iffhv === false && !Ext.isEmpty(fvalue)) return false;
				
			} else if (iffvalues !== undefined) {
				if (Ext.Array.from(iffvalues).indexOf(fvalue) === -1) return false;
			}
		}
		return true;
	}
});
