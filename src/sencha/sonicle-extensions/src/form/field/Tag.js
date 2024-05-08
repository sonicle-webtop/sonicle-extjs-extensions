/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.Tag', {
	extend: 'Ext.form.field.Tag',
	alias: 'widget.sotagfield',
	uses: [
		'Sonicle.ColorUtils',
		'Sonicle.Data'
	],
	
	/**
	 * @cfg {String} colorField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as tag color.
	 */
	colorField: null,
	
	sourceField: null,
	
	sourceCls: null,
	
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
	 * @cfg {Boolean} createAsDummy
	 * Has no effect if {@link #forceSelection} is `true`.
	 * 
	 * With this set to `true`, values not represented in the Store 
	 * (precisely when valueField value is equal to displayField value) will be 
	 * displayed as dummy elements (with a loading indicator).
	 */
	createAsDummy: false,
	
	/**
	 * @cfg {warning|loading} dummyIcon
	 * Customize the icon of the dummy element.
	 */
	dummyIcon: 'warning',
	
	queryMode: 'local',
	
	/*
	fieldSubTpl: [
        // listWrapper div is tabbable in Firefox, for some unfathomable reason
        '<div id="{cmpId}-listWrapper" data-ref="listWrapper"' + (Ext.isGecko ? ' tabindex="-1"' : ''),
            '<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
            ' class="' + Ext.baseCSSPrefix + 'tagfield {fieldCls} {typeCls} {typeCls}-{ui}"<tpl if="wrapperStyle"> style="{wrapperStyle}"</tpl>>',
            '<span id="{cmpId}-selectedText" data-ref="selectedText" aria-hidden="true" class="' + Ext.baseCSSPrefix + 'hidden-clip"></span>',
            '<ul id="{cmpId}-itemList" data-ref="itemList" role="presentation" class="' + Ext.baseCSSPrefix + 'tagfield-list{itemListCls}">',
                '<li id="{cmpId}-inputElCt" data-ref="inputElCt" role="presentation" class="' + Ext.baseCSSPrefix + 'tagfield-input">',
                    '<input id="{cmpId}-inputEl" data-ref="inputEl" type="{type}" ',
                    '<tpl if="name">name="{name}" </tpl>',
                    '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
                    '<tpl if="size">size="{size}" </tpl>',
                    '<tpl if="tabIdx != null">tabindex="{tabIdx}" </tpl>',
                    '<tpl if="disabled"> disabled="disabled"</tpl>',
                    '<tpl foreach="inputElAriaAttributes"> {$}="{.}"</tpl>',
                    'class="' + Ext.baseCSSPrefix + 'tagfield-input-field {inputElCls} {emptyCls}" autocomplete="off">',
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
	*/
	
	/**
	 * Override original tpl (as Ext.form.field.Tag, see above) to customize inputElCt style when read-only
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
					'class="' + Ext.baseCSSPrefix + 'tagfield-input-field {inputElCls} {emptyCls}" autocomplete="off">',
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
		var me = this;
		me.listConfig = Ext.apply(this.listConfig || {}, {
			getInnerTpl: function(displayField) {
				var picker = this.pickerField,
					enc = ((picker.listConfig || {}).escapeDisplay === true) ? ':htmlEncode' : '',
					sourceCls = Sonicle.String.deflt(picker.sourceCls, ''),
					icon = '';
				
				// TODO: here we have no way to check color value like in getColor 
				// method of multiSelectItemTpl where a fallback color is checked
				// (and eventually provided) for each row.
				if (!Ext.isEmpty(picker.colorField)) {
					icon = '<span style="color:{color};margin-right:5px;"><i class="fas fa-tag"></i></span>';
				}
				return '<span style="float:left;white-space:pre;">'
					+ icon
					+ '{'+displayField+enc+'}'
					+ '</span>'
					+ '<span style="float:right;" class="' + sourceCls + '">'
					+ '{'+picker.sourceField+enc+'}'
					+ '</span>'
					+ '<div style="clear:both;"></div>';
			}
		});
		me.callParent(arguments);
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
	/*
	
	/**
	 * Override original method in order to handle read-only status and add coloring support
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
				'<li data-selectionIndex="{[xindex - 1]}" data-recordId="{internalId}" role="presentation" class="' + me.tagItemCls + childElCls,
				'<tpl if="this.isSelected(values)">',
				' ' + me.tagSelectedCls,
				'</tpl>',
				'{%',
				'values = values.data;',
				'%}',
				me.tipTpl ? '" data-qtip="{[this.getTip(values)]}" style="{[this.getItemStyle(values)]}">' : '" style="{[this.getItemStyle(values)]}">', // <-- Modified adding getItemStyle
				'<div role="presentation" class="' + me.tagItemTextCls + '" style="{[this.getLabelStyle(values)]}">{[this.getItemLabel(values)]}</div>', // <-- Modified adding getLabelStyle
				'<tpl if="!this.isReadOnly()">', // <-- Added
				'<div role="presentation" class="' + me.tagItemCloseCls + childElCls + '"></div>',
				'</tpl>', // <-- Added
				'</li>',
				'</tpl>',
				{
					isSelected: function (rec) {
						return me.selectionModel.isSelected(rec);
					},
					getItemLabel: function (values) {
						if (this.isDummyItem(values)) return this.genDummyMarkup(); // <-- Added
						return Ext.String.htmlEncode(me.labelTpl.apply(values));
					},
					getTip: function (values) {
						if (this.isDummyItem(values)) return Ext.String.htmlEncode(values[me.valueField]); // <-- Added
						return Ext.String.htmlEncode(me.tipTpl.apply(values));
					},
					isReadOnly: function() { // <-- Added
						return me.readOnly;
					},
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
								color: Sonicle.ColorUtils.bestForeColor(color, me.colorLuminance)
							});
						}
					},
					isDummyItem: function(values) { // <-- Added
						return me.createAsDummy && values[me.displayField] === values[me.valueField];
					},
					genDummyMarkup: function() { // <-- Added
						var iconCls = 'fas fa-exclamation-triangle';
						if ('loading' === me.dummyIcon) {
							iconCls = 'fas fa-spinner fa-spin';
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
	
	publishValue: function() {
		var me = this;
		me.callParent(arguments);
		if (me.rendered && !me.getErrors().length) {
			me.publishState('labelValue', me.getLabelValue());
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
		
		generateTagsMarkup: function(data) {
			var html = '';
			Ext.iterate(data, function(tag) {
				var styleObj = Sonicle.form.field.Tag.computeTagStyle(tag.color),
					style = Ext.DomHelper.generateStyles(Ext.apply(styleObj.styles, {
						margin: '0 0 0 2px',
						padding: '0 2px 0 2px',
						fontSize: '0.9em'
					}));
				html += '<span style="' + style + '">' + tag.name + '</span>';
			});
			return html;
		},
		
		computeTagStyle: function(color, colorLuminance) {
			var bgco = color || '#FFFFFF',
					txtco = Sonicle.ColorUtils.bestForeColor(bgco, colorLuminance),
					styles = {
						color: txtco,
						backgroundColor: bgco,
						border: '1px solid',
						borderRadius: '3px',
						borderColor: bgco === '#FFFFFF' ? '#A8A8A8' : bgco
					};
			return {
				color: txtco,
				bgColor: bgco,
				styles: styles
			};
		}
	}
});
