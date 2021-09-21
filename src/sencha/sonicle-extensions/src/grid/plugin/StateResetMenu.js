/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.plugin.StateResetMenu', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.so-gridstateresetmenu',
	mixins: [
		'Ext.mixin.Observable'
	],
	
	id: 'gridstateresetmenu',
	
	/**
	 * @event stateresetclick
	 * Fires when reset menu-item was clicked
	 * @param {Sonicle.grid.plugin.StateResetMenu} this This plugin
	 * @param {Ext.grid.Panel} grid The grid
	 */
	
	menuStateResetText: 'Reset columns',
	menuStateResetTooltip: undefined,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.mixins.observable.constructor.call(me);
	},
	
	init: function(grid) {
		var me = this,
				headerCt;
		
		me.grid = grid;
		headerCt = grid.headerCt;
		
		me.headerCtListeners = headerCt.on({
			menucreate: me.onMenuCreate,
			scope: me,
			destroyable: true
		});
	},
	
	destroy: function() {
		var me = this;
		Ext.destroy(me.headerCtListeners);
		me.sep = Ext.destroy(me.sep);
		me.stateResetMenuItem = Ext.destroy(me.stateResetMenuItem);
		me.clearListeners();
		me.callParent();
	},
	
	privates: {
		onMenuCreate: function(headerCt, menu) {
			menu.on({
				beforeshow: this.onMenuBeforeShow,
				scope: this
			});
		},
		
		onMenuBeforeShow: function(menu) {
			var me = this,
					menuItem = me.stateResetMenuItem;
			if (!menuItem || menuItem.destroyed) {
				menuItem = me.stateResetMenuItem = me.addMenuItem(menu, Ext.isEmpty(me.grid.getStateId()));
			}
		},
		
		addMenuItem: function(menu, disabled) {
			var me = this;
			
			// only add separator if there are other menu items
			if (menu.items.length) me.sep = menu.add('-');
			
			return menu.add({
				itemId: 'statereset',
				text: me.menuStateResetText,
				tooltip: me.menuStateResetTooltip,
				disabled: disabled,
				handler: function() {
					me.fireEvent('stateresetclick', me, me.grid);
				}
			});
		}
	}
});
