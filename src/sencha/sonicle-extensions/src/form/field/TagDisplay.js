/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.TagDisplay', {
	extend: 'Sonicle.form.field.Tag',
	alias: 'widget.sotagdisplayfield',
	
	readOnly: true,
	hideTrigger: true,
	forceSelection: false,
	useDummyItem: true,
	growMaxLines: 2,
	
	// Remove field borders
	inputWrapCls: '', // Remove default styling for element wrapping the input element
	triggerWrapCls: '', // Remove default styling for div wrapping the input element and trigger button(s)
	fieldStyle: 'background:none;', // Remove the input element's background
	// --------------------
	
	constructor: function(cfg) {
		cfg = cfg || {};
		var me = this,
			icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, ['displayField', 'sourceField']),
			ttpl;
		
		// Define proper tipTpl using configured displayField
		if (icfg.displayField) {
			ttpl = '{' + icfg.displayField + '}';
			if (Ext.isString(icfg.sourceField)) ttpl += '<tpl if="' + icfg.sourceField + ' == \'\'"><tpl else> ({' + icfg.sourceField + '})</tpl>';
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
