/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Action', {
	extend: 'Ext.grid.column.Action',
	alias: 'widget.soactioncolumn',
	
	draggable: false,
	hideable: false,
	groupable: false,
	align: 'center',
	
	constructor: function(cfg) {
		var me = this,
				items = cfg.items || me.items || [me],
				width = cfg.width || me.width;
		if (Ext.isArray(items) && !width) {
			cfg.width = (10 + (items.length * 20) + 10);
		}
		me.callParent([cfg]);
	}
});
