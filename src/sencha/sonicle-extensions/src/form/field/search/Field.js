/*
 * ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.search.Field', {
	extend: 'Sonicle.form.field.ComboBox',
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
	mixins: [
		'Sonicle.mixin.DDPickerHolder'
	],
	
	selectOnFocus: true,
	//selectOnTab: true,
	ddPickerMatchOwnerWidth: true,
	ddPickerAlign: 'tr-br?',
	
	typeAhead: false,
	minChars: 2,
	autoSelect: false,
	autoSelectLast: false,
	autoSelectMatches: false,
	queryMode: 'remote',
	queryDelay: 800,
	triggerAction: 'all',
	forceSelection: false,
	editable: true,
	
	trueValue: 'y',
	falseValue: 'n',
	trueText: 'Yes',
	falseText: 'No',
	searchText: 'Search',
	searchTooltip: undefined,
	clearText: 'Clear',
	usageText: 'Manual syntax: "{0}:{1}"',
	saveTooltip: 'Save as favorite',
	
	/**
	 * @cfg {Boolean} [saveButton]
	 * Set to `true` to enable save button.
	 */
	saveButton: false,
	
	/**
	 * @cfg {Number} [listOpeningDelayOnClick]
	 * Time to delay before auto-opening picker after the input has been clicked.
	 */
	listOpeningDelayOnClick: 1000,
	
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
	
	/**
	 * @private
	 */
	suspendInputFocusing: 0,
	
	constructor: function(cfg) {
		var me = this,
			SoEU = Sonicle.ExtUtils,
			searchText = cfg.searchText || me.searchText,
			clearText = cfg.clearText || me.clearText;
		
		cfg.autoSelectLast = false;
		cfg.plugins = SoEU.mergePlugins(cfg, 'sofieldtooltip');
		cfg.triggers = SoEU.mergeTriggers(cfg, {
			search: {
				cls: Ext.baseCSSPrefix + 'form-search-trigger',
				position: 'left', // this is possible thanks to custom override!!!
				tooltip: searchText,
				handler: function(s) {
					me.fireQuery(s.getValue());
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
	},
	
	destroy: function() {
		var me = this;
		
		me.disarmListDelayedOpening();
		Ext.iterate(me.storeCache, function(key, val) {
			val.destroy();
		});
		me.storeCache = null;
		
		me.un('clear', me.onClear, me);
		me.callParent();
	},
	
	/*
	collapse: function() {
		// Block picker collapsing, only for development!
		console.log('collapse blocked');
	},
	
	collapseDDPicker: function() {
		// Block picker collapsing, only for development!
		console.log('collapse blocked');
	},
	*/
	
	initEvents: function() {
		var me = this;
		me.callParent();
		me.altArrowKeyNav.map.addBinding({
			key: Ext.event.Event.ENTER,
			handler: me.onInputKeyEnter,
			scope: me
		});
		/*
		me.altArrowKeyNav.map.addBinding({
			key: Ext.event.Event.DELETE,
			shift: true,
			handler: me.onInputKeyDel,
			scope: me
		});
		*/
	},
	
	/**
	 * Overrides original getValue: seems that default Combo impl., if field 
	 * still have an empty-store bounded, does not return the typed value 
	 * (that in input el) when getting value. We circumvent this behaviour 
	 * returning the rawValue under special conditions.
	 */
	getValue: function() {
		var me = this,
			store = me.getStore(),
			rawValue = me.getRawValue(),
			value = me.value;
		
		if (me.editable && !me.forceSelection && (!store || store.isEmptyStore)) {
			// Return rawValue if value is undefined/null (note ==), not falsy.
			return value == null ? rawValue : value;
		} else {
			return me.callParent();
		}
	},
	
	getOwnerBodyEl: function() {
		return this.bodyEl;
	},
	
	getOwnerAlignEl: function() {
		return this.triggerWrap;
	},
	
	/**
	 * Overrides original updateEditable in order to support click also for editable pickers.
	 */
	updateEditable: function(editable, oldEditable) {
		var me = this;
		me.callParent([editable, oldEditable]);
		// Swap behaviour in callParent
		if (!editable) {
			me.inputEl.un('click', me.onInputElClick, me);
		} else {
			me.inputEl.on('click', me.onInputElClick, me);
		}
	},
	
	/**
	 * Replaces original combo picker with search picker.
	 */
	onTriggerClick: function(field, trigger, e) {
		var me = this;
		if (!me.readOnly && !me.disabled) {
			me.disarmListDelayedOpening();
			if (me.isDDPickerExpanded('search')) {
				me.collapseDDPicker();
			} else {
				if (e && e.type === 'keydown' && e.altKey) {
					// Expand original combo picker
					me.collapseDDPicker();
					me.doQuery(me.allQuery, true);
				} else {
					me.expandDDPicker('search');
				}
			}
		}
	},
	
	/**
	 * Replaces original forwarding to above onTriggerClick to support delayed list opening
	 */
	onInputElClick: function(e) {
		var me = this,
			delay = me.listOpeningDelayOnClick;
		
		// Do NOT call original onTriggerClick
		//me.onTriggerClick(me, me.getPickerTrigger(), e);
		me.disarmListDelayedOpening();
		if (delay > -1) {
			me.listDelayedOpening = Ext.defer(function(e) {
				this.collapseDDPicker();
				this.doQuery(this.allQuery, true);
			}, delay, me, [e]);
		}
	},
	
	createPicker: function() {
		var me = this,
			picker = me.callParent(arguments);
		
		picker.getSelectionModel().on({
			scope: me,
			select: me.onPickerSelModelSelect
		});
		return picker;
	},
	
	createDDPicker: function(id) {
		var me = this,
			winCfg = {
				xtype: 'window',
				closeAction: 'hide',
				referenceHolder: true,
				layout: 'fit',
				header: false,
				resizable: false,
				items: {
					xtype: 'sosearcheditor',
					reference: 'search',
					fields: me.fields,
					tabs: me.tabs,
					trueValue: me.trueValue,
					falseValue: me.falseValue,
					trueText: me.trueText,
					falseText: me.falseText,
					okText: me.searchText,
					okTooltip: me.searchTooltip,
					usageText: me.usageText,
					showSave: me.saveButton,
					saveTooltip: me.saveTooltip,
					labelWidth: me.fieldsLabelWidth
				},
				minWidth: 200
			},
			picker,
			searchEd;
		
		if (me.ddPickerWidth) winCfg.width = me.ddPickerWidth;
		picker = Ext.create(winCfg);
		searchEd = me.lookupSearchEd(picker);
		
		searchEd.on({
			scope: me,
			ok: me.onSearchPickerOk,
			save: me.onSearchPickerSave,
			cancel: me.onSearchPickerCancel
		});
		picker.on({
			close: 'onSearchPickerCancel',
			scope: me
		});
		
		return picker;
	},
	
	lookupSearchEd: function(searchPicker) {
		return searchPicker ? searchPicker.lookupReference('search') : undefined;
	},
	
	/**
	 * Gets the SearchString object for the current search String.
	 * @return {SearchString}
	 */
	getSearchString: function() {
		var value = this.getValue();
		return Ext.isString(value) ? Sonicle.SearchString.parseHumanQuery(value) : undefined;
	},
	
	/**
	 * Sets the passed SearchString object as search String.
	 * @param {SearchString} searchString
	 * @param {Boolean} issueQuery Set to `true` to issue query.
	 */
	setSearchString: function(searchString, issueQuery) {
		if (Ext.isObject(searchString)) {
			var value = Sonicle.SearchString.toHumanQuery(searchString.toString());
			this.setValue(value);
			if (issueQuery === true) this.fireQuery(value);
		}
	},
	
	/**
	 * Sets the hidden state of one/many query editor's field/s.
	 * @param {String|Object} fieldName The field to set, or an object containing key/value pairs.
	 * @param {Boolean} hidden
	 */
	setFieldHidden: function(fieldName, hidden) {
		var me = this,
			searchEd = me.lookupSearchEd(me.getDDPicker('search')),
			values;
		
		if (searchEd) {
			searchEd.setFieldHidden(arguments);
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
		this.collapseDDPicker();
		this.callParent(arguments);
	},
	
	onExpandDDPicker: function() {
		var me = this,
			searchEd = me.lookupSearchEd(me.getDDPicker('search')),
			value = me.getValue(),
			parsed;
		
		me.collapse();
		if (searchEd) {
			parsed = searchEd.setPreviousValue(Sonicle.SearchString.toRawQuery(value));
			if (parsed) {
				if (Ext.isEmpty(parsed.conditionArray) && !Ext.isEmpty(parsed.textSegments)) {
					me.setValue(null);
				}
			}
			searchEd.focusField();
		}
	},
	
	onCollapseDDPicker: function() {
		var me = this;
		if (!me.suspendInputFocusing) {
			me.inputEl.focus();
		}
	},
	
	onMouseDown: function() {
		this.callParent(arguments);
		this.collapseDDPicker();
	},
	
	onFocusChange: function(selModel, prevRecord, newRecord) {
		var me = this,
			picker = me.picker,
			el;
		
		if (prevRecord) {
			el = picker.getNodeByRecord(prevRecord);
			if (el) Ext.fly(el).removeCls(picker.selectedItemCls);
		}
		
		me.callParent(arguments);
		
		if (newRecord) {
			el = picker.getNodeByRecord(newRecord);
			if (el) Ext.fly(el).addCls(picker.selectedItemCls);
		}
	},
	
	privates: {
		disarmListDelayedOpening: function() {
			var me = this;
			if (me.listDelayedOpening) {
				me.listDelayedOpening = Ext.undefer(me.listDelayedOpening);
			}
		},
		
		/*
		 * fired by BoundListKeyNav
		onSpecialKey: function(s, e, eo) {
			var me = this;
			if (eo && eo.fromBoundList) return;
			if (e.getKey() === e.ENTER) {
				if (s.fireEvent('enterkeypress', s, e) !== false) {
					me.fireQuery(s.getValue());
				}
			}
		},
		*/
		
		onInputKeyEnter: function(keyCode, e) {
			var me = this,
					value = me.getValue();
			
			if (!me.isExpanded) {
				e.stopEvent();
				if (me.fireEvent('enterkeypress', me, e) !== false) {
					me.fireQuery(value);
				}
				return false;
			} else {
				return true;
			}
		},
		
		/*
		onInputKeyDel: function(keyCode, e) {
			var me = this,
				rec;
			
			if (me.isExpanded) {
				e.stopEvent();
				rec = me.getPicker().getNavigationModel().getRecord();
				if (rec) {
					//TODO
				}
				return false;
			} else {
				return true;
			}
		},
		*/
		
		onPickerSelModelSelect: function(s, rec, indx) {
			var me = this,
				value = me.getValue();
			if (value) me.fireQuery(value);
		},
		
		onSearchPickerOk: function(s, rawValue, queryObject) {
			var me = this,
				value = Sonicle.SearchString.toHumanQuery(rawValue);
			me.setValue(value);
			me.fireQuery(value, queryObject);
		},
		
		onSearchPickerSave: function(s, rawValue, queryObject) {
			var me = this,
				value = Sonicle.SearchString.toHumanQuery(rawValue);
			me.fireSave(value, queryObject);
		},

		onSearchPickerCancel: function(s) {
			this.collapseDDPicker();
		},

		onClear: function(s) {
			this.fireQuery(null);
		},
		
		fireQuery: function(value, queryObject) {
			var me = this,
				SoSS = Sonicle.SearchString;
			if (arguments.length === 1) {
				queryObject = SoSS.toQueryObject(SoSS.parseHumanQuery(value));
			}
			me.collapse();
			me.collapseDDPicker();
			me.fireEvent('query', me, value, me.remapQueryObject(queryObject));
		},
		
		fireSave: function(value, queryObject) {
			var me = this,
				SoSS = Sonicle.SearchString,
				queryObject = SoSS.toQueryObject(SoSS.parseHumanQuery(value));
			
			me.fireEvent('save', me, value, me.remapQueryObject(queryObject));
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

					} else if (field.type === 'tag' && field.valueRemap !== false) {
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
	}
});
