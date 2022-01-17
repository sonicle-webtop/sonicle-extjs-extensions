/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Lookup', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.solookupcolumn',
	uses: [
		'Sonicle.String',
		'Sonicle.Utils'
	],
	
	mixins: [
		'Ext.util.StoreHolder'
	],
	producesHTML: false,
	
	/**
	 * @cfg {String} displayField
	 * The fieldName for getting the text to display.
	 */
	displayField: '',
	
	/**
	 * @cfg {String} tooltipField
	 * The fieldName for getting the tooltip to apply to displayed text.
	 * To calculate value dynamically, configure the column with a `getTooltip` function.
	 */
	tooltipField: null,
	
	/**
	 * @cfg {Function} getTooltip
	 * A function which returns a computed tooltip.
	 */
	getTooltip: null,
	
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
			return me.buildHtml(value);
			//return me._storeValue(value);
		} else {
			me.delayRefresh = vw;
			return '';
		}
	},
	
	updater: function(cell, value) {
		cell.firstChild.innerHTML = this.buildHtml(value);
		//cell.firstChild.innerHTML = this.findRecordValue(value, this.displayField);
	},
	
	buildHtml: function(value) {
		var me = this,
				lrec = me.findLookupRecord(value),
				lval = me.findLookupValue(value, me.displayField, lrec),
				ttip = me.evalValue(value, lrec, me.tooltipField, me.getTooltip, null),
				s = '';
		if (ttip) s += '<span ' + Sonicle.Utils.generateTooltipAttrs(ttip) + '>';
		s += Sonicle.String.htmlEncode(Ext.isEmpty(lval) ? me.emptyCellText : lval);
		if (ttip) s += '</span>';
		return s;
	},
	
	/*
	_storeValue: function(value) {
		var mo = this.getStore().getById(value);
		return mo ? mo.get(this.displayField) : value;
	},
	*/
	
	privates: {
		findLookupRecord: function(value) {
			return this.getStore().getById(value);
		},
		
		findLookupValue: function(value, lookupField, rec) {
			if (!rec) rec = this.findLookupRecord(value);
			return rec ? rec.get(lookupField) : value;
		},
		
		evalValue: function(value, rec, field, getFn, fallbackValue) {
			if (rec && Ext.isFunction(getFn)) {
				return getFn.apply(this, [value, rec]);
			} else if (rec && !Ext.isEmpty(field)) {
				return rec.get(field);
			} else {
				return (fallbackValue === undefined) ? value : fallbackValue;
			}
		}
	}	
});
