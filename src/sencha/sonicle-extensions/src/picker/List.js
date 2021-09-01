/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
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
	 * @cfg {Number} [minSelections=1] Minimum number of selections allowed.
	 */
	minSelections: 1,
	
	/**
	 * @cfg {Number} [maxSelections=Number.MAX_VALUE] Maximum number of selections allowed.
	 */
	maxSelections: Number.MAX_VALUE,
	
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
	 *   - `button` : String
	 * The pressed button: ok or yes
	 */
	
	/**
	 * @cfg {Object} scope 
	 * The scope (`this` reference) in which the `{@link #handler}` function will be called.
	 * Defaults to this ListPicker instance.
	 */
	
	/**
	 * @cfg {String} valueField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as value.
	 */
	valueField: null,
	
	/**
	 * @cfg {String} displayField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as display value.
	 */
	displayField: null,
	
	/**
	 * @cfg {String} searchField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as field used in searches.
	 */
	searchField: null,
	
	/**
	 * @cfg {Mixed[]} skipValues
	 * Array of values whose matching items will be removed from visualization.
	 */
	skipValues: null,
	
	groupText: '',
	emptyText: 'No items to display',
	searchText: 'Search...',
	selectedText: '{0} items selected',
	okText: 'OK',
	yesText: null,
	cancelText: 'Cancel',
	
	/**
	 * @event cancelclick
	 * Fires when the cancel button is pressed.
	 * @param {Sonicle.picker.List} this
	 */
	
	/**
	 * @event okclick
	 * Fires when the OK button is pressed.
	 * @param {Sonicle.picker.List} this
	 */
	
	/**
	 * @event yesclick
	 * Fires when the YES button is pressed.
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
		
		me.selModel = multi ? 'checkboxmodel' : 'rowmodel';
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
			me.dockedItems = me.buildDockedItems();
		}
		
		me.fbar = [
			{
				xtype: 'tbtext',
				reference: 'txtselected'
			},
			'->', {
				xtype: 'button',
				reference: 'btnok',
				text: me.okText,
				disabled: true,
				handler: function() {
					me.fireEvent('okclick', me);
					me.firePick(me.getSelection(), 'ok');
				}
			}, {
				xtype: 'button',
				reference: 'btnyes',
				text: me.yesText,
				hidden: Ext.isEmpty(me.yesText),
				disabled: true,
				handler: function() {
					me.fireEvent('yesclick', me);
					me.firePick(me.getSelection(), 'yes');
				}
			}, {
				xtype: 'button',
				text: me.cancelText,
				handler: function() {
					me.fireEvent('cancelclick', me);
				}
			}
		];
		
		me.callParent(arguments);
		if (me.store) me.applySkipFilter(me.skipValues);
		
		me.on('beforeselect', me.onBeforeSelect, me);
		me.on('selectionchange', me.onSelectionChange, me);
		me.on('rowdblclick', me.onRowDblClick, me);
		me.on('afterrender', function() {
			me.lookupReference('searchField').focus();
		}, me, {single: true});
	},
	
	destroy: function() {
		var me = this;
		if (me.store) {
			me.applySearchFilter(null);
			me.applySkipFilter(null);
		}
		me.callParent();
	},
	
	setSkipValues: function(skipValues) {
		var me = this;
		me.skipValues = skipValues;
		if (me.store) me.applySkipFilter(skipValues);
	},
	
	search: function(text) {
		this.applySearchFilter(text);
	},
	
	firePick: function(recs, button) {
		var me = this,
				vfld = me.valueField,
				handler = me.handler,
				values = [];
		
		Ext.iterate(recs, function(rec) {
			values.push(vfld ? rec.get(vfld) : rec.getId());
		});
		me.fireEvent('pick', me, values, recs, button);
		if (handler) handler.call(me.scope || me, me, values, recs, button);
	},
	
	privates: {
		buildDockedItems: function() {
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
		
		applySkipFilter: function(valuesToSkip) {
			var me = this,
					field = me.valueField,
					filters = me.getStore().getFilters(),
					fi = filters.getByKey('solistpicker-skip');

			filters.beginUpdate();
			if (fi) filters.remove(fi);
			if (field && Ext.isArray(valuesToSkip)) {
				filters.add(new Ext.util.Filter({
					id: 'solistpicker-skip',
					filterFn: function(rec) {
						return valuesToSkip.indexOf(rec.get(field)) === -1;
					}
				}));
			}
			filters.endUpdate();
		},
		
		applySearchFilter: function(value) {
			var me = this,
					filters = me.getStore().getFilters(),
					fi = filters.getByKey('solistpicker-search');
			
			if (value) {
				filters.beginUpdate();
				if (fi) {
					fi.setValue(value);
				} else {
					filters.add(new Ext.util.Filter({
						id: 'solistpicker-search',
						anyMatch: me.anyMatch,
						caseSensitive: me.caseSensitiveMatch,
						property: me.searchField,
						value: value
					}));
				}
				filters.endUpdate();
			} else if (fi) {
				filters.remove(fi);
			}
		},
		
		onSearchChange: function(s) {
			this.search(s.getValue());
		},
		
		onSearchSpecialkey: function(s, e) {
			if (e.getKey() === e.DOWN) this.getSelectionModel().select(0);
		},
		
		onBeforeSelect: function(s) {
			var me = this;
			if (me.allowMultiSelection && s.getCount()+1 > me.maxSelections) {
				return false;
			}
		},
		
		onSelectionChange: function(s, sel) {
			var me = this,
					min = me.minSelections,
					count = sel.length,
					minCount = Ext.isNumber(min) && (min > 0) ? me.minSelections : 1,
					disabled = count < minCount;
			me.lookupReference('btnok').setDisabled(disabled);
			me.lookupReference('btnyes').setDisabled(disabled);
			if (me.allowMultiSelection && sel) {
				me.lookupReference('txtselected').setHtml(Ext.String.htmlEncode(Ext.String.format(me.selectedText, sel.length)));
			}
		},
		
		onRowDblClick: function(s, rec) {
			if (!this.allowMultiSelection) {
				this.firePick([rec]);
			}
		}
	}
});
