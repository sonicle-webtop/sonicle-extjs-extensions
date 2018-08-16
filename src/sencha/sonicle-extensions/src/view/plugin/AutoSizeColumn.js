/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.view.plugin.AutoSizeColumns', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.soautosizecolumns',

	init: function(cmp) {
		var me = this;
		if (!cmp.isXtype('dataview')) Ext.raise('This plugin can be used on Ext.view.View components');
		me.setCmp(cmp);
		cmp.on('refresh', me.onCmpRefresh, me);
	},
	
	onCmpRefresh: function() {
		
	}
});
