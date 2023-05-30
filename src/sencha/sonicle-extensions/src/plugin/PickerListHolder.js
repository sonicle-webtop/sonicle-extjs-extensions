/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.PickerListHolder', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sopickerlistholder',
	mixins: [
		'Sonicle.mixin.DDPickerHolder'
	],
	requires: [
		'Sonicle.PopupWindow',
		'Sonicle.picker.List'
	],
	
	/**
	 * @cfg {Boolean} [pickerAllowMultiSelection=false]
	 * Configure as `true` to enable multiselection mode.
	 * A button in bottom toolbar will allow selection confirmation 
	 */
	pickerAllowMultiSelection: false,
	
	/**
	 * @cfg {String} pickerTitle
	 * The title to display on top of the picker pop-up.
	 */
	
	/**
	 * @cfg {Ext.data.Store} lookupStore
	 * The Store to lookup data.
	 */
	
	/**
	 * @cfg {String} lookupStoreValueField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as value.
	 */
	lookupStoreValueField: 'id',
	
	/**
	 * @cfg {String} lookupStoreDisplayField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as display value.
	 */
	lookupStoreDisplayField: 'desc',
	
	/**
	 * @cfg {String} lookupStoreSearchField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as field used in searches.
	 */
	lookupStoreSearchField: 'search',
	
	/**
	 * @cfg {Function/String} displayRenderer
	 * A renderer is an 'interceptor' method which can be used to transform data (value,
	 * appearance, etc.) before it is rendered.
	 * See {@link Ext.grid.column.Column#renderer renderer} for more info.
	 */
	
	ddPickerMatchOwnerWidth: false,
	
	pickerEmptyText: '',
	pickerSearchText: '',
	pickerSelectedText: '',
	pickerOkText: '',
	pickerCancelText: '',
	
	init: function(cmp) {
		var me = this;
		me.setCmp(cmp);
		me.onInitComponent();
	},
	
	doDestroy: function() {
		delete this.lookupStore;
		this.beforeDoDestroy();
	},
	
	getOwnerCmp: function() {
		return this.getCmp();
	},
	
	getOwnerBodyEl: function() {
		var me = this,
			cmp = me.getCmp();
		return cmp.rendered ? cmp.el : undefined;
	},
	
	getOwnerAlignEl: function() {
		var me = this,
			cmp = me.getCmp();
		return cmp.rendered ? cmp.el : undefined;
	},
	
	createDDPicker: function(id) {
		var me = this;
		return Ext.create({
			xtype: 'sopopupwindow',
			onEsc: function(e) {
				e.stopEvent();
				this.close();
				me.collapseDDPicker();
			},
			items: [
				{
					xtype: 'sopickerlist',
					store: {
						xclass: 'Ext.data.ChainedStore',
						source: me.lookupStore
					},
					valueField: me.lookupStoreValueField,
					displayField: me.lookupStoreDisplayField,
					displayRenderer: me.displayRenderer,
					searchField: me.lookupStoreSearchField,
					emptyText: me.pickerEmptyText,
					searchText:me.pickerSearchText,
					selectedText: me.pickerSelectedText,
					okText: me.pickerOkText,
					cancelText: me.pickerCancelText,
					allowMultiSelection: me.pickerAllowMultiSelection,
					listeners: {
						cancelclick: function() {
							me.collapseDDPicker();
						}
					},
					handler: me.onPickerOk,
					scope: me
				}
			]
		});
	},
	
	privates: {
		onPickerOk: function(s, values, recs, button) {
			var me = this,
				cmp = me.getCmp();
			if (cmp) cmp.fireEvent('pick', me, values, recs);
			me.collapseDDPicker();
		}
	}
});
