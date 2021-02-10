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
	
	/**
	 * True to calculate width automatically based on action item's count.
	 * Set to a number to arrange the with on a fixed number of items.
	 * @param {Boolean|Number} [autoWidth=true]
	 */
	autoWidth: true,
	
	/**
	 * Reserved space to add before and after when calculating column width. 
	 * @param {Number} [itemsPadding=10]
	 */
	itemsPadding: 5,
	
	constructor: function(cfg) {
		var me = this,
				items = cfg.items || me.items || [me],
				width = cfg.width || me.width;
		//if (Ext.isArray(items) && !width) {
		//	cfg.width = (10 + (items.length * 16) + 10);
		//}
		me.callParent([cfg]);
		
		if (Ext.isArray(items) && !width) {
			me.on('afterrender', function() {
				me.setWidth(me.itemsPadding * 2 + ((me.autoWidth !== true && Ext.isNumber(me.autoWidth)) ? me.autoWidth : items.length) * me.measureActionWidth());
			}, me, {single: true});
		}
	},
	
	privates: {
		measureActionWidth: function() {
			var me = this,
					view = me.getView(),
					sto = me.getView().getStore(),
					html, width;
			
			if (sto) {
				try {
					html = me.defaultRenderer(null, {}, sto.createModel({}), -1, -1, sto, view);
				} catch (e) {}
				if (html) {
					// If the first action is hidden dinamically programmatically, wrong measures
					// are returned on the dummy element. Make sure to disarm here any visibility 
					// modification in order to get the real width.
					if (html.indexOf('style') === -1) {
						html = html.replace('></', ' style="display:inline-block !important;"></');
					} else {
						html = html.replace('style="', 'style="display:inline-block !important;');
					}
					var ctxId = Ext.id(null, 'so-actioncolumn-dummy-'),
							ctxEl = Ext.getBody().appendChild({
								id: ctxId,
								tag: 'div',
								style: 'visibility:hidden;pointer-events:none;border:none;',
								html: html
							}),
							act0El;
					
					act0El = ctxEl.down('.x-action-col-0');
					if (act0El) {
						width = act0El.getWidth(true) + act0El.getMargin('lr') + act0El.getPadding('lr');
					}
					Ext.defer(function() {
						Ext.fly(ctxId).destroy();
					}, 10);
				}
			}
			return width || 16;
		}
	}
});
