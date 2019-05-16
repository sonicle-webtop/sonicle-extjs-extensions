/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.search.Editor', {
	extend: 'Ext.panel.Panel',
	xtype: 'sosearcheditor',
	requires: [
		'Ext.layout.container.HBox',
		'Ext.form.field.Date',
		'Ext.form.field.Checkbox',
		'Ext.form.field.Number',
		'Ext.form.field.Text',
		'Sonicle.form.field.search.EditorModel',
		'Sonicle.form.trigger.Clear'
	],
	
	border: false,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	config: {
		value: null
	},
	okText: 'Search',
	
	/**
	 * @cfg {Object[]} fields
	 * An Array of fields config object containing some properties:
	 * @param {String} name The name by which the field is referenced.
	 * @param {string|integer|number|boolean|date} type Controls the type of field derived class used to manage values.
	 * @param {String} [boolKeyword=has] Custom keyword to be associated to boolean field. Defaults to `has`, otherwise a suitable verb should be used (eg. `is`).
	 * @param {top|left} [labelAlign=top] Controls the position and alignment of the {@link Ext.form.field.Base#fieldLabel}.
	 * @param {String} [label] The label for the field.
	 * @param {Boolean} [textSink] `true` to use this field as destination field for alone text portions in query.
	 * @param {Object} [fieldCfg] A custom {@link Ext.form.field.Field} config to apply.
	 */
	
	referenceHolder: true,
	defaultBindProperty: 'value',
	twoWayBindable: [
		'value'
	],
	
	keyMap: {
		scope: 'this',
		enter: 'onOk'
	},
	
	constructor: function(cfg) {
		var me = this,
				childViewModel = Ext.Factory.viewModel('sosearcheditormodel', {fields: cfg.fields});
		me.childViewModel = childViewModel;
		Ext.apply(me, {
			items: me.createFields(childViewModel, cfg.fields),
			bbar: [{
				xtype: 'button',
				text: cfg.okText || me.okText,
				handler: me.onOk,
				scope: me
			}]
		});
		me.callParent(arguments);
	},
	
	destroy: function() {
		this.clearListeners();
		this.callParent();
	},
	
	onOk: function() {
		var me = this,
				ss = me.childViewModel.updateSearchString();
		me.setValue(ss.value);
		me.fireEvent('ok', me, ss.value, ss);
	},
	
	onCancel: function() {
		this.fireEvent('cancel', this);
	},
	
	focusField: function() {
		var me = this;
		if (Ext.isArray(me.fields) && me.fields.length > 0) {
			me.lookupReference(me.fields[0].name).focus();
		}
	},
	
	/**
	 * Sets the hidden state of one/many field/s.
	 * @param {String|Object} fieldName The field to set, or an object containing key/value pairs.
	 * @param {Boolean} hidden
	 */
	setFieldHidden: function(fieldName, hidden) {
		var me = this, values;
		if (Ext.isString(fieldName)) {
			values = [];
			values[fieldName] = hidden;
		} else {
			values = fieldName;
		}
		Ext.iterate(values, function(name, hidden) {
			if (me.fields[name]) {
				me.childViewModel.set('{hiddens.'+name, hidden);
			}
		});
	},
	
	setPreviousValue: function(value) {
		this.childViewModel.setSearchStringValue(value);
		this.setValue(value);
	},
	
	createFields: function(vm, fields) {
		var me = this, arr = [];
		Ext.iterate(fields, function(field) {
			var cfg = null;
			if (field.type === 'string') {
				cfg = me.createTextField(field);
			} else if (field.type === 'integer') {
				cfg = me.createNumberField(field, true);
			} else if (field.type === 'number') {
				cfg = me.createNumberField(field, false);
			} else if (field.type === 'date') {
				cfg = me.createDateField(field);
			} else if (field.type === 'boolean') {
				cfg = me.createCheckboxField(field);
			}
			if (cfg) {
				arr.push(Ext.apply(cfg, {
					viewModel: vm
				}));
			}
		});
		return arr;
	},
	
	createTextField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'textfield',
			reference: field.name,
			bind: {
				value: '{values.'+field.name+'}',
				hidden: '{hiddens.'+field.name+'}'
			},
			labelAlign: field.labelAlign || 'top',
			fieldLabel: field.label || field.name
		});
	},
	
	createNumberField: function(field, integer) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'numberfield',
			reference: field.name,
			bind: {
				value: '{values.'+field.name+'}',
				hidden: '{hiddens.'+field.name+'}'
			},
			labelAlign: field.labelAlign || 'top',
			fieldLabel: field.label || field.name,
			allowDecimals: !integer
		});
	},
	
	createDateField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'datefield',
			reference: field.name,
			bind: {
				value: '{values.'+field.name+'}',
				hidden: '{hiddens.'+field.name+'}'
			},
			labelAlign: field.labelAlign || 'top',
			fieldLabel: field.label || field.name,
			triggers: {
				clear: {
					type: 'soclear',
					weight: -1,
					hideWhenEmpty: true,
					hideWhenMouseOut: true
				}
			}
		});
	},
	
	createCheckboxField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'checkboxfield',
			reference: field.name,
			bind: {
				value: '{values.'+field.name+'}',
				hidden: '{hiddens.'+field.name+'}'
			},
			hideEmptyLabel: true,
			boxLabel: field.label || field.name
		});
	}
});
