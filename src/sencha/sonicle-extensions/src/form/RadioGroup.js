/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * @deprecated Not used anymore
 */
Ext.define('Sonicle.form.RadioGroup', {
	extend: 'Ext.form.RadioGroup',
	alias: 'widget.soradiogroup',
	
	singleValue: true,
	
	/**
	 * If {@link #singleValue} config is True, this method overrides default 
	 * implementation setting the value of the radio with corresponding 
	 * {@link Ext.form.field.Radio#name name} and {@link Ext.form.field.Radio#inputValue inputValue}.
	 * @param {Object} value The map from names to values to be set or a single value.
	 * @returns {Sonicle.form.RadioGroup} this
	 */
	setValue: function(value) {
		var me = this, first, formId;
		if(!me.singleValue) {
			return me.callParent(arguments);
			
		} else {
			Ext.suspendLayouts();
			first = me.items.first();
			formId = first ? first.getFormId() : null;
			me.items.each(function(item) {
				if((item.inputValue === value) && (item.getFormId() === formId)) {
					item.setValue(true);
					return false;
				}
			});
			Ext.resumeLayouts(true);
			return me;
		}
	},
	
	/**
	 * If {@link #singleValue} config is True, overrides default 
	 * {@link Ext.form.CheckboxGroup#getModelData} implementation returning a 
	 * data object containing the {@link Ext.form.field.Radio#inputValue inputValue} 
	 * of the first checked radio.
	 */
	getModelData: function() {
		var me = this, first, formId, data = {};
		if(!me.singleValue) {
			return me.callParent(arguments);
			
		} else {
			first = me.items.first();
			formId = first ? first.getFormId() : null;
			me.items.each(function(item) {
				if((item.getFormId() === formId) && (item.getValue() === true)) {
					data[me.name] = item.inputValue;
				}
			});
			return data;
		}
	}
});
