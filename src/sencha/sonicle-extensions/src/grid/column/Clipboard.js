/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Clipboard', {
	extend: 'Ext.grid.column.Action',
	alias: 'widget.soclipboardcolumn',
	
	align: 'center',
	
	/**
	 * @cfg {String} tooltipText
	 */
	tooltipText: 'Copy to clipboard',
	
	constructor: function(cfg) {
		var me = this;
		cfg = Ext.apply(cfg || {}, {
			items: [{
				iconCls: 'fa fa-files-o',
				tooltip: me.tooltipText
			}]
		});
		me.callParent([cfg]);
	}
});
