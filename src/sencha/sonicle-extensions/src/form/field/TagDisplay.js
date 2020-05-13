/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.TagDisplay', {
	extend: 'Sonicle.form.field.Tag',
	alias: 'widget.sotagdisplayfield',
	
	hideTrigger: true,
	readOnly: true,
	forceSelection: false,
	createAsDummy: true,
	
	// Remove field borders
	inputWrapCls: '', // Remove default styling for element wrapping the input element
	triggerWrapCls: '', // Remove default styling for div wrapping the input element and trigger button(s)
	fieldStyle: 'background:none;', // Remove the input element's background
	// --------------------
	growMax: 45,
	
	constructor: function(cfg) {
		var me = this, 
				icfg = Ext.apply({}, cfg, me.getInitialConfig()), ttpl;
		
		// Define proper tipTpl using configured displayField
		if (icfg.displayField) {
			ttpl = '{' + icfg.displayField + '}';
			if (Ext.isString(icfg.sourceField)) ttpl += '<tpl if="' + icfg.sourceField + ' == \'\'"><tpl else> ({' + icfg.sourceField + '})</tpl>'
			cfg.tipTpl = ttpl;
		}
		me.callParent([cfg]);
	},
	
	onLoad: function(store, records, success) {
		var me = this;
		me.callParent(arguments);
		if (success) me.updateValue();
	}
});
