/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.FieldHGroup', {
	extend: 'Ext.form.FieldContainer',
	alias: ['widget.sofieldhgroup'],
	requires: [
		'Sonicle.Utils'
	],
	
	componentCls: 'so-'+'fieldhgroup',
	
	constructor: function(cfg) {
		var me = this,
			SoU = Sonicle.Utils,
			icfg = SoU.getConstructorConfigs(me, cfg, ['layout', 'defaults']),
			layout = icfg.layout || {};
		
		layout.type = 'hbox';
		// NB: align:end is necessary with default label alignment otherwise buttons are not aligned with field
		Ext.applyIf(layout, {align: 'end'});
		cfg.layout = layout;
		cfg.defaults = Ext.merge(icfg.defaults || {}, me.createItemDefaults());
		me.callParent([cfg]);
	},
	
	privates: {
		createItemDefaults: function() {
			return {
				labelAlign: 'top',
				labelSeparator: ''
			};
		}
	}
});