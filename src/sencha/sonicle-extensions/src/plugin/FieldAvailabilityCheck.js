/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.FieldAvailabilityCheck', {
	extend: 'Sonicle.plugin.FieldIcon',
	alias: 'plugin.sofieldavailabilitycheck',
	requires: [
		'Sonicle.String'
	],
	
	iconAlign: 'afterInput',
	
	/**
	 * @cfg {Function} checkAvailability
	 * @param {Mixed} value The value to check.
	 * @param {Function} done The callback to call after check is done.
	 * @param {Boolean} done.result The check result: `true` if available, `false` otherwise.
	 * @param {Ext.form.Field} field The field this plugin is bound to.
	 * @param {Sonicle.plugin.FieldAvailabilityCheck} plugin This Plugin.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope (**this** reference) in which the `{@link #checkAvailability}` is executed. Defaults to this Plugin.
	 */
	
	/**
	 * @cfg {Number} changeBuffer
	 * Defines a timeout in milliseconds for buffering change events that fire 
	 * in rapid succession. Defaults to 500 milliseconds.
	 */
	changeBuffer: 500,
	
	/**
	 * @cfg {String} baseIconCls
	 */
	
	failureIconCls: 'fas fa-spinner fa-pulse',
	checkingIconCls: 'fas fa-spinner fa-pulse',
	availableIconCls: 'far fa-check-circle',
	unavailableIconCls: 'far fa-times-circle',
	availableTooltipText: "'{0}' is available",
	unavailableTooltipText: "'{0}' is already in use",
	
	init: function(field) {
		var me = this;
		me.callParent(arguments);
		field.on('change', me.onFieldChange, me, {buffer: me.changeBuffer || 500});
	},
	
	destroy: function() {
		var me = this,
			field = me.getCmp();
		field.un('change', me.onFieldChange, me);
		me.callParent();
	},
	
	privates: {
		onFieldChange: function(s, nv, ov) {
			var me = this,
				field = me.getCmp();
			
			if (Ext.isFunction(me.checkAvailability) && field.isValid()) {
				if (Ext.callback(me.checkAvailability, me.scope, [nv, Ext.bind(me.checkDone, me, [nv], 0), field, me]) !== false) {
					me.checkStart();
				} else {
					me.setIconCls(null);
				}
			} else if (!field.isValid()) {
				me.setIconCls(null);
			}
		},
		
		checkStart: function() {
			var me = this;
			me.setIconCls(Sonicle.String.join(' ', me.baseIconCls, me.checkingIconCls));
			me.setTooltip(false);
		},
		
		checkDone: function(value, available) {
			var me = this,
				format = Ext.String.format,
				cls = me.failureIconCls,
				ttip;
			
			if (available === true) {
				cls = me.availableIconCls;
				ttip = format(me.availableTooltipText, value);
			} else if (available === false) {
				cls = me.unavailableIconCls;
				ttip = format(me.unavailableTooltipText, value);
			} else if (Ext.isString(available)) {
				ttip = available;
			}
			
			me.setIconCls(Sonicle.String.join(' ', me.baseIconCls, cls));
			me.setTooltip(ttip);
		}
	}
});	
