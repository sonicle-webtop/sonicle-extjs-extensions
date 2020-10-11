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
		//if (Ext.isArray(items) && !width) {
		//	cfg.width = (10 + (items.length * 16) + 10);
		//}
		me.callParent([cfg]);
		
		if (Ext.isArray(items) && !width) {
			me.on('afterrender', function() {
				me.setWidth(10 + items.length * me.measureActionWidth() + 10);
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
