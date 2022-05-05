/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.FieldChangeDetector', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sofieldchangedetector',
	
	/**
	 * @cfg {Function/String} handler
	 * A function called when the button is clicked (can be used instead of change detected event).
	 * In order to track this 'changed' status, the initial value when entering 
	 * the field is historicized and compared with value at blur time.
	 * @param {Ext.form.Field} field The field this plugin is bound to.
	 * @param {Sonicle.plugin.FieldChangeDetector} plugin This Plugin.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope (**this** reference) in which the `{@link #handler}` is executed. Defaults to this Plugin.
	 */
	
	/**
     * @event changedetected
	 * Fires when a change in field's value is detected after processing user input.
	 * In order to track this 'changed' status, the initial value when entering 
	 * the field is historicized and compared with value at blur time.
     */
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		field.on('focus', me.onFieldFocus, me);
		field.on('blur', me.onFieldBlur, me);
	},
	
	destroy: function() {
		var me = this,
			field = me.getCmp();
		field.un('blur', me.onFieldBlur, me);
		field.un('focus', me.onFieldFocus, me);
		delete me._lastValue;
		me.callParent();
	},
	
	privates: {
		onFieldFocus: function(s) {
			this._lastValue = s.getValue();
		},
		
		onFieldBlur: function(s) {
			var me = this,
				field = me.getCmp();
			if (!(me._lastValue === s.getValue())) {
				field.fireEvent('changedetected', field, me);
				Ext.callback(me.handler, me.scope, [field, me]);
			}
		}
	}
});	
