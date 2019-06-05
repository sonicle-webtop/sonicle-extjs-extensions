/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.List', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.solistpanel',
	requires: [
		'Sonicle.grid.column.Action',
		'Sonicle.form.trigger.Clear'
	],
	
	//TODO: check search, it seems buggy
	
	groupText: '',
	emptyText: 'No items to display',
	searchText: 'Search...',
	removeText: 'Delete',
	
	valueField: null,
	displayField: null,
	searchField: null,
	
	/**
	 * @cfg {Boolean} [enableGrouping=false]
	 * Configure as `true` to enable grouped visualization. A grouping field
	 * must be specified using dedicated {@link Ext.data.Store#groupField Store's configuration}.
	 */
	enableGrouping: false,
	
	/**
	 * @cfg {Boolean} [anyMatch=true]
	 * Configure as `false` to disallow matching of the typed characters at any 
	 * position in the {@link #searchField}'s value.
	 */
	anyMatch: true,
	
	/**
	 * @cfg {Boolean} [caseSensitiveMatch=false]
	 * Configure as `true` to make the filtering match with exact case matching.
	 */
	caseSensitiveMatch: false,
	
	/**
	 * @event itemremoveclick
	 * Fired when delete button is clicked.
	 * @param {Ext.grid.Panel} this
	 * @param {Ext.data.Model} record
	 * @param {Number} rowIndex 
	 */
	
	initComponent: function() {
		var me = this;
		
		me.selModel = {
			type: 'rowmodel',
			mode: 'SINGLE'
		};
		me.viewConfig = {
			deferEmptyText: false,
			emptyText: me.emptyText
		};
		
		if (me.enableGrouping) {
			me.features = [{
				ftype: 'grouping',
				startCollapsed: false,
				groupHeaderTpl: (Ext.isEmpty(me.groupText) ? '' : me.groupText + ':') + '{name} ({children.length})'
			}];
		}
		if (!me.columns) {
			me.hideHeaders = true;
			me.columns = [{
				dataIndex: me.displayField,
				flex: 1
			}, {
				xtype: 'soactioncolumn',
				items: [{
					iconCls: 'fa fa-trash',
					tooltip: me.removeText,
					handler: function(g, ridx) {
						var rec = g.getStore().getAt(ridx);
						me.fireEvent('itemremoveclick', me, rec, ridx);
					}
				}]
			}];
		}
		if (me.searchField) {
			me.dockedItems = me.buildDockedItems();
		}
		
		me.callParent(arguments);
	},
	
	search: function(text) {
		var me = this,
				filters = me.getStore().getFilters(),
				filter = me.searchFilter;

		if (text) {
			filters.beginUpdate();
			if (filter) {
				filter.setValue(text);
			} else {
				me.searchFilter = filter = new Ext.util.Filter({
					id: 'search',
					anyMatch: me.anyMatch,
					caseSensitive: me.caseSensitiveMatch,
					property: me.searchField,
					value: text
				});
			}
			filters.add(filter);
			filters.endUpdate();
			
		} else if (filter) {
			filters.remove(filter);
		}
	},
	
	firePick: function(recs) {
		var me = this,
				vfld = me.valueField,
				handler = me.handler,
				values = [];
		
		Ext.iterate(recs, function(rec) {
			values.push(vfld ? rec.get(vfld) : rec.getId());
		});
		me.fireEvent('pick', me, values, recs);
		if (handler) handler.call(me.scope || me, me, values, recs);
	},
	
	privates: {
		buildDockedItems: function() {
			var me = this;
			return [{
				xtype: 'textfield',
				itemId: 'fldsearch',
				dock: 'top',
				hideFieldLabel: true,
				emptyText: me.searchText,
				triggers: {
					clear: {
						type: 'soclear'
					}
				},
				listeners: {
					change: {
						fn: me.onSearchChange,
						scope: me,
						options: {buffer: 300}
					},
					specialkey: {
						fn: me.onSearchSpecialkey,
						scope: me
					}
				}
			}];
		},
		
		onSearchChange: function(s) {
			this.search(s.getValue());
		},
		
		onSearchSpecialkey: function(s, e) {
			if (e.getKey() === e.DOWN) this.getSelectionModel().select(0);
		}
	}
});
