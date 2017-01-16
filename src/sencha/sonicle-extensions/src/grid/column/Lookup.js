/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Lookup', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.solookupcolumn',
	
	mixins: [
		'Ext.util.StoreHolder'
	],
	producesHTML: false,
	
	displayField: '',
	
	/**
	 * @private
	 * @property {Ext.view.View} delayRefresh
	 */
	
	initComponent: function() {
		var me = this;
		me.bindStore(me.store || 'ext-empty-store', true, true);
		me.callParent(arguments);
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
			if(store.autoCreated) this.displayField = 'field1';
		}
	},
	
	/**
	 * See {@link Ext.util.StoreHolder StoreHolder}.
	 */
	getStoreListeners: function(store, o) {
		var me = this;
		return {
			load: me.onStoreLoad
		};
	},
	
	onStoreLoad: function(store, records, success) {
		var me = this;
		if (success && me.delayRefresh) {
			// Handle case in which store value is not ready at renderer call time.
			// This performs a view refresh after a data load.
			me.delayRefresh.refresh();
			delete me.delayRefresh;
		}
	},
	
	defaultRenderer: function(value, meta, rec, ri, ci, sto, vw) {
		var me = this;
		if (me.getStore().loadCount > 0) {
			return me._storeValue(value);
		} else {
			me.delayRefresh = vw;
			return '';
		}
	},
	
	updater: function(cell, value) {
		cell.firstChild.innerHTML = this._storeValue(value);
	},
	
	_storeValue: function(value) {
		var mo = this.getStore().getById(value);
		return mo ? mo.get(this.displayField) : value;
	}
});
