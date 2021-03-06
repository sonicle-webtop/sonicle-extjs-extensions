/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.tree.Column', {
	extend: 'Ext.tree.Column',
	alias: 'widget.sotreecolumn',
	
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
	
	initTemplateRendererData: function(value, metaData, record, rowIdx, colIdx, store, view) {
		return Ext.apply(this.callParent(arguments), {
			customElbowCls: metaData.customElbowCls || '',
			customCheckboxCls: metaData.customCheckboxCls || '',
			checkboxStyle: metaData.checkboxStyle || '',
			iconStyle: metaData.iconStyle || ''
		});
	}
});
