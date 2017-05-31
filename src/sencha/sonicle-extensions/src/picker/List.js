/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.picker.List', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.solistpicker',
	requires: [
		'Sonicle.form.trigger.Clear'
	],
	
	referenceHolder: true,
	
	groupText: '',
	emptyText: 'No items to display',
	searchText: 'Search...',
	okText: 'Ok',
	cancelText: 'Cancel',
	
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
	 * @cfg {Boolean} [allowMultiSelection=false]
	 * Configure as `true` to enable multiselection mode.
	 * A button in bottom toolbar will allow selection confirmation 
	 */
	allowMultiSelection: false,
	
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
	 * @cfg {Function} handler
	 * Optional. A function that will handle the pick event of this picker.
	 * The handler is passed the following parameters:
	 *   - `picker` : Sonicle.picker.List
	 * This component.
	 *   - `value` : Mixed
	 * The selected value, according to {@link #valueField}.
	 *   - `record` : Ext.data.Model
	 * The whole record associated to the value.
	 */
	
	/**
	 * @cfg {Object} scope 
	 * The scope (`this` reference) in which the `{@link #handler}` function will be called.
	 * Defaults to this ListPicker instance.
	 */
	
	/**
	 * @event cancelclick
	 * Fires when the cancel button is pressed.
	 * @param {Sonicle.picker.List} this
	 */
	
	/**
	 * @event okclick
	 * Fires when the ok button is pressed.
	 * @param {Sonicle.picker.List} this
	 */
	
	/**
     * @event pick
     * Fires when a value is selected (corresponding row has been dblclicked).
	 * @param {Sonicle.picker.List} this
	 * @param {Mixed[]} values The selected values, according to {@link #valueField}.
	 * @param {Ext.data.Model[]} records The records associated to values.
     */
	
	initComponent: function() {
		var me = this,
				multi = (me.allowMultiSelection === true);
		
		me.selModel = {
			type: 'rowmodel',
			mode: multi ? 'MULTI' : 'SINGLE'
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
			}];
		}
		if (me.searchField) {
			me.dockedItems = me.makeDockedItems();
		}
		
		me.buttons = [{
			text: me.cancelText,
			handler: function() {
				me.fireEvent('cancelclick', me);
			}
		}];
		if (multi) {
			me.buttons.unshift({
				text: me.okText,
				handler: function() {
					me.fireEvent('okclick', me);
					me.firePick(me.getSelection());
				}
			});
		}
		
		me.callParent(arguments);
		me.on('rowdblclick', me.onRowDblClick, me);
		me.on('afterrender', function() {
			me.lookupReference('searchField').focus();
		}, me, {single: true});
	},
	
	makeDockedItems: function() {
		var me = this;
		return [{
			xtype: 'textfield',
			reference: 'searchField',
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
	
	search: function(text) {
		var me = this,
				filters = me.getStore().getFilters(),
				filter = me.searchFilter;

		if(text) {
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
		onSearchChange: function(s) {
			this.search(s.getValue());
		},
		
		onSearchSpecialkey: function(s, e) {
			if(e.getKey() === e.DOWN) this.getSelectionModel().select(0);
		},
		
		onRowDblClick: function(s, rec) {
			this.firePick([rec]);
		}
	}
});
