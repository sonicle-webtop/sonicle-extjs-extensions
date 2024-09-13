/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.grid.TileList', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.sotilelist',
	requires: [
		'Sonicle.ClipboardMgr',
		'Sonicle.grid.column.Action'
	],
	
	/**
	 * @cfg {String} valueField
	 * The underlying {@link Ext.data.Field#name data field name} that targets value.
	 */
	valueField: 'value',
	
	/**
	 * @cfg {String} captionField
	 * The underlying {@link Ext.data.Field#name data field name} that targets caption.
	 */
	captionField: 'caption',
	
	/**
	 * @cfg {Boolean} linkifyValue
	 * Set to `true` to add link Class to value.
	 */
	linkifyValue: false,
	
	clipboardIconCls: 'far fa-clone',
	clipboardTooltipText: 'Copy to clipboard',
	captionTexts: undefined,
	captionIcons: undefined,
	
	border: false,
	rowLines: false,
	hideHeaders: true,
	disableSelection: true,
	
	componentCls : 'so-'+'tilelist',
	linkifyCls: 'so-'+'tilelist-link',
	cellCaptionCls: 'so-'+'tilelist-caption',
	cellValueCls: 'so-'+'tilelist-value',
	
	/**
	 * @event cellvaluecopy
	 * @param {Sonicle.grid.TileList} this
	 * @param {Mixed} value The value referenced by {@link #valueField}.
	 * @param {String} caption The caption value referenced by {@link #captionField}.
	 */
	
	/**
	 * @event cellvalueclick
	 * @param {Sonicle.grid.TileList} this
	 * @param {Mixed} value The value referenced by {@link #valueField}.
	 * @param {Ext.data.Model} model The model.
	 */
	
	initComponent: function() {
		var me = this;
		me.columns = me._createColumns();
		me.callParent(arguments);
		me.on('cellclick', me._onCellClick, me);
	},
	
	privates: {
		_createColumns: function() {
			var me = this,
				SoS = Sonicle.String,
				captionCls = SoS.coalesce(me.cellCaptionCls, ''),
				valueCls = SoS.coalesce(me.cellValueCls, '');
			return [
				{
					xtype: 'templatecolumn',
					tpl: [
						'<div class="' + captionCls + '">',
							'{[this.getCaptionIcon(values)]}',
							'{[this.getCaption(values)]}',
						'</div>',
						'<span class="' + valueCls + ' {[this.getLinkifyCls()]}">{[this.getValue(values)]}</span>',
						{
							getCaptionIcon: function(values) {
								var caption = !Ext.isEmpty(me.captionField) ? values[me.captionField] : null,
									iconCls;
								if (me.captionIcons && (iconCls = me.captionIcons[caption])) {
									if (Ext.isString(iconCls)) return '<i class="' + iconCls + '" aria-hidden="true"></i>';
								}
								return '';
							},
							getCaption: function(values) {
								var caption = !Ext.isEmpty(me.captionField) ? values[me.captionField] : null;
								if (me.captionTexts === undefined) {
									return this.value(caption);
								} else {
									return caption ? this.value(me.captionTexts[caption]) : null;
								}
							},
							getLinkifyCls: function() {
								return me.linkifyValue ? (me.linkifyCls || '') : '';
							},
							getValue: function(values) {
								return Ext.isEmpty(me.valueField) ? '' : this.value(values[me.valueField]);
							},
							value: function(s) {
								return !Ext.isEmpty(s) ? Ext.String.htmlEncode(s) : '';
							}
						}
					],
					flex: 1
				}, {
					xtype: 'soactioncolumn',
					//align: 'center',
					//hidden: WT.plTags.mobile,
					items: [
						{
							iconCls: me.clipboardIconCls,
							tooltip: me.clipboardTooltipText,
							handler: function(g, ridx) {
								var rec = g.getStore().getAt(ridx),
									value = rec.get(me.valueField);
								Sonicle.ClipboardMgr.copy(value);
								me.fireEvent('cellvaluecopy', me, value, rec.get(me.captionField));
							}
						}
					]
				}
			];
		},

		_onCellClick: function(s, td, cidx, rec) {
			var me = this;
			if (cidx === 0) {
				me.fireEvent('cellvalueclick', me, rec.get(me.valueField), rec);
			}
		}
	}
});