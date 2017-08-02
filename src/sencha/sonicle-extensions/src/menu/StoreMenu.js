/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.menu.StoreMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.sostoremenu',
	
	mixins: [
		'Ext.util.StoreHolder'
	],
	
	config: {
		itemClass: 'Ext.menu.Item',
		textAsHtml: false,
		textField: 'text',
		tagField: null,
		staticItems: null
	},
	
	initComponent: function() {
		var me = this, sto;
		me.callParent(arguments);
		sto = me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store');
		me.bindStore(sto, true);
	},
	
	/**
	 * Binds a store to this instance.
	 * @param {Ext.data.AbstractStore/String} [store] The store to bind or ID of the store.
	 * When no store given (or when `null` or `undefined` passed), unbinds the existing store.
	 */
	bindStore: function(store, /* private */ initial) {
		var me = this;
		me.mixins.storeholder.bindStore.call(me, store, initial);
		store = me.getStore();
	},
	
	/**
	 * See {@link Ext.util.StoreHolder StoreHolder}.
	 */
	onBindStore: function(store, initial) {
		// We're being bound, not unbound...
		if(store) {
			if(store.autoCreated) this.textField = 'field1';
		}
	},
	
	/**
	 * See {@link Ext.util.StoreHolder StoreHolder}.
	 */
	getStoreListeners: function(store, o) {
		var me = this;
		return {
			datachanged: me.onStoreDataChanged,
			load: me.onStoreLoad
		};
	},
	
	/**
	 * private
	 */
	_loadMenuItems: function() {
		var me = this;
		if(me.store && !me.store.loaded) me.store.load();
	},
	
	onStoreDataChanged: function() {
		this.updateMenuItems();
	},
	
	onStoreLoad: function(store, records, success) {
		if(success) this.updateMenuItems();
	},
	
	updateMenuItems: function() {
		var me = this,
			textField = me.getTextField(),
			tagField = me.getTagField();
		
		if(me.store) {
			Ext.suspendLayouts();
			me.removeAll();
			if (me.staticItems) me.add(me.staticItems);
			me.store.each(function(rec) {
				me.add(Ext.create(me.getItemClass(),{
					itemId: rec.getId(),
					tag: tagField?rec.get(tagField):undefined,
					text: rec.get(textField)
				}));
			});
			Ext.resumeLayouts(true);
		}
	}
});
