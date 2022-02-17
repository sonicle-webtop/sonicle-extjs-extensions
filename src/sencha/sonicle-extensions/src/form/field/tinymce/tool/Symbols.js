/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/charmap/main/ts/api/Commands.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.Symbols', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetoolsymbols'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	
	tooltip: 'Symbols',
	arrowVisible: false,
	
	toolIconCls: 'fas fa-hashtag',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			handler: function() {
				me.getHtmlEditor().editorExecuteCommand('mceShowCharmap');
			}
		});
		me.callParent(arguments);
	}
});
