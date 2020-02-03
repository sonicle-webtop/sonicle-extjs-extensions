/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.menu.StoreMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.sostoremenu',
	
	mixins: [
		'Ext.util.StoreHolder'
	],
	
	/**
	 * @cfg {Boolean} useItemIdPrefix
	 * `true` to add a prefix to item record ID in order to avoid errors.
	 * We cannot add this by default due compatibility issues, so please use it with `true`.
	 */
	useItemIdPrefix: false,
	
	config: {
		/**
		 * @cfg {Mixed|Mixed[]} checkedItems
		 * IDs of menu items to mark as checked.
		 */
		checkedItems: null
	},
	
	/**
	 * @cfg {String} [itemClass]
	 * The customized class type to use during the creation of store items.
	 * If not specified `Ext.menu.Item` will be used.
	 */
	
	/**
	 * @cfg {Function} [itemCfgCreator]
	 * A function which is used as a item config creation function, it can be 
	 * used to customize default item config.
	 * @param {Ext.data.Model} rec The item's record
	 * @return {Object} The item config
	 */
	
	/**
	 * @cfg {String} [textField=text]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as text.
	 */
	textField: 'text',
	
	/**
	 * @cfg {String} tagField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as tag data.
	 */
	tagField: null,
	
	/**
	 * @cfg {String} iconField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as icon.
	 */
	iconField: null,
	
	/**
	 * @cfg {String} iconClsField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as iconCls.
	 */
	iconClsField: null,
	
	/**
	 * @cfg {Object/Object[]} topStaticItems
	 * A single item, or an array of child Components to be added to this menu before store items.
	 */
	topStaticItems: undefined,
	
	/**
	 * @cfg {Object/Object[]} bottomStaticItems
	 * A single item, or an array of child Components to be added to this menu after store items.
	 */
	bottomStaticItems: undefined,
	
	/**
	 * @private
	 */
	itemIdPrefix: 'stoitm-',
	
	/**
	 * @private
	 * @property {Boolean} itemsInitialized
	 */
	
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
		if (store) {
			if (store.autoCreated) this.textField = 'field1';
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
		if (me.store && !me.store.loaded) me.store.load();
	},
	
	onStoreDataChanged: function() {
		this.updateMenuItems();
	},
	
	onStoreLoad: function(store, records, success) {
		if (success) this.updateMenuItems();
	},
	
	updateCheckedItems: function(nv, ov) {
		var me = this,
				arr = Ext.isArray(nv) ? nv : [nv];
		if (me.store && (me.itemsInitialized === true)) {
			me.store.each(function(rec) {
				var chk = arr.indexOf(rec.getId()) !== -1 ? true : false,
						itm = me.getComponent(me.buildItemId(rec));
				if (itm) itm.setChecked(chk, false);
			});
		}
	},
	
	updateMenuItems: function() {
		var me = this,
			topItems = me.topStaticItems || me.staticItems,
			bottomItems = me.bottomStaticItems;
		
		if (me.store) {
			Ext.suspendLayouts();
			me.removeAll();
			if (topItems) me.add(topItems);
			me.store.each(function(rec) {
				me.add(me.createStoreItem(rec));
			});
			if (bottomItems) me.add(bottomItems);
			Ext.resumeLayouts(true);
			me.itemsInitialized = true;
		}
	},
	
	createStoreItem: function(rec) {
		var me = this,
				textFld = me.textField,
				iconFld = me.iconField,
				iconClsFld = me.iconClsField,
				tagFld = me.tagField,
				cfg = Ext.callback(me.itemCfgCreator, me, [rec]);
		
		return Ext.apply({
			itemId: me.buildItemId(rec),
			text: rec.get(textFld),
			icon: iconFld ? rec.get(iconFld) : undefined,
			iconCls: iconClsFld ? rec.get(iconClsFld) : undefined,
			tag: tagFld ? rec.get(tagFld) : undefined
		}, Ext.isObject(cfg) ? cfg : {}, {
			xclass: me.itemClass || 'Ext.menu.Item'
		});
	},
	
	privates: {
		buildItemId: function(rec) {
			return this.useItemIdPrefix ? this.itemIdPrefix + rec.getId() : rec.getId();
		}
	}
});
