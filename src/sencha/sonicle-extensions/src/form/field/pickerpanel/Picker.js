/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.pickerpanel.Picker', {
	extend: 'Ext.form.field.Picker',
	alias: ['widget.sopickerpanelfield'],
	requires: [
		'Sonicle.form.field.pickerpanel.Editor'
	],
	
	editable: false,
	
	/**
	 * @cfg {Object} pickerEditorConfig
	 */
	
	/**
	 * @cfg {String} pickerEditorClass
	 * The class-name to instantiate as Editor: it must be a sub-class of 'Sonicle.form.field.pickerpanel.Editor'.
	 */
	pickerEditorClass: 'Sonicle.form.field.pickerpanel.Editor',
	
	/**
	 * @cfg {Function/String} renderer
	 * A function to transform the raw value for display in the field.
	 * @param {Object} value The raw field {@link #value}
	 * @param {Ext.form.field.Picker} field The picker field
	 * @return {String} rawValue The string to be rendered
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope to execute the {@link #renderer} function. Defaults to this.
	 */
	
	createPicker: function() {
		var me = this,
			winCfg = {
				xtype: 'window',
				closeAction: 'hide',
				layout: 'fit',
				header: false,
				resizable: false,
				items: Ext.apply(me.pickerEditorConfig || {}, {
					xclass: me.pickerEditorClass
				}),
				minWidth: 200
			},
			pickerEd, picker;
		
		if (me.pickerWidth) winCfg.width = me.pickerWidth;
		picker = Ext.create(winCfg);
		
		pickerEd = picker.getComponent(0);
		pickerEd.on({
			scope: me,
			ok: me.onPickerOk,
			cancel: me.onPickerCancel
		});
		
		picker.on({
			close: 'onPickerCancel',
			scope: me
		});
		
		return picker;
	},
	
	onExpand: function() {
		var me = this,
			picker = me.picker,
			pickerEd;
		if (picker) {
			pickerEd = picker.getComponent(0);
			pickerEd.setValue(me.getValue());
			pickerEd.focusField();
		}
	},
	
	onCollapse: function() {
		var me = this;
		if (me.inputEl) me.inputEl.focus();
	},
	
	setValue: function(value) {
		var me = this;
		me.callParent(arguments);
	},
	
	rawToValue: function(rawValue) {
		var me = this;
		if (me.origRawValue !== undefined) {
			return me.origRawValue;
		}
		return me.callParent([rawValue]);
	},
	
	valueToRaw: function(value) {
		var me = this,
			renderer = me.renderer,
			raw = me.callParent([value]);
		if (renderer) {
			me.origRawValue = value;
			raw = Ext.callback(renderer, me.scope, [raw, me], 0, me);
		}
		return raw;
	},
	
	privates: {
		onPickerOk: function(s, value) {
			var me = this;
			me.setValue(value);
			me.collapse();
		},

		onPickerCancel: function(s) {
			this.collapse();
		}
	}
});
