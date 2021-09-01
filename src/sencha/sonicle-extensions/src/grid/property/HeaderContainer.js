/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.property.HeaderContainer', {
	extend: 'Ext.grid.header.Container',
	
	constructor :function(gp, sto) {
		var me = this,
				nameField = gp.nameField,
				valueField = gp.valueField,
				editableField = gp.editableField,
				notEditableText = gp.notEditableText,
				defaultValueField = gp.defaultValueField,
				items = [];
		me.grid = gp;
		me.store = sto;
		
		// Inject before columns
		Ext.iterate(gp.beforeColumns, function(cfg) {
			items.push(Ext.apply(cfg, {
				menuDisabled: true,
				sortable: false
			}));
		});
		
		// Inject name column
		items.push({
			itemId: nameField,
			header: gp.nameColText,
			dataIndex: nameField,
			renderer: function(val, meta, rec) {
				var s = '';
				if (!Ext.isEmpty(editableField) && rec.get(editableField) === false) {
					s += '<i class="fa fa-lock" aria-hidden="true" '+Sonicle.Utils.generateTooltipAttrs(notEditableText)+' style="margin-right:5px;font-size:initial"></i>';
				}
				return s + val;
			},
			/*
			editor: {
				xtype: 'textfield',
				selectOnFocus: true,
				allowBlank: false
			},
			*/
			scope: me,
			menuDisabled: true,
			sortable: false,
			flex: 2
		});
		
		if (gp.showDefaultValueColumn === true && !Ext.isEmpty(defaultValueField)) {
			items.push({
				itemId: defaultValueField,
				header: gp.defaultValueColText,
				dataIndex: defaultValueField,
				renderer: me.getValueCellRenderer(false),
				scope: me,
				menuDisabled: true,
				sortable: false,
				flex: 1
			});
		}
		
		// Inject value column
		items.push({
			itemId: valueField,
			header: gp.valueColText,
			dataIndex: valueField,
			renderer: me.getValueCellRenderer(true),
			editor: {
				xtype: 'textfield',
				selectOnFocus: true
			},
			getEditor: me.getCellEditor.bind(me),
			scope: me,
			menuDisabled: true,
			sortable: false,
			flex: 1
		});
		me.valueColIndex = items.length -1;
		
		// Inject after columns
		Ext.iterate(gp.moreColumns, function(cfg) {
			items.push(Ext.apply(cfg, {
				menuDisabled: true,
				sortable: false
			}));
		});
		
		me.callParent([{
			isRootHeader: true,
			items: items
		}]);
	},
	
	getValueColumn: function() {
		var me = this;
		return Ext.isNumber(me.valueColIndex) ? me.items.getAt(me.valueColIndex) : undefined;
	},
	
	privates: {
		getValueCellRenderer: function(applyDefValueCls) {
			return function(val, meta, rec) {
				var me = this,
						grid = me.grid,
						renderersMap = grid.renderersMap,
						typeField = grid.typeField,
						defaultValueField = grid.defaultValueField,
						defaultValueCls = grid.defaultValueCls,
						result = val,
						renderer;

				if (!Ext.isEmpty(typeField)) {
					renderer = renderersMap[rec.get(typeField)];
					if (Ext.isFunction(renderer)) result = renderer(val);
				}
				if (applyDefValueCls && !Ext.isEmpty(defaultValueField) && val === rec.get(defaultValueField)) {
					if (Ext.isEmpty(defaultValueCls)) meta.tdCls += grid.notEditableCls;
				}
				return Ext.util.Format.htmlEncode(result);
			};
		},
		
		getCellEditor: function(rec){
			return this.grid.findCellEditor(rec, this);
		}
	}
});
