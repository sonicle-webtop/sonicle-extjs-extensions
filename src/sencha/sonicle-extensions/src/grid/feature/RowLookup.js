/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.feature.RowLookup', {
	extend: 'Ext.grid.feature.Feature',
	alias: 'feature.sorowlookup',
	
	config: {
		/**
		 * @cfg {Ext.data.Store} lookupStore
		 * The Store that columns should use as extra data source
		 */
		lookupStore: null
	},
	
	init: function(grid) {
		var me = this,
				view = me.view = grid.getView();
		
		me.setLookupStore(me.lookupStore);
		view.rowLookupFeature = me;
		view.renderRow = Ext.Function.interceptBefore(view, 'renderRow', function(record, rowIdx, out) {
			if (record) {
				if (record.lookupRecord === undefined) {
					var lrec = me.getLookupRecord(record.getId());
					record.lookupRecord = lrec ? lrec.clone() : null;
				}
			}
		});
		/*
		view.renderCell = Ext.Function.interceptBefore(view, 'renderCell', function(column, record, recordIndex, rowIndex, columnIndex, out, parent) {
			// Parent argument usage is an undocumented feature, see rowTpl in Ext.view.Table class.
			if (parent) this.cellValues.lookupRecord = parent.lookupRecord;
		});
		*/
		me.callParent(arguments);
	},
	
	destroy: function() {
		this.setLookupStore(null);
		this.callParent();
	},
	
	applyLookupStore: function(store) {
		var me = this;
		if (store) {
			store = Ext.data.StoreManager.lookup(store);
			if (store.loadCount === 0) {
				me.view.blockRefresh = true;
				store.on('load', me.onLookupStoreLoad, me, {single: true});
			}
		} else {
			if (me.lookupStore) {
				me.lookupStore.un('load', me.onLookupStoreLoad, me);
			}
		}
		return store;
	},
	
	onLookupStoreLoad: function() {
		this.view.blockRefresh = false;
		this.view.refresh();
	},
	
	getLookupRecord: function(id) {
		var lsto = this.lookupStore;
		return lsto ? lsto.getById(id) : null;
	}
});
