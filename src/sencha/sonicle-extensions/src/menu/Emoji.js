/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.menu.Emoji', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.soemojimenu',
	requires: [
		'Sonicle.picker.Emoji'
	],
	
	/**
	 * @cfg {Object} pickerConfig 
	 * A config object that will be applied to the menu's picker.
	 * Any of the config options available for Sonicle.picker.Emoji can be specified here.
	 */
	pickerConfig: null,
	
	/**
	 * @cfg {Boolean} hideOnClick 
	 * False to continue showing the menu after a color is selected.
	 */
	hideOnClick: true,
	
	/**
	 * @property {Sonicle.picker.Emoji} picker
	 * The {@link Sonicle.picker.Emoji} instance for this menu.
	 */
	
	/**
	 * @event select
	 */
	
	/**
	 * @event click
	 * @private
	 */
	
	initComponent: function() {
		var me = this,
				cfg = Ext.apply({}, me.initialConfig);
		
		// Ensure we don't get duplicate listeners 
		delete cfg.listeners;
		
		Ext.apply(me, {
			plain: true,
			showSeparator: false,
			bodyPadding: 0,
			items: Ext.apply(cfg.pickerConfig || {}, {
				xtype: 'soemojipicker'
			}, {
				cls: 'so-menu-emoji-item',
				margin: 0
			})
		});
		
		me.callParent(arguments);
		
		me.picker = me.down('soemojipicker');
		me.relayEvents(me.picker, ['select']);
		if (me.hideOnClick) {
			me.on('select', me.hidePickerOnSelect, me);
		}
	},
	
	privates: {
		hidePickerOnSelect: function() {
			Ext.menu.Manager.hideAll();
		}
	}
});
