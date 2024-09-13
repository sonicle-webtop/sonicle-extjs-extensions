/*
 * ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
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
		'Sonicle.form.field.LabelTag',
		'Sonicle.form.field.search.EditorModel',
		'Sonicle.form.trigger.Clear',
		'Sonicle.plugin.FieldTooltip'
	],
	
	border: false,
	
	config: {
		value: null
	},
	trueValue: 'y',
	falseValue: 'n',
	trueText: 'Yes',
	falseText: 'No',
	okText: 'Search',
	usageText: 'manual syntax: "{0}:{1}"',
	saveTooltip: 'Save as favorite search',
	saveIconCls: 'fas fa-save',
	labelWidth: 110,
	
	/**
	 * @cfg {Boolean} showSave
	 */
	showSave: false,
	
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
			storeDependsOnMap = {},
			bbarItems;
		
		if (cfg.trueValue) me.trueValue = cfg.trueValue;
		if (cfg.falseValue) me.falseValue = cfg.falseValue;
		if (cfg.trueText) me.trueText = cfg.trueText;
		if (cfg.falseText) me.falseText = cfg.falseText;
		if (cfg.okText) me.okText = cfg.okText;
		if (cfg.usageText) me.usageText = cfg.usageText;
		if (cfg.saveTooltip) me.saveTooltip = cfg.saveTooltip;
		if (cfg.saveIconCls) me.saveIconCls = cfg.saveIconCls;
		if (Ext.isBoolean(cfg.showSave)) me.showSave = cfg.showSave;
		
		me.childViewModel = childViewModel;
		
		bbarItems = ['->'];
		if (me.showSave) {
			Ext.Array.push(bbarItems, [
				{
					xtype: 'button',
					ui: '{tertiary}',
					iconCls: cfg.saveIconCls || me.saveIconCls,
					tooltip: cfg.saveTooltip || me.saveTooltip,
					handler: me.onSave,
					scope: me
				}
			]);
		}
		bbarItems.push({
			xtype: 'button',
			ui: '{primary}',
			text: cfg.okText || me.okText,
			tooltip: cfg.okTooltip,
			handler: me.onOk,
			scope: me
		});
		
		if (Ext.isArray(cfg.tabs) && !Ext.isEmpty(cfg.tabs)) {
			var tbitems = [], usedFields = [];
			Ext.iterate(cfg.tabs, function(tabCfg) {
				var cfgFields = Ext.Array.filter(cfg.fields, function(item) {
						return tabCfg.fields.indexOf(item.name) !== -1 && usedFields.indexOf(item.name) === -1;
					}, me),
					result = me.createFieldsCfg(childViewModel, tabCfg.labelWidth || me.labelWidth, cfgFields);
				
				Sonicle.Object.multiValueMapMerge(storeDependsOnMap, result.storeDependsOnMap);
				tbitems.push({
					xtype: 'panel',
					layout: 'anchor',
					scrollable: true,
					//scrollable: tbitems.length === 0 ? null : true,
					border: false,
					bodyPadding: '10 10 0 10',
					title: Sonicle.String.deflt(tabCfg.title, ''),
					items: result.items
				});
			});
		
			Ext.apply(me, {
				layout: 'fit',
				items: [
					{
						xtype: 'tabpanel',
						border: false,
						tabPosition: 'bottom',
						activeTab: 0,
						deferredRender: false,
						layout: 'anchor',
						items: tbitems
						//tabBar:	{
						//	items: bbar
						//}
					}
				],
				bbar: {
					ui: 'footer',
					items: bbarItems
				}
			});
			
		} else {
			var result = me.createFieldsCfg(childViewModel, me.labelWidth, cfg.fields);
			Sonicle.Object.multiValueMapMerge(storeDependsOnMap, result.storeDependsOnMap);
			Ext.apply(me, {
				layout: 'anchor',
				bodyPadding: '10 10 0 10',
				items: result.items,
				bbar: {
					ui: 'footer',
					items: bbarItems
				}
			});
		}
		me.callParent([cfg]);
		
		me.reloadersMap = {};
		Ext.iterate(storeDependsOnMap, function(parentName, childNames) {
			me.reloadersMap[parentName] = {
				childNames: childNames,
				fn: Ext.Function.createBuffered(me.reloadDependingFields, 100, me)
			};
			childViewModel.bind('{values.' + parentName + '}', function(nv, ov, b) {
				if (ov !== undefined) {
					// Handle reloaders (storeDependsOn)
					var reloader = me.reloadersMap[b.stub.name];
					if (reloader) {
						reloader.fn(b.stub.name, nv, reloader.childNames);
					}
				}
			});
		});
		
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
	
	onDestroy: function() {
		var me = this;
		delete me.reloadersMap;
		me.clearListeners();
		me.callParent();
	},
	
	onOk: function() {
		var me = this,
			qobj = me.childViewModel.updateQueryObject();
		me.setValue(qobj.value);
		me.fireEvent('ok', me, qobj.value, qobj);
	},
	
	onSave: function() {
		var me = this,
			qobj = me.childViewModel.updateQueryObject();
		me.setValue(qobj.value);
		me.fireEvent('save', me, qobj.value, qobj);
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
		var parsed = this.childViewModel.setSearchStringValue(value);
		this.setValue(value);
		return parsed;
	},
	
	privates: {
		createFieldsCfg: function(vm, labelWidth, fields) {
			var me = this,
				storeDependsOnMap = {},
				farr = [],
				hgroups = {},
				pendingGroup;
			
			// Preprocess fields consolidating groups
			Ext.iterate(fields, function(field) {
				if (!Ext.isEmpty(field.hgroup)) {
					if (!hgroups[field.hgroup]) hgroups[field.hgroup] = [];
					hgroups[field.hgroup].push(field.name);
				}
			});
			
			Ext.iterate(fields, function(field) {
				var cfg = null,
					hgroupMembers = field.hgroup ? hgroups[field.hgroup] : null;
				
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
					// If there is a pending group and its name does NOT match 
					// with processing field's group, we need to consolidate the 
					// pending container adding it to the items list.
					// Fields of same group MUST be together in the array, not scattered!
					if (pendingGroup && pendingGroup.name !== field.hgroup) {
						farr.push(pendingGroup.container);
						pendingGroup = null;
					}
					
					// If processing field needs to be grouped, make sure there 
					// is a pending group, otherwise prepare it!
					if (field.hgroup) {
						if (!pendingGroup) {
							pendingGroup = {
								name: field.hgroup,
								container: {
									xtype: 'fieldcontainer',
									layout: 'hbox',
									items: [],
									labelWidth: labelWidth,
									anchor: '100%'
								}
							};
						}
						cfg.flex = 1;
					}
					
					if (!cfg.anchor && !cfg.width) cfg.anchor = '100%';
					// Handle storeDependsOn config, setting-up Store's onBeforeLoad in order to call passed handler
					if (Ext.isObject(field.storeDependsOn) && Ext.isString(field.storeDependsOn.parentField)) {
						if (cfg.store) {
							cfg.store.listeners = {
								beforeload: function(s) {
									Ext.callback(field.storeDependsOn.onBeforeLoadHandlerFn, s, [s, vm.get('values.'+field.storeDependsOn.parentField)]);
								}
							};
							// Map the dependency in order to do post-process, see below... (note that many fields can depend to same parent)
							Sonicle.Object.multiValueMapPut(storeDependsOnMap, field.storeDependsOn.parentField, field.name);
						}
					}
					Ext.apply(cfg, {
						viewModel: vm,
						labelWidth: labelWidth,
						tooltip: Ext.isEmpty(cfg.tooltip) ? me.generateUsage(field) : me.generateUsage(field) + '\n' + cfg.tooltip,
						plugins: [{ptype: 'sofieldtooltip', tooltipTarget: 'label'}]
					});
					
					// If there is a pending group adds current field to its 
					// container, otherwise push it directly to items list.
					if (pendingGroup) {
						if (hgroupMembers.indexOf(field.name) !== (hgroupMembers.length-1)) {
							// Add margin to fields, except for the last one!
							Ext.apply(cfg, {margin: '0 10 0 0'});
						}
						pendingGroup.container.items.push(cfg);
					} else {
						farr.push(cfg);
					}
				}
			});
			
			// Process also remaining pending group
			if (pendingGroup) {
				farr.push(pendingGroup.container);
				pendingGroup = null;
			}

			return {
				items: farr,
				storeDependsOnMap: storeDependsOnMap
			};
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
				fieldLabel: field.label || field.name,
				emptyText: field.emptyText
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
				emptyText: field.emptyText,
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
				emptyText: field.emptyText,
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
				emptyText: field.emptyText,
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
				labelAlign: field.labelAlign || 'top',
				fieldLabel: field.label || field.name,
				emptyText: field.emptyText,
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
				emptyText: field.emptyText,
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
				xtype: 'solabeltagfield',
				reference: field.name,
				bind: {
					valueAsDisplay: '{values.'+field.name+'}',
					hidden: '{hiddens.'+field.name+'}'
				},
				enableValueAsDisplay: true,
				createNewOnEnter: false,
				createNewOnBlur: false,
				filterPickList: true,
				forceSelection: true,
				queryMode: 'local',
				labelAlign: field.labelAlign || 'top',
				emptyText: field.emptyText,
				fieldLabel: field.label || field.name
			});
		},
		
		reloadDependingFields: function(parentName, parentValue, childNames) {
			var me = this;
			Ext.iterate(childNames, function(name) {
				var cmp = me.lookupReference(name);
				if (cmp && cmp.getStore) {
					if (Ext.isEmpty(parentValue)) {
						cmp.getStore().clearData();
					} else {
						cmp.getStore().load();
					}
				}
			});
		},

		generateUsage: function(field) {
			var kw = field.name, value = '&lt;text&gt;';
			if (field.type === 'boolean' && field.boolKeyword) {
				kw = field.boolKeyword;
				value = field.name;
			} else if (field.type === 'boolean') {
				value = '&lt;y|n&gt;';
			} else if (field.type === 'date') {
				value = '&lt;YYYY-MM-DD&gt;';
			} else if (field.type === 'time') {
				value = '&lt;HH:MM&gt;';
			} else if (field.type === 'combo') {
				value = '&lt;ID&gt;';
			}  else if (field.type === 'tag') {
				value = '&lt;tag1&gt;,...,&lt;tagN&gt;';
			}
			return Ext.String.format(this.usageText, kw, value);
		}
	}
});
