/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.search.Field', {
	extend: 'Ext.form.field.Picker',
	xtype: 'sosearchfield',
	requires: [
		'Ext.layout.container.Fit',
		'Sonicle.ExtUtils',
		'Sonicle.form.field.search.Editor',
		'Sonicle.form.trigger.Clear',
		'Sonicle.plugin.FieldTooltip'
	],
	uses: [
		'Sonicle.SearchString'
	],
	
	selectOnFocus: true,
	matchFieldWidth: true,
	pickerAlign: 'tr-br?',
	
	trueValue: 'y',
	falseValue: 'n',
	trueText: 'Yes',
	falseText: 'No',
	searchText: 'Search',
	searchTooltip: undefined,
	clearText: 'Clear',
	usageText: 'Manual syntax: "{0}:{1}"',
	
	/**
	 * @cfg {Number} fieldsLabelWidth
	 * The default width of the fieldLabel in pixels.
	 */
	fieldsLabelWidth: 110,
	
	/**
	 * @cfg {Object[]} fields
	 * An Array of fields config object containing some properties:
	 * @param {String} name The name by which the field is referenced (used as keyword).
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
	 * @param {Number} [labelWidth] The width of the fieldLabel (in pixels) for this tab.
	 * @param {String[]} fields An array of {@link #fields field names} declared above to include in this Tab.
	 */
	
	/**
     * @event enterkeypress
	 * Fires when the user presses the ENTER key.
	 * Return false to stop subsequent query operations.
	 * @param {Ext.form.field.Text} this
	 * @param {Object} event The event object
     */
	
	/**
     * @event query
	 * Fires when the user presses the ENTER key or clicks on the search icon.
	 * @param {Ext.form.field.Text} this
	 * @param {String} value Human-readable query text
	 * @param {Object} queryObject Query exploded into components
     */
	
	/**
	 * @private
	 */
	storeCache: null,
	
	constructor: function(cfg) {
		var me = this,
				SoEU = Sonicle.ExtUtils,
				searchText = cfg.searchText || me.searchText,
				clearText = cfg.clearText || me.clearText;
		
		cfg.plugins = SoEU.mergePlugins(cfg, 'sofieldtooltip');
		cfg.triggers = SoEU.mergeTriggers(cfg, {
			search: {
				cls: Ext.baseCSSPrefix + 'form-search-trigger',
				position: 'left', // this is possible thanks to custom override!!!
				tooltip: searchText,
				handler: function(s) {
					me.doQuery(s.getValue());
				}
			},
			clear: {
				type: 'soclear',
				weight: -1,
				tooltip: clearText,
				hideWhenEmpty: true,
				hideWhenMouseOut: true
			}
		});
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		me.storeCache = {};
		me.callParent(arguments);
		
		Ext.iterate(me.fields, function(field) {
			var cc = field.customConfig, sto;
			if (cc) {
				if (field.type === 'tag') {
					if (cc.store.source && cc.store.source.isStore) {
						// passed store is chained, so build the new chained store over the original source
						me.storeCache[field.name] = Ext.create('Ext.data.ChainedStore', {source: cc.store.source});
					} else {
						sto = Ext.data.StoreManager.lookup(cc.store);
						if (sto) {
							me.storeCache[field.name] = Ext.create('Ext.data.ChainedStore', {source: sto});
						}
					}	
				}
			}
		});
		
		me.on('clear', me.onClear, me);
		me.on('specialkey', me.onSpecialKey, me);
	},
	
	destroy: function() {
		var me = this;
		
		Ext.iterate(me.storeCache, function(key, val) {
			val.destroy();
		});
		me.storeCache = null;
		
		me.un('clear', me.onClear);
		me.un('specialkey', me.onSpecialKey);
		me.callParent();
	},
	
	createPicker: function() {
		var me = this, picker,
				winCfg = {
					xtype: 'window',
					closeAction: 'hide',
					referenceHolder: true,
					layout: 'fit',
					header: false,
					resizable: false,
					items: {
						xtype: 'sosearcheditor',
						reference: 'editor',
						fields: me.fields,
						tabs: me.tabs,
						trueValue: me.trueValue,
						falseValue: me.falseValue,
						trueText: me.trueText,
						falseText: me.falseText,
						okText: me.searchText,
						okTooltip: me.searchTooltip,
						usageText: me.usageText,
						labelWidth: me.fieldsLabelWidth
					},
					minWidth: 200
				};
		
		if (me.pickerWidth) winCfg.width = me.pickerWidth;
		me.pickerWindow = Ext.create(winCfg);
		
		me.queryPicker = picker = me.pickerWindow.lookupReference('editor');
		picker.on({
			scope: me,
			ok: me.onPickerOk,
			cancel: me.onPickerCancel
		});
		
		me.pickerWindow.on({
			close: 'onPickerCancel',
			scope: me
		});
		
		return me.pickerWindow;
	},
	
	/**
	 * Sets the hidden state of one/many query editor's field/s.
	 * @param {String|Object} fieldName The field to set, or an object containing key/value pairs.
	 * @param {Boolean} hidden
	 */
	setFieldHidden: function(fieldName, hidden) {
		var me = this, values;
		if (me.queryPicker) {
			me.queryPicker.setFieldHidden(arguments);
		}
		
		// Updates inner config
		if (me.fields) {
			if (Ext.isString(fieldName)) {
				values = [];
				values[fieldName] = hidden;
			} else {
				values = fieldName;
			}
			Ext.iterate(values, function(name, hidden) {
				if (me.fields[name] !== undefined) {
					me.fields[name] = hidden;
				}
			});
		}
	},
	
	onExpand: function() {
		var me = this;
		me.queryPicker.setPreviousValue(Sonicle.SearchString.toRawQuery(me.value));
		me.queryPicker.focusField();
	},
	
	onCollapse: function() {
		var me = this;
		me.inputEl.focus();
	},
	
	onMouseDown: function() {
		this.callParent(arguments);
		this.collapse();
	},
	
	onPickerOk: function(s, rawValue, queryObject) {
		var me = this,
				value = Sonicle.SearchString.toHumanQuery(rawValue);
		me.setValue(value);
		me.doQuery(value, queryObject);
	},
	
	onPickerCancel: function(s) {
		this.collapse();
	},
	
	onClear: function(s) {
		this.doQuery(null);
	},

	onSpecialKey: function(s, e) {
		if (e.getKey() === e.ENTER) {
			if (s.fireEvent('enterkeypress', s, e) !== false) {
				s.doQuery(s.getValue());
			}
		}
	},

	doQuery: function(value, queryObject) {
		var me = this,
				SoSS = Sonicle.SearchString;
		if (arguments.length === 1) {
			queryObject = SoSS.toQueryObject(SoSS.parseHumanQuery(value));
		}
		me.collapse();
		me.fireEvent('query', me, value, me.remapQueryObject(queryObject));
	},
	
	remapQueryObject: function(qobj) {
		var me = this,
				conds = Ext.Array.clone(qobj.conditionArray),
				field, fcc, iof;
		Ext.iterate(conds, function(cond, i) {
			field = Ext.Array.findBy(me.fields, function(item) { return cond.keyword === item.name; });
			if (field) {
				fcc = field.customConfig;
				if (!Ext.isEmpty(field.mapping)) {
					cond.keyword = field.mapping;
				}
				if (field.type === 'boolean') {
					if (!field.boolKeyword) cond.value = me.trueValue === cond.value ? true : false;
					
				} else if (field.type === 'tag') {
					var sto = me.storeCache[field.name], recs, newConds = [];
					if (sto && fcc) {
						recs = Sonicle.Data.findRecords(sto, fcc.displayField || fcc.valueField, cond.value, false, true, true);
						if (recs.length > 0) {
							iof = qobj.conditionArray.indexOf(cond);
							Ext.iterate(recs, function(rec) {
								newConds.push(Ext.apply(Ext.clone(cond), {
									value: rec.get(fcc.valueField)
								}));
							});
							Ext.Array.replace(qobj.conditionArray, iof, 1, newConds);
						}
					}
				}
			}
		});
		return qobj;
	}
});
