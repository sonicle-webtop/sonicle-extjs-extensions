/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.Tag', {
	extend: 'Ext.form.field.Tag',
	alias: 'widget.sotagfield',
	uses: [
		'Sonicle.ColorUtils',
		'Sonicle.ClipboardMgr',
		'Sonicle.Data'
	],
	mixins: [
		'Sonicle.mixin.ThemeBranded'
	],
	
	queryMode: 'local',
	
	componentCls: 'so-tagfield',
	editableTagItemCls: 'so-tagfield-item-editable',
	clickableTagItemCls: 'so-tagfield-item-clickable',
	tagItemTextWithIconCls: 'so-tagfield-item-text-with-icon',
	tagItemTextIconCls: 'so-tagfield-item-text-icon',
	tagItemTextAfterIconCls: 'so-tagfield-item-text-after-icon',
	tagItemEditCls: 'so-tagfield-item-edit',
	inputFieldCls: Ext.baseCSSPrefix + 'tagfield-input-field',
	editorFieldCls: 'so-tagfield-editor-field',
	
	dummyWarningIconCls: 'fas fa-exclamation-triangle',
	dummyLoadingIconCls: 'fas fa-spinner fa-spin',
	
	/**
	 * @cfg {Boolean} [forceInputCleaning]
	 * Set to `true` to force input cleaning (without any matching) on changing values.
	 */
	forceInputCleaning: false,
	
	/**
	 * @cfg {Boolean} [enableValueAsDisplay]
	 * Enables valueAsDisplay processing. Defaults to `false`.
	 */
	enableValueAsDisplay: false,
	
	/**
	 * @cfg {Boolean} [itemEditable]
	 * Has no effect if {@link #editable} is `false` or {@link #readOnly} is `true`.
	 * Enables inline item's display value editing.
	 */
	itemEditable: false,
	
	/**
	 * @cfg {Function/String} handler
	 * A function called when the item is clicked.
	 * @param {Sonicle.form.field.Tag} tag This tag.
	 * @param {Ext.data.Model} record The item's record.
	 * @param {Ext.event.Event} e The click event.
	 */
	itemClickHandler: undefined,
	
	/**
	 * @cfg {Object} scope
	 * The scope (**this** reference) in which the `{@link #itemClickHandler}` is executed. Defaults to this component.
	 */
	
	/**
	 * @cfg {Boolean} [showItemIcon]
	 * Shows an icon next to item's text. Icon class will be retrieved using specified {@link iconField}.
	 */
	showItemIcon: false,
	
	/**
	 * @cfg {Number/Boolean} [growMaxLines]
	 * Has no effect if {@link #grow} is `false`.
	 * The maximum number of lines to allow for natural vertical growth 
	 * based on the current selected values.
	 */
	growMaxLines: false,
	
	/**
	 * @cfg {String} [iconField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as CSS icon class.
	 */
	
	/**
	 * @cfg {Function} [getIcon]
	 * A function which returns the value of icon.
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #iconField}.
	 */
	
	/**
	 * @cfg {String} [colorField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as 
	 * color swatch instead of using an icon.
	 */
	
	/**
	 * @cfg {String} [sourceField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as source.
	 */
	
	/**
	 * @cfg {Function} [getSource]
	 * A function which returns the value of source.
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #sourceField}.
	 */
	
	/**
	 * @cfg {Function} [isItemHidden]
	 * A function which returns the value of icon.
	 * @param {Object} values An Object with item related data.
	 */
	
	/**
	 * @cfg {Number} colorLuminance [colorLuminance=0.64]
	 * Number (0..1) expressing color lumimance threshold value, used to 
	 * determine if a color needs a 'light' or 'dark' foreground color text.
	 */
	colorLuminance: 0.64,
	
	/**
	 * @cfg {String} [defaultColor=#FFFFFF]
	 * Color to use as default if color is missing.
	 */
	defaultColor: '#FFFFFF',
	
	/**
	 * @cfg {String} [lightTagsBorderColor=#A8A8A8]
	 * Color for highlight light-tags boundaries.
	 */
	lightTagsBorderColor: '#A8A8A8',
	
	/**
	 * @cfg {Boolean} useDummyItem
	 * Has no effect if {@link #forceSelection} is `true`.
	 * With this set to `true`, values not represented in the Store 
	 * (precisely when valueField value is equal to displayField value) will be 
	 * displayed as dummy elements (with a loading indicator).
	 */
	useDummyItem: false,
	
	/**
	 * @cfg {warning|loading} dummyIcon
	 * Customize the icon of the dummy element.
	 */
	dummyIcon: 'warning',
	
	clipboardDelimiter: ',',
	
	/**
	 * @event beforeitemedit
	 * Fires when the record associated with tag item is being removed. Return false to cancel the action.
	 * @param {Sonicle.field.Tag} tag This component.
	 * @param {Ext.data.Model} record The record being removed.
	 * @param {Mixed} newValue The new {@link #displayField} value.
	 * @param {Mixed} oldValue The old {@link #displayField} value.
	 */
	
	/**
	 * @event itemedit
	 * Fires when the record associated with tag item is removed.
	 * @param {Sonicle.field.Tag} tag This component.
	 * @param {Ext.data.Model} record The record removed.
	 * @param {Mixed} newValue The new {@link #displayField} value.
	 * @param {Mixed} oldValue The old {@link #displayField} value.
	 */
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.form.field.Tag#fieldSubTpl}:
	 *  - customize inputElCt style when read-only
	 */
	fieldSubTpl: [
		// listWrapper div is tabbable in Firefox, for some unfathomable reason
		'<div id="{cmpId}-listWrapper" data-ref="listWrapper"' + (Ext.isGecko ? ' tabindex="-1"' : ''),
			'<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
			' class="' + Ext.baseCSSPrefix + 'tagfield {fieldCls} {typeCls} {typeCls}-{ui}"<tpl if="wrapperStyle"> style="{wrapperStyle}"</tpl>>',
			'<span id="{cmpId}-selectedText" data-ref="selectedText" aria-hidden="true" class="' + Ext.baseCSSPrefix + 'hidden-clip"></span>',
			'<ul id="{cmpId}-itemList" data-ref="itemList" role="presentation" class="' + Ext.baseCSSPrefix + 'tagfield-list{itemListCls}">',
				'<li id="{cmpId}-inputElCt" data-ref="inputElCt" role="presentation" class="' + Ext.baseCSSPrefix + 'tagfield-input" <tpl if="readOnly"> style="display:none"</tpl>>', // <-- Modified adding if test to set display none
					'<input id="{cmpId}-inputEl" data-ref="inputEl" type="{type}" ',
					'<tpl if="name">name="{name}" </tpl>',
					'<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
					'<tpl if="size">size="{size}" </tpl>',
					'<tpl if="tabIdx != null">tabindex="{tabIdx}" </tpl>',
					'<tpl if="disabled"> disabled="disabled"</tpl>',
					'<tpl foreach="inputElAriaAttributes"> {$}="{.}"</tpl>',
					'class="' + Ext.baseCSSPrefix + 'tagfield-input-field {inputElCls} {noGrowCls} {emptyCls} {fixCls}" autocomplete="off">',
				'</li>',
			'</ul>',
			'<ul id="{cmpId}-ariaList" data-ref="ariaList" role="listbox"',
				'<tpl if="ariaSelectedListLabel"> aria-label="{ariaSelectedListLabel}"</tpl>',
				'<tpl if="multiSelect"> aria-multiselectable="true"</tpl>',
				' class="' + Ext.baseCSSPrefix + 'tagfield-arialist">',
			'</ul>',
		'</div>',
        {
            disableFormats: true
        }
    ],
	
	initComponent: function() {
		var me = this,
			SoTag = Sonicle.form.field.Tag;
		
		me.callParent(arguments);
		me.listConfig = me.initListConfig();
		
		if (me.grow && Ext.isNumber(me.growMaxLines) && me.growMaxLines > 0) {
			me.on('afterrender', function() {
				var growMaxLines = me.growMaxLines;
				if (me.grow && Ext.isNumber(growMaxLines) && growMaxLines > 0) {
					var measures = SoTag.measure(),
						itemHeight = measures.liItemHeight + measures.liItemTBMargin,
						maxHeight = (me.bodyEl.getHeight() % itemHeight) + (itemHeight * growMaxLines);
					me.listWrapper.setStyle('max-height', maxHeight+'px');
				}
			}, me, {single: true});
		}
		
		if (me.editable && !me.readOnly) {
			me.itemEditor = Ext.create({
				xtype: 'editor',
				updateEl: false,
				hideEl: false,
				alignment: 'tl-tl',
				autoSize: {
					width: 'boundEl',
					height: 'boundEl'
				},
				field: {
					xtype: 'textfield',
					enterIsSpecial: true,
					fieldCls: me.editorFieldCls + ' ' + me.inputFieldCls
				},
				listeners: {
					complete: function(s, value, startValue) {
						if (value !== startValue) {
							me.onItemEditingComplete(s.valueInternalId, value, startValue);
						}
					}
				}
			});
		}
	},
	
	onDestroy: function() {
		var me = this;
		if (me.itemEditor) {
			me.itemEditor = me.itemEditor.destroy();
		}
		me.callParent();
	},
	
	initListConfig: function() {
		var me = this;
		return Ext.apply({}, me.listConfig || {}, {
			iconField: me.iconField,
			getIcon: me.getIcon,
			colorField: me.colorField,
			sourceField: me.sourceField
		});
	},
	
	/**
	 * Override original {@link Ext.form.field.Tag#createPicker}:
	 *  - customize defaults for boundlist config
	 * (see {@link #initListConfig} for other configs)
	 */
	createPicker: function() {
		var me = this,
			config;
		
		config = Ext.apply(me.defaultListConfig, {
			xtype: 'soboundlist',
			colorize: 'text',
			swatchGeometry: 'rounded'
		});
		
		me.defaultListConfig = config;
		return me.callParent();
	},
	
	/*
	/**
	 * Override original method in order to fix delimiter used
	 *
	getRawValue: function() {
		var me = this,
				delim = me.delimiter,
				s = me.callParent();
		return delim !== ',' ? s.replace(/,/g, delim) : s;
	},
	*/
	
	/**
	 * Override original {@link Ext.form.field.Tag#getMultiSelectItemMarkup}
	 *  - handle read-only status
	 *  - add coloring support
	 *  - add edit button
	 */
	getMultiSelectItemMarkup: function () {
		var me = this,
			childElCls = (me._getChildElCls && me._getChildElCls()) || ''; // hook for rtl cls

		if (!me.multiSelectItemTpl) {
			if (!me.labelTpl) {
				me.labelTpl = '{' + me.displayField + '}';
			}
			me.labelTpl = me.lookupTpl('labelTpl');

			if (me.tipTpl) {
				me.tipTpl = me.lookupTpl('tipTpl');
			}

			me.multiSelectItemTpl = new Ext.XTemplate([
				'<tpl for=".">',
				'<tpl if="!this.isItemHidden(values)">', // <-- Added
				'<li data-selectionIndex="{[xindex - 1]}" data-recordId="{internalId}" role="presentation" class="' + me.tagItemCls + childElCls,
				'<tpl if="this.isItemEditable()"> ' + me.editableTagItemCls + '</tpl>', // <-- Added
				'<tpl if="this.isItemClickable()"> ' + me.clickableTagItemCls + '</tpl>', // <-- Added
				'<tpl if="this.isSelected(values)">',
				' ' + me.tagSelectedCls,
				'</tpl>',
				'{%',
				'values = values.data;',
				'%}',
				me.tipTpl ? '" data-qtip="{[this.getTip(values)]}" style="{[this.getItemStyle(values)]}">' : '" style="{[this.getItemStyle(values)]}">', // <-- Modified adding getItemStyle
				'<div role="presentation" class="' + me.tagItemTextCls + '<tpl if="this.hasItemIcon(values)"> ' + me.tagItemTextWithIconCls + '</tpl>" style="{[this.getLabelStyle(values)]}">', // <-- Modified adding tagItemTextWithIconCls + getLabelStyle and splitting string on more lines
				'<tpl if="this.hasItemIcon(values)"><div role="presentation" class="' + me.tagItemTextIconCls + ' {[this.iconValue(values)]}"></div><span class="' + me.tagItemTextAfterIconCls + '"></tpl>', // <-- Added
				'{[this.getItemLabel(values)]}', // <-- Modified splitting on more lines
				'<tpl if="this.hasItemIcon(values)"></span></tpl>', // <-- Added
				'</div>', // <-- Modified splitting on more lines
				'<tpl if="!this.isReadOnly()">', // <-- Added
				'<tpl if="this.isItemEditable()"><div role="presentation" class="' + me.tagItemCloseCls + ' ' + me.tagItemEditCls + childElCls + '"></div></tpl>', // <-- Added
				'<div role="presentation" class="' + me.tagItemCloseCls + childElCls + '"></div>',
				'</tpl>', // <-- Added
				'</li>',
				'</tpl>', // <-- Added
				'</tpl>',
				{
					isSelected: function(rec) {
						return me.selectionModel.isSelected(rec);
					},
					getItemLabel: function(values) {
						if (this.isDummyItem(values)) return this.genDummyMarkup(); // <-- Added
						return Ext.String.htmlEncode(me.labelTpl.apply(values));
					},
					getTip: function(values) {
						if (this.isDummyItem(values)) return Ext.String.htmlEncode(values[me.valueField]); // <-- Added
						return Ext.String.htmlEncode(me.tipTpl.apply(values));
					},
					isReadOnly: function() { // <-- Added
						return me.readOnly;
					},
					isItemEditable: function() { // <-- Added
						return me.itemEditable;
					},
					isItemClickable: function() { // <-- Added
						return Ext.isFunction(me.itemClickHandler);
					},
					isItemHidden: Sonicle.Utils.tplValueGetterFn(undefined, {fn: me.isItemHidden, scope: me}, false), // <-- Added
					hasItemIcon: function() { // <-- Added
						return me.showItemIcon;
					},
					iconValue: Sonicle.Utils.tplValueGetterFn(me.iconField, {fn: me.getIcon, scope: me}, ''), // <-- Added
					getColor: function(values) { // <-- Added
						if (Ext.isEmpty(me.colorField)) return undefined;
						return values[me.colorField] || me.defaultColor || '#FFFFFF';
					},
					getItemStyle: function(values) { // <-- Added
						var color = this.getColor(values),
							styles = {
								backgroundColor: color,
								borderColor: color
							};
						
						if (color === undefined) {
							return '';
						} else {
							if (color === '#FFFFFF') {
								Ext.apply(styles, {borderColor: me.lightTagsBorderColor || '#A8A8A8'});
							}
							return Ext.dom.Helper.generateStyles(styles);
						}	
					},
					getLabelStyle: function(values) { // <-- Added
						var color = this.getColor(values);
						if (color === undefined) {
							return '';
						} else {
							return Ext.dom.Helper.generateStyles({
								color: Sonicle.ColorUtils.bestForeColor(color, 'fixed', { luminance: me.colorLuminance })
							});
						}
					},
					isDummyItem: function(values) { // <-- Added
						return me.useDummyItem && values[me.displayField] === values[me.valueField];
					},
					genDummyMarkup: function() { // <-- Added
						var iconCls = me.dummyWarningIconCls;
						if ('loading' === me.dummyIcon) {
							iconCls = me.dummyLoadingIconCls;
						}
						return '<i class="' + iconCls + '" aria-hidden="true"></i>';
					},
					strict: true
				}
			]);
		}
		if (!me.multiSelectItemTpl.isTemplate) {
			me.multiSelectItemTpl = this.lookupTpl('multiSelectItemTpl');
		}

		return me.multiSelectItemTpl.apply(me.valueCollection.getRange());
	},
	
	/**
	 * Here field is wrapped, so apply fieldStyle to the wrapper
	 */
	getSubTplData: function(fieldData) {
		var me = this,
			data = me.callParent(arguments);
		if (!Ext.isEmpty(me.fieldStyle)) data.wrapperStyle = (data.wrapperStyle || '') + me.fieldStyle;
		return data;
	},
	
	/*
	getLabelValue: function() {
		return Sonicle.String.split(this.getRawValue(), ',');
	},
	
	setLabelValue: function(value) {
		var me = this,
			SoS = Sonicle.String,
			SoD = Sonicle.Data,
			bind, valueBind,
			values = [], dvalues, recs;
		
		// Here we check if the setValue is being called by bind getting synced
		// if this is the case while the field has focus. If this is the case, we
		// don't want to change the field value. (like Ext.form.field.ComboBox's setValue)
		if (me.hasFocus) {
			bind = me.getBind();
			valueBind = bind && bind.labelValue;
			if (valueBind && valueBind.syncing) return;
		}
		
		if (me.store) {
			dvalues = Ext.isArray(value) ? value : SoS.split(value, me.delimiter);
			Ext.iterate(dvalues, function(dvalue) {
				recs = SoD.findRecords(me.store, me.displayField, dvalue, false, true, true);
				Ext.Array.push(recs, SoD.findRecords(me.valueStore, me.displayField, dvalue, false, true, true));
				if (recs.length > 0) Ext.Array.push(values, SoD.collectValues(recs, me.valueField));
			});
			me.setValue(SoS.deflt(SoS.join(me.delimiter, values), null));
		}
	},
	*/
	
	/**
	 * This is an alternative way to set the specified value(s) into the field: 
	 * passed values are treated as instances of configured {@link #displayField}.
	 * Similarly to {@link #setValue}, the following value formats are recognized:
	 *  - Single Values
	 *     - A string associated to this field's configured {@link #displayField}
	 *  - Multiple Values
	 *     - If {@link #multiSelect} is `true`, a string containing multiple strings as
	 *       specified in the Single Values section above, concatenated in to one string
	 *       with each entry separated by this field's configured {@link #delimiter}
	 *     - An array of strings as specified in the Single Values section above
	 * @param {Mixed} displayValue The value(s) of display to be set.
	 * @return {Ext.form.field.Field/Boolean} this, or `false`
	 */
	setValueAsDisplay: function(displayValue) {
		var me = this,
			bind, displayValueBind;
		
		if (!me.enableValueAsDisplay) return;
		
		// Here we check if the setValue is being called by bind getting synced
		// if this is the case while the field has focus. If this is the case, we
		// don't want to change the field value. (like Ext.form.field.ComboBox's setValue)
		if (me.hasFocus) {
			bind = me.getBind();
			displayValueBind = bind && bind.displayValue;
			if (displayValueBind && displayValueBind.syncing) return;
		}
		
		var displayField = me.displayField,
			store = me.store,
			autoLoadOnValue = me.autoLoadOnValue,
			isLoaded = store.getCount() > 0 || store.isLoaded(),
			pendingLoad = store.hasPendingLoad(),
			unloaded = autoLoadOnValue && !isLoaded && !pendingLoad,
			item, len, i, displayRecord, isNull, value = [];
		
		if (!me.enableValueAsDisplay) return;
		
		if (Ext.isEmpty(displayValue)) {
			displayValue = null;
			isNull = true;
		} else if (Ext.isString(displayValue) && me.multiSelect) {
			displayValue = displayValue.split(me.delimiter);
		} else {
			displayValue = Ext.Array.from(displayValue, true);
		}
		
		if (!isNull && me.multiSelect && me.queryMode === 'local' && !store.isEmptyStore && !unloaded) {
			for (i = 0, len = displayValue.length; i < len; i++) {
				item = displayValue[i];
				if (item && !item.isModel) {
					displayRecord = me.findRecord(displayField, item);
					if (displayRecord) {
						value.push(displayRecord);
					}
				}
			}
		}
		
		// For single-select boxes, use the last good (formal record) value if possible
		if (!isNull && !me.multiSelect && me.queryMode === 'local' && !store.isEmptyStore && !unloaded && displayValue.length > 0) {
			for (i = displayValue.length - 1; i >= 0; i--) {
				item = displayValue[i];
				if (item && !item.isModel) {
					displayRecord = me.findRecord(displayField, item);
					if (displayRecord) {
						value = displayRecord;
					}
				}
			}
		}
		
		return me.setValue(value);
	},
	
	/**
	 * Gets the value(s) as display type.
	 * @return {Mixed[]} The values of display.
	 */
	getValueAsDisplay: function() {
		var me = this,
			values = [],
			records, i, len;
		
		if (!me.enableValueAsDisplay) return;
		
		records = me.getValueRecords();
		for (i = 0, len = records.length; i < len; i++) {
			values.push(records[i].data[me.displayField]);
		}
		return values;
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Base#publishValue}:
	 *  - Support publishing of valueAsDisplay (if enabled)
	 */
	publishValue: function() {
		var me = this;
		me.callParent(arguments);
		if (me.enableValueAsDisplay === true && me.rendered && !me.getErrors().length) {
			me.publishState('valueAsDisplay', me.getValueAsDisplay());
		}
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Overrides original {@link Ext.form.field.Tag#clearInput}:
	 *  - Support 
	 */
	clearInput: function() {
		var me = this,
			valueRecords = me.getValueRecords(),
			inputValue = me.inputEl && me.inputEl.dom.value,
			lastDisplayValue;
		
		if (valueRecords.length && inputValue) {
			lastDisplayValue = valueRecords[valueRecords.length - 1].get(me.displayField);
			
			if (!me.forceInputCleaning && !Ext.String.startsWith(lastDisplayValue, inputValue, true)) {
				return;
			}
			
			me.inputEl.dom.value = '';
			
			if (me.queryMode === 'local') {
				me.clearLocalFilter();
				// we need to refresh the picker after removing
				// the local filter to display the updated data
				me.getPicker().refresh();
			}
		}
		me.syncInputWidth();
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#onKeyDown}:
	 *  - handle item editing (if enabled)
	 */
	onKeyDown: function(e) {
		var me = this,
			key = e.getKey(),
			isEdit = key === e.F2,
			isCopy = key === e.C && e.ctrlKey,
			selModel = me.selectionModel,
			textSelection = me.getTextSelection(),
			stopEvent = false,
			rec, item;
		
		if (me.destroyed || me.readOnly || me.disabled || !me.editable) {
			return;
		}
		if (isEdit && me.itemEditable) {
			if (selModel.getCount() === 1) {
				rec = selModel.getSelection()[0];
				item = me.getItemListNode(rec);
				if (item) {
					me.startItemEditing(rec, rec.get(me.displayField), Ext.fly(item).down('.' + me.tagItemTextCls));
					stopEvent = true;
				}
			}
		} else if (isCopy && !textSelection) {
			var values = [], copy;
			if (selModel.getCount() > 0) {
				Ext.iterate(selModel.getSelection(), function(rec) {
					values.push(rec.get(me.valueField));
				});
				copy = Sonicle.String.join('\n', values);
			} else {
				copy = me.getValue();
			}
			if (!Ext.isEmpty(copy)) {
				Sonicle.ClipboardMgr.copy(copy);
			}
			stopEvent = e.C;
		}
		if (stopEvent) {
			me.preventKeyUpEvent = stopEvent;
			e.stopEvent();
			return;
		}
		me.callParent(arguments);
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#onItemListClick}:
	 *  - handle item editing action
	 *  - handle item click handler
	 *  - handle click on icon
	 */
	onItemListClick: function(e) {
		var me = this,
			itemEl = e.getTarget(me.tagItemSelector),
			textEl = itemEl ? e.getTarget('.' + me.tagItemTextCls) : false,
			textIconEl = itemEl ? e.getTarget('.' + me.tagItemTextIconCls) : false,
			editEl = itemEl ? e.getTarget('.' + me.tagItemEditCls) : false,
			rec;
		
		if (me.readOnly || me.disabled) return;
		
		if (itemEl && editEl) {
			e.stopPropagation();
			rec = me.getRecordByListItemNode(itemEl);
			if (rec) me.startItemEditing(rec, rec.get(me.displayField), Ext.fly(itemEl).down('.' + me.tagItemTextCls));
			
		} else if (itemEl && !textIconEl && textEl && Ext.isFunction(me.itemClickHandler)) {
			rec = me.getRecordByListItemNode(itemEl);
			if (rec) Ext.callback(me.itemClickHandler, me.scope || me, [me, rec, e]);
			
		} else {
			me.callParent(arguments);
		}
	},
	
	privates: {
		startItemEditing: function(valueRecord, startValue, el) {
			var me = this,
				editor = me.itemEditor;
			
			if (editor.editing) editor.cancelEdit();
			editor.valueInternalId = valueRecord.internalId;
			editor.startEdit(el, startValue);
			editor.field.focus();
		},
		
		onItemEditingComplete: function(valueInternalId, newValue, oldValue) {
			var me = this,
				displayField = me.displayField,
				rec = me.store ? me.store.getByInternalId(valueInternalId) : null;
			
			if (rec && me.fireEvent('beforeitemedit', me, rec, newValue, oldValue) !== false) {
				if (Ext.isString(displayField)) rec.set(displayField, newValue);
				me.fireEvent('itemedit', me, rec, newValue, oldValue);
			}
		},
		
		getItemListNode: function(record) {
			var itemList = this.itemList, node;
			if (itemList && record) {
				node = itemList.selectNode('[data-recordid="' + record.internalId + '"]');
			}
			return node;
		}
	},
	
	statics: {
		buildTagsData: function(tagsStore, tagNameField, tagColorField, max, tags, delimiter) {
			var ids = Ext.isArray(tags) ? tags : Sonicle.String.split(tags, delimiter || '|'),
					arr = [];
			if ((ids.length > 0) && tagsStore) {
				Ext.iterate(ids, function(id) {
					if ((max !== -1) && (arr.length >= max)) return false;
					var rec = tagsStore.getById(id);
					if (rec) arr.push({color: rec.get(tagColorField), name: rec.get(tagNameField)});
				});
			}
			return arr;
		},
		
		/**
		 * Generates HTML markup for displaying tags.
		 * @param {Object[]} tags Object array containing tags definition.
		 * Any item must have the following structure:
		 *  - color: String
		 *  - name: String
		 */
		generateTagsMarkup: function(tags, opts) {
			opts = opts || {};
			var SoTag = Sonicle.form.field.Tag,
				html = '', tagStyle, style;
			Ext.iterate(tags, function(tag) {
				tagStyle = SoTag.computeTagStyle(tag.color, opts.colorLuminance);
				style = Ext.DomHelper.generateStyles(Ext.apply(opts.moreStyles || {}, tagStyle.styles, {
					fontSize: '0.9em'
				}));
				html += '<span class="so-tagfield-item-displayonly" style="' + style + '">' + Sonicle.String.htmlEncode(tag.name) + '</span>';
			});
			return html;
		},
		
		/**
		 * Computes a style object for the passed Tag color.
		 * @param {String} color The Tag color.
		 * @param {Number} colorLuminance The desired luminance to use.
		 * @return {Object} An object with the following properties:
		 *  - color: The computed fore color
		 *  - bgColor: The computed background color
		 *  - styles: A CSS Style definition object (suitable for {@link Ext.DomHelper.generateStyles})
		 */
		computeTagStyle: function(color, colorLuminance) {
			var bgco = color || '#FFFFFF',
				txtco = Sonicle.ColorUtils.bestForeColor(bgco, 'fixed', { luminance: colorLuminance });
			return {
				color: txtco,
				bgColor: bgco,
				styles: {
					color: txtco,
					backgroundColor: bgco,
					borderColor: bgco === '#FFFFFF' ? '#A8A8A8' : bgco
				}
			};
		},
		
		/**
		 * Measures component markup real dimensions. This il really done one-time unless forced.
		 * @param {Boolean} force To repeat the measurements.
		 * @return {Object} A result object with `liItemHeight` and `liItemTBMargin` properties.
		 */
		measure: function(force) {
			var SoTag = Sonicle.form.field.Tag;
			if (force === true || !SoTag.measures) {
				var ret = {}, dummyEl, dummyId1, dummyId2;

				dummyEl = Ext.getBody().appendChild({
					id: Ext.id(null, 'so-tagfield-dummy-'),
					tag: 'div',
					style: 'visibility:hidden;pointer-events:none;border:none;',
					html: '<div class="x-form-field x-form-text x-form-text-default"><ul class="x-tagfield-list"><li class="x-tagfield-item"><div class="x-tagfield-item-text">&nbsp;</div></li></ul></div>'
				});
				dummyId1 = dummyEl.getId();
				
				Ext.apply(ret, {
					liItemHeight: dummyEl.down('li').getHeight(false, true),
					liItemTBMargin: dummyEl.down('li').getMargin('tb')
				});
				
				/*
				dummyEl = Ext.getBody().appendChild({
					id: Ext.id(null, 'so-formitem-dummy-'),
					tag: 'div',
					style: 'visibility:hidden;pointer-events:none;border:none;',
					html: '<div class="x-form-item-body x-form-item-body-default x-form-text-field-body x-form-text-field-body-default">&nbsp;</div>'
				});
				dummyId2 = dummyEl.getId();

				ret.fieldHeight = dummyEl.getHeight(false, true);
				*/

				Ext.defer(function() {
					Ext.fly(dummyId1).destroy();
					//Ext.fly(dummyId2).destroy();
				}, 10);
				SoTag.measures = ret;
			}
			return SoTag.measures;
		},
		
		// Private measure retult object
		measures: false
	}
});
