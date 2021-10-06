/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.tree.Column', {
	extend: 'Ext.tree.Column',
	alias: 'widget.sotreecolumn',
	uses: [
		'Sonicle.String'
	],
	
	cellTpl: [
        '<tpl for="lines">',
            '<div class="{parent.childCls} {parent.elbowCls}-img ',
            '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"></div>',
        '</tpl>',
        '<div class="{childCls} {customElbowCls} {elbowCls}-img {elbowCls}', // added customElbowCls
            '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></div>',
        '<tpl if="checked !== null">',
            '<div role="button" {ariaCellCheckboxAttr}', // added customCheckboxCls and checkboxStyle
                ' class="{childCls} {customCheckboxCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"',
				' <tpl if="checkboxStyle">style="{checkboxStyle}"</tpl>></div>',
        '</tpl>',
        '<tpl if="glyph">',
            '<span class="{baseIconCls}" ',
            '<tpl if="glyphFontFamily">',
                'style="font-family:{glyphFontFamily}"',
            '</tpl>',
            '>{glyph}</span>',
        '<tpl else>',
            '<tpl if="icon">',
                '<img src="{blankUrl}"',
            '<tpl else>',
                '<div',
            '</tpl>',
            ' role="presentation" class="{childCls} {baseIconCls} {customIconCls} ',
            '{baseIconCls}-<tpl if="leaf">leaf<tpl else><tpl if="expanded">parent-expanded<tpl else>parent</tpl></tpl> {iconCls}" ',
            '<tpl if="icon">style="background-image:url({icon})"/><tpl else> <tpl if="checkboxStyle">style="{iconStyle}"</tpl>></div></tpl>',
        '</tpl>',
        '<tpl if="href">',
            '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
        '<tpl else>',
            '<span class="{textCls} {childCls}">{value}</span>',
        '</tpl>'
    ],
	
	/**
	 * @cfg {Function/String} renderer
	 * A renderer is an 'interceptor' method which can be used to transform data (value, 
	 * appearance, etc.) before it is rendered. Note that a *tree column* renderer yields
	 * the *text* of the node. The lines and icons are produced by configurations.
	 * 
	 * This provide more metaData configuration options than the original {@link Ext.tree.Column#renderer}.
	 * 
	 * @param {Object} value The data value for the current cell
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @param {Object} metaData A collection of metadata about the current cell; can be 
	 * used or modified by the renderer. Recognized properties are: `tdCls`, `tdAttr`, 
	 * `tdStyle`, `icon`, `iconCls`, `glyph`, `tooltip`, `customElbowCls`, 
	 * `customCheckboxCls`, `checkboxStyle` and `iconStyle`.
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @param {Ext.data.Model} record The record for the current row
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @param {Number} rowIndex The index of the current row
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @param {Number} colIndex The index of the current column
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @param {Ext.data.Store} store The data store
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @param {Ext.view.View} view The data view
	 * _See also {@link Ext.tree.Column#renderer}_
	 * @return {String} The HTML string to be rendered into the text portion of the tree node.
	 */
	
	initTemplateRendererData: function(value, metaData, record, rowIdx, colIdx, store, view) {
		var SoS = Sonicle.String,
				data = this.callParent(arguments),
				tip = metaData.tooltip,
				tipAttr = this.tooltipType === 'qtip' ? 'data-qtip' : 'title';
		
		if (!Ext.isEmpty(tip) && !SoS.contains(metaData.tdAttr, tipAttr)) {
			metaData.tdAttr = (metaData.tdAttr || '') + tipAttr + '="' + SoS.htmlAttributeEncode(tip) + '"';
		}
		return Ext.apply(data, {
			customElbowCls: metaData.customElbowCls || '',
			customCheckboxCls: metaData.customCheckboxCls || '',
			checkboxStyle: metaData.checkboxStyle || '',
			iconStyle: metaData.iconStyle || ''
		});
	}
});
