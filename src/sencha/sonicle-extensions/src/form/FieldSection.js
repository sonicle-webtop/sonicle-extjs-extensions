/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.FieldSection', {
	extend: 'Sonicle.form.FieldVGroup',
	alias: ['widget.sofieldsection'],
	requires: [
		'Sonicle.plugin.LabelableIcon'
	],
	
	componentCls: 'so-'+'fieldsection',
	
	labelWidth: 16,
	labelAlign: 'left',
	hideEmptyLabel: false,
	
	constructor: function(cfg) {
		var me = this,
			SoU = Sonicle.Utils,
			icfg = SoU.getConstructorConfigs(me, cfg, ['plugins']);
		cfg.plugins = SoU.mergePlugins(icfg.plugins, 'solabelableicon');
		me.callParent([cfg]);
	}
});