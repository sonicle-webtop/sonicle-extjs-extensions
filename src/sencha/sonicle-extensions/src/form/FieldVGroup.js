/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.FieldVGroup', {
	extend: 'Ext.form.FieldContainer',
	alias: ['widget.sofieldvgroup'],
	requires: [
		'Sonicle.Utils'
	],
	
	stretchWidth: true,
	
	componentCls: 'so-'+'fieldvgroup',
	
	constructor: function(cfg) {
		var me = this,
			SoU = Sonicle.Utils,
			icfg = SoU.getConstructorConfigs(me, cfg, ['layout', {stretchWidth: true}, 'defaults']),
			layout = icfg.layout || {};
		
		layout.type = 'vbox';
		cfg.layout = layout;
		cfg.defaults = Ext.merge(icfg.defaults || {}, me.createItemDefaults(icfg));
		me.callParent([cfg]);
	},
	
	privates: {
		createItemDefaults: function(icfg) {
			var obj = {};
			if (icfg.stretchWidth === true) obj.width = '100%';
			return Ext.apply(obj, {
				labelAlign: 'top',
				labelSeparator: ''
			});
		}
	}
});