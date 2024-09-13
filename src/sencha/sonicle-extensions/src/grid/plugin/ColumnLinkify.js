/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.plugin.ColumnLinkify', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sogridcolumnlikify',
	
	linkifyCls: 'so-'+'grid-cell-inner-link',
	
	init: function(column) {
		var me = this;
		me.setCmp(column);
		me.linkifyText(column);
		me.callParent(arguments);
	},
	
	privates: {
		linkifyText: function(column) {
			var me = this;
			
			if (column.isXTypeOneOf(['soiconcolumn', 'gridcolumn'])) {
				if (column.isXType('soiconcolumn', true)) {
					column.buildHtml = Ext.Function.wrap(column.buildHtml, function(ret) {
						return Sonicle.String.replace(ret, column.iconTextCls, column.iconTextCls + ' ' + me.linkifyCls);
					});
				}
				
				//TODO: add support to other xtypes
				
				column.processEvent = Ext.Function.createInterceptor(column.processEvent, function(type, view, cell, ridx, cidx, e) {
					return !me.handleEvent.apply(me, arguments);
				}, me);
			}	
		},
		
		handleEvent: function(type, view, cell, ridx, cidx, e, rec, row) {
			var me = this,
				SoS = Sonicle.String,
				column = me.getCmp(),
				tagName = e.target.tagName.toLowerCase(),
				className = e.target.className,
				fire = function() {
					column.fireEvent('linkclick', column, ridx, rec);
				},
				handled = false;
			
			if (e.type === 'click') {
				
				//TODO: add support to other xtypes
				
				if (tagName === 'span' && column.isXType('soiconcolumn', true)) {
					if (SoS.contains(className, column.iconTextCls)) {
						fire();
						handled = true;
					}
				}
			}
			return handled;
		}
	}
});