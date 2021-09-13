/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.property.Panel', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.so-propertygrid',
	
	requires: [
		'Ext.XTemplate',
		'Ext.grid.CellEditor',
		'Ext.grid.plugin.CellEditing',
		'Ext.form.field.Date',
		'Ext.form.field.Text',
		'Ext.form.field.Number',
		'Ext.form.field.ComboBox',
		'Sonicle.grid.property.HeaderContainer'
	],
	
	/**
	 * @cfg {Boolean} nameField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as property name. Required.
	 */
	nameField: null,
	
	/**
	 * @cfg {Boolean} valueField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as property value. Required.
	 */
	valueField: null,
	
	/**
	 * @cfg {String} [valueEmptyText=undefined]
	 * The text to display in empty value cells (cells with a value of `undefined`, `null`, or `''`).
	 * Defaults to `&#160;` aka `&nbsp;`.
	 */
	valueEmptyText: '\u00a0',
	
	/**
	 * @cfg {String} [valueEmptyCls=undefined]
	 * The CSS class to apply to an empty cell to style the emptyText. 
	 * This class is automatically added and removed as needed depending on the 
	 * current cell value.
	 */
	
	/**
	 * @cfg {Boolean} [typeField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as property type.
	 * Leave this empty to handle all value simply as Strings.
	 */
	typeField: null,
	
	/**
	 * @cfg {Boolean} [editableField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as property editable status.
	 * Leave this empty to not restrict editing on any property.
	 */
	editableField: null,
	
	/**
	 * @cfg {Boolean} [defaultValueField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as property default value.
	 * Leave this empty to not show any info about default value.
	 */
	defaultValueField: null,
	
	/**
	 * @cfg {Boolean} [showDefaultValueColumn=false]
	 * Set to `true` to use a dedicated column for default value instead of applying {@link #defaultValueCls} to value column.
	 * This is taken into account only if {@link #defaultValueField} is configured.
	 */
	showDefaultValueColumn: false,
	
	/**
	 * @cfg {String} dateFormat
	 */
	dateFormat: 'Y-m-d',
	
	/**
	 * @cfg {Object[]} beforeColumns
	 * A collection of {@link Ext.grid.column.Column columns} definition 
	 * objects to be added before the default ones (name, value).
	 */
	
	/**
	 * @cfg {Object[]} afterColumns
	 * A collection of {@link Ext.grid.column.Column columns} definition 
	 * objects to be added after the default ones (name, value).
	 */
	
	/**
	 * @cfg {Object} typesConfig
	 * A map of config object containing some properties:
	 * An array of data-type config object containing some properties:
	 * @param {String} type The data type. Used as map key.
	 * @param {Function} renderer A {@link Ext.grid.column.Column#renderer renderer} method to transform data before it is rendered into the column.
	 * @param {Ext.form.Field} editorField An instance to a field that will acts ad data-type editor.
	 */
	
	clicksToEdit: 1,
	
	nameColText: 'Property',
	defaultValueColText: 'Default value',
	valueColText: 'Value',
	notEditableText: 'Property NOT editable',
	trueText: 'true',
	falseText: 'false',
	
	initComponent: function() {
		var me = this;
		
		if (Ext.isEmpty(me.nameField)) Ext.raise('nameField is mandatory');
		if (Ext.isEmpty(me.valueField)) Ext.raise('valueField is mandatory');
		
		me.plugins = me.plugins || [];
		me.plugins.push({
			ptype: 'cellediting',
			clicksToEdit: me.clicksToEdit,
			listeners: {
				beforeedit: function(ed, ctx) {
					if (!Ext.isEmpty(me.editableField) && ctx.record.get(me.editableField) === false) {
						return false;
					}
				},
				edit: function(ed, ctx) {
					me.fireEvent('afteredit', me, ed, ctx);
				}
			}
		});
		
		//TODO: add support to groupField
		//TODO: add support to new prop insertion
		
		me.selModel = {
			type: 'rowmodel',
			onCellSelect: function(position) {
				var valueColumn = me.headerCt.getValueColumn();
				position.column = valueColumn;
				position.colIdx = valueColumn.getVisibleIndex();
				return this.self.prototype.onCellSelect.call(this, position);
			}
		};
		me.columns = new Sonicle.grid.property.HeaderContainer(me, me.store);
		me.callParent(arguments);
		
		// Apply customized implementation of walkCells which only goes up or down
		me.getView().walkCells = me.walkCells;
		
		// Set maps for renderers & editors
		me.renderersMap = me.createRenderersMap(me.typesConfig);
		me.editorsMap = me.createEditorsMap(me.typesConfig);
	},
	
	destroy: function() {
		var me = this;
		me.callParent();
		delete me.renderersMap;
		for (var ed in me.editorsMap) {
			if (me.editorsMap.hasOwnProperty(ed)) Ext.destroy(me.editorsMap[ed]);
		}
		delete me.editorsMap;
	},
	
	createRenderersMap: function(typesCfg) {
		var me = this,
				map = me.baseRenderers();
		
		Ext.iterate(typesCfg, function(cfg) {
			if (!Ext.isEmpty(cfg.type) && Ext.isFunction(cfg.renderer)) {
				map[cfg.type] = cfg.renderer;
			}
		});
		
		return map;
	},
	
	createEditorsMap: function(typesCfg) {
		var me = this,
				map = me.baseEditors();
		
		Ext.iterate(typesCfg, function(cfg) {
			if (!Ext.isEmpty(cfg.type) && cfg.editorField && Ext.isFunction(cfg.editorField.isXType) && cfg.editorField.isXType('field')) {
				map[cfg.type] = new Ext.grid.CellEditor({field: cfg.editorField});
			}
		});
		
		return map;
	},
	
	baseRenderers: function() {
		var me = this,
				XFmt = Ext.util.Format;
		return {
			'string': null,
			'boolean': Sonicle.grid.property.Panel.booleanRenderer(true, me.trueText, false, me.falseText),
			'number': XFmt.numberRenderer('0' + XFmt.thousandSeparator + '000' + XFmt.decimalSeparator + '00'),
			'integer': XFmt.numberRenderer('0' + XFmt.thousandSeparator + '000'),
			'date': XFmt.dateRenderer(me.dateFormat)
		};
	},
	
	baseEditors: function() {
		var me = this;
		return {
			'string': new Ext.grid.CellEditor({field: new Ext.form.field.Text({selectOnFocus: true})}),
			'boolean': new Ext.grid.CellEditor({field: Sonicle.grid.property.Panel.booleanEditorField(true, me.trueText, false, me.falseText)}),
			'number': new Ext.grid.CellEditor({field: new Ext.form.field.Number({
					selectOnFocus: true,
					allowDecimals: true
			})}),
			'integer': new Ext.grid.CellEditor({field: new Ext.form.field.Number({
					selectOnFocus: true,
					allowDecimals: false
			})}),
			'date': new Ext.grid.CellEditor({field: new Ext.form.field.Date({selectOnFocus: true})})
		};
	},
	
	findCellEditor: function(rec, col) {
		var me = this,
				editors = me.editorsMap,
				typeField = me.typeField,
				pname = rec.get(me.nameField),
				ed = editors['string'],
				ced, fld;
		
		if (!Ext.isEmpty(typeField)) {
			ced = editors[rec.get(typeField)];
			if (ced) ed = ced;
		}
		
		fld = ed.field;
		if (fld && fld.ui === 'default' && !fld.hasOwnProperty('ui')) {
			fld.ui = me.editingPlugin.defaultFieldUI;	
		}
		
		// Give the editor a unique ID because the CellEditing plugin caches them
		ed.editorId = pname;
		if (me.headerCt) me.headerCt.getValueColumn();
		return ed;
	},
	
	privates: {
		walkCells: function (pos, direction, e, preventWrap, verifierFn, scope) {
			var me = this,
					valueColumn = me.ownerCt.getValueColumn();

			if (direction === 'left') direction = 'up';
			pos = Ext.view.Table.prototype.walkCells.call(me, pos, direction, e, preventWrap, verifierFn, scope);

			// We are only allowed to navigate to the value column.
			pos.column = valueColumn;
			pos.colIdx = valueColumn.getVisibleIndex();
			return pos;
		}
	},
	
	statics: {
		booleanRenderer: function(trueValue, trueText, falseValue, falseText) {
			if (arguments.length === 2) {
				falseValue = falseText = trueText;
				trueText = trueValue;
			}
			return function(v) {
				return v === trueValue ? trueText : falseText;
			};
		},
		
		booleanEditorField: function(trueValue, trueText, falseValue, falseText) {
			if (arguments.length === 2) {
				falseValue = falseText = trueText;
				trueText = trueValue;
			}
			return new Ext.form.field.ComboBox({
				editable: false,
				store: [[trueValue, trueText], [falseValue, falseText]]
			});
		},
		
		selectEditorField: function(dataPairs) {
			return new Ext.form.field.ComboBox({
				editable: false,
				store: dataPairs
			});
		}
	}
});
