/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/menus/item/build/InsertTableMenuItem.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.Table', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetooltable'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.picker.Table'
	],
	
	tooltip: 'Insert table',
	
	toolIconCls: 'fas fa-table',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				plain: true,
				items: [
					{
						xtype: 'sotablepicker',
						header: false,
						listeners: {
							select: function(s, rows, cols) {
								me.getHtmlEditor().editorExecuteCommand('mceInsertTable', {rows: rows, columns: cols});
							}
						}
					}
				],
				listeners: {
					beforeshow: function(s) {
						s.getComponent(0).clearSelection();
					}
				}
				/*
				hide: function() {
					// Block picker collapsing, only for development!
				}
				*/
			}
		});
		me.callParent(arguments);
	}
});
