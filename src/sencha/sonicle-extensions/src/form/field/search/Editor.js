/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
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
		'Sonicle.form.field.Tag',
		'Sonicle.form.field.search.EditorModel',
		'Sonicle.form.trigger.Clear'
	],
	
	border: false,
	/*
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	*/
	
	config: {
		value: null
	},
	trueValue: 'y',
	falseValue: 'n',
	trueText: 'Yes',
	falseText: 'No',
	okText: 'Search',
	
	/**
	 * @cfg {Object[]} fields
	 * An Array of fields config object containing some properties:
	 * @param {String} name The name by which the field is referenced.
	 * @param {String} mapping The keyword name to use (instead of above name) when producing the conditionArray in result.
	 * @param {string|integer|number|boolean|date|time|combo|tag} type Controls the type of field derived class used to manage values.
	 * @param {String} [boolKeyword] Keyword to be associated to boolean field, instead of field name (eg. `has` or `is` verbs).
	 * @param {top|left} [labelAlign=top] Controls the position and alignment of the {@link Ext.form.field.Base#fieldLabel}.
	 * @param {String} [label] The label for the field.
	 * @param {Boolean} [textSink] `true` to use this field as destination field for alone text portions in query.
	 * @param {Object} [fieldCfg] A custom {@link Ext.form.field.Field} config to apply.
	 */
	
	/**
	 * @cfg {Object[]} tabs
	 * An Array of tabs config object containing some properties:
	 * @param {String} title The title text for the tab.
	 * @param {String[]} fields An array of {@link #fields field names} declared above to include in this Tab.
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
				childViewModel = Ext.Factory.viewModel('sosearcheditormodel', {fields: cfg.fields, trueValue: cfg.trueValue, falseValue: cfg.falseValue}),
				layout, items;
		
		me.childViewModel = childViewModel;
		
		if (Ext.isArray(cfg.tabs) && !Ext.isEmpty(cfg.tabs)) {
			var tbitems = [], usedFields = [];
			Ext.iterate(cfg.tabs, function(tabCfg) {
				var cfgFields = Ext.Array.filter(cfg.fields, function(item) {
						console.log('Checking ' + item.name);
						return tabCfg.fields.indexOf(item.name) !== -1 && usedFields.indexOf(item.name) === -1;
					}, me);
				tbitems.push({
					xtype: 'panel',
					layout: {type: 'vbox', align: 'stretch'},
					scrollable: true,
					//scrollable: tbitems.length === 0 ? null : true,
					border: false,
					bodyPadding: '0 10 0 10',
					title: Sonicle.String.deflt(tabCfg.title, ''),
					items: me.createFieldsCfg(childViewModel, cfgFields)
				});
			});
			layout = 'fit';
			items = [{
				xtype: 'tabpanel',
				border: false,
				tabPosition: 'bottom',
				activeTab: 0,
				deferredRender: false,
				items: tbitems
			}];
		
			Ext.apply(me, {
				layout: 'fit',
				items: [
					{
						xtype: 'tabpanel',
						border: false,
						tabPosition: 'bottom',
						activeTab: 0,
						deferredRender: false,
						items: tbitems,
						tabBar:	{
							items: [
								{
									xtype: 'tbfill'
								}, {
									xtype: 'button',
									text: cfg.okText || me.okText,
									tooltip: cfg.okTooltip,
									handler: me.onOk,
									scope: me
								}
							]
						}
					}
				]
			});
			
		} else {
			Ext.apply(me, {
				layout: {type: 'vbox', align: 'stretch'},
				bodyPadding: '0 10 0 10',
				items: me.createFieldsCfg(childViewModel, cfg.fields),
				bbar: [
					{
						xtype: 'tbfill'
					}, {
						xtype: 'button',
						text: cfg.okText || me.okText,
						tooltip: cfg.okTooltip,
						handler: me.onOk,
						scope: me
					}
				]
			});
		}
		me.callParent([cfg]);
		
		// Find the defined height of first tab and then set it as 
		// the maximum height for the remaining tabs.
		if (Ext.isArray(cfg.tabs) && !Ext.isEmpty(cfg.tabs)) {
			me.on('boxready', function(s) {
				var tab = me.getComponent(0), h;
				if (tab && tab.isXType('tabpanel')) {
					tab.items.each(function(item, indx) {
						if (indx === 0) {
							h = item.getHeight();
						} else {
							item.setMinHeight(h);
							item.setMaxHeight(h);
						}
					});
				}
			}, me);
		}
	},
	
	destroy: function() {
		this.clearListeners();
		this.callParent();
	},
	
	onOk: function() {
		var me = this,
				qobj = me.childViewModel.updateQueryObject();
		me.setValue(qobj.value);
		me.fireEvent('ok', me, qobj.value, qobj);
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
	
	createFieldsCfg: function(vm, fields) {
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
			} else if (field.type === 'time') {
				cfg = me.createTimeField(field);
			} else if (field.type === 'boolean') {
				if (field.boolKeyword) {
					cfg = me.createCheckboxField(field);
				} else {
					cfg = me.createBooleanComboField(field);
				}
			} else if (field.type === 'combo') {
				cfg = me.createComboField(field);
			} else if (field.type === 'tag') {
				cfg = me.createTagField(field);
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
	
	createTimeField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'timefield',
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
	},
	
	createComboField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'combo',
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
	
	createBooleanComboField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'combo',
			reference: field.name,
			bind: {
				value: '{values.'+field.name+'}',
				hidden: '{hiddens.'+field.name+'}'
			},
			store: [
				[this.trueValue, this.trueText],
				[this.falseValue, this.falseText]
			],
			labelAlign: 'left',
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
	
	createTagField: function(field) {
		return Ext.apply(field.customConfig || {}, {
			xtype: 'sotagfield',
			reference: field.name,
			bind: {
				value: '{values.'+field.name+'_raw}', //FIXME: is this still useful after introducing remapQueryObject?
				labelValue: '{values.'+field.name+'}',
				hidden: '{hiddens.'+field.name+'}'
			},
			createNewOnEnter: false,
			createNewOnBlur: false,
			filterPickList: true,
			forceSelection: true,
			queryMode: 'local',
			labelAlign: field.labelAlign || 'top',
			fieldLabel: field.label || field.name
		});
	}
});
