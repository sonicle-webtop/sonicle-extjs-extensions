/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.MatchField', {
	extend:'Ext.data.validator.Validator',
	alias: 'data.validator.somatchfield',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	type: 'somatchfield',
	
	config: {
		/**
		 * @cfg {String} message 
		 * The error message to return when the value is not specified.
		 */
		message: 'Does not match `{0}` field',
		
		/**
		 * @cfg {String} matchField
		 * The field's name to match its value.
		 */
		matchField: null,
		
		/**
		 * @cfg {String} matchFieldLabel
		 * Label representing the above field.
		 */
		matchFieldLabel: ''
	},
	
	validate: function(v, rec) {
		var me = this,
				name = me.getMatchField();
		if (!me.shouldValidate(v, rec)) return true;
		if (Ext.isString(name)) {
			return (v === rec.get(name)) ? true : Ext.String.format(me.getMessage(), me.getMatchFieldLabel());
		} else {
			return false;
		}
	}
});
