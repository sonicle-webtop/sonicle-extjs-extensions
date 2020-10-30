/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/codesample/main/ts/api/Commands.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/code/main/ts/api/Commands.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.DevTools', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetooldevtools'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	
	tooltip: 'Developer tools',
	
	toolIconCls: 'fa fa-code',
	codeSample: true,
	codeSampleIconCls: 'fa fa-file-code-o',
	codeSampleText: 'Insert/Edit code sample',
	sourceCode: true,
	sourceCodeIconCls: 'fa fa-code',
	sourceCodeText: 'Source code',
	
	initComponent: function() {
		var me = this,
				items = [];
		
		if (me.codeSample) {
			items.push({
				itemId: 'codesample',
				iconCls: me.codeSampleIconCls,
				text: me.codeSampleText,
				handler: function() {
					me.getHtmlEditor().editorExecuteCommand('codesample');
				}
			});
		}
		if (me.sourceCode) {
			if (items.length > 0) items.push('-');
			items.push({
				itemId: 'source',
				iconCls: me.sourceCodeIconCls,
				text: me.sourceCodeText,
				handler: function() {
					me.getHtmlEditor().editorExecuteCommand('mceCodeEditor');
				}
			});
		}
		
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				items: items
			}
		});
		me.callParent(arguments);
	}
});
