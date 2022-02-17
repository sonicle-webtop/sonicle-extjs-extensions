/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.feature.RowLookup', {
	extend: 'Ext.grid.feature.Feature',
	alias: 'feature.sorowlookup',
	mixins: [
		'Ext.util.StoreHolder'
	],
	
	init: function(grid) {
		var me = this,
				view = me.view,
				store;
		
		view.rowLookupFeature = me;
		view.renderRow = Ext.Function.interceptBefore(view, 'renderRow', function(record, rowIdx, out) {
			if (record) record.lookupRecord = me.makeRecordGetter(record);
		});
		/*
		view.renderCell = Ext.Function.interceptBefore(view, 'renderCell', function(column, record, recordIndex, rowIndex, columnIndex, out, parent) {
			// Parent argument usage is an undocumented feature, see rowTpl in Ext.view.Table class.
			if (parent) this.cellValues.lookupRecord = parent.lookupRecord;
		});
		*/
		me.callParent(arguments);
		
		store = me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store');
		me.bindStore(store, true);
	},
	
	destroy: function() {
		var me = this;
		me.bindStore(null);
		me.callParent();
	},
	
	setStore: function(newStore) {
		var me = this;
		if (me.store !== newStore) {
			if (me.isConfiguring) {
				me.store = newStore;
			} else {
				me.bindStore(newStore, /* initial */ false);
			}
		}
	},
	
	getStoreListeners: function() {
		var me = this;
		return {
			beforeload: me.onDataBeforeLoad,
			refresh: me.onDataRefresh,
			clear: me.onDataRefresh
		};
	},
	
	bindStore: function(store, initial) {
		var me = this,
				view = me.view;
		me.mixins.storeholder.bindStore.apply(me, arguments);
		
		if (store && view.componentLayoutCounter) {
			if (view.blockRefresh) {
				view.refreshNeeded = true;
			} else {
				if (store && !store.isLoading()) {
					view.refresh();
				}
			}
		}
	},
	
	privates: {
		onDataBeforeLoad: function(store) {
			var me = this,
					view = me.view;
			//console.log(view.blockRefresh);
			me.prevBlock = view.blockRefresh;
			view.blockRefresh = true;
		},
		
		onDataRefresh: function(store) {
			var me = this,
					view = me.view;
			if (me.prevBlock !== undefined) {
				//console.log('blockRefresh was '+me.prevBlock);
				view.blockRefresh = me.prevBlock;
				delete me.prevBlock;
			}
			view.updateLayout();
		},
		
		findLookupRecord: function(recordId) {
			var lsto = this.store, lrec;
			if (lsto) {
				lrec = lsto.getById(recordId);
				if (lrec) lrec = lrec.clone();
			}
			return lrec;
		},
		
		makeRecordGetter: function(record) {
			return Ext.bind(function(rowLookup) {
				var me = this;
				if (!me.rowLookupRecord) me.rowLookupRecord = rowLookup.findLookupRecord(me.getId());
				return me.rowLookupRecord;
			}, record, [this]);
		}
	}
});
