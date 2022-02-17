/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.tool.FormatItalic', {
	extend: 'Sonicle.form.field.tinymce.tool.base.StateButton',
	alias: ['widget.so-tmcetoolitalic'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	
	tooltip: 'Italic',
	
	toolIconCls: 'fas fa-italic',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			handler: function() {
				me.getHtmlEditor().editorExecuteCommand('Italic');
			}
		});
		me.callParent(arguments);
	},
	
	bindEditor: function(editor, htmlEditor) {
		var me = this,
				monCbks = me.getEditorMonitoredCallbacks();
		if (htmlEditor) {
			me.editor = editor;
			monCbks['onFormatChanged'] = Ext.bind(me.onEditorFormatChanged, me);
			editor.formatter.formatChanged('italic', monCbks['onFormatChanged']);
		} else if (editor) {
			// Do nothing...
		}
	},
	
	privates: {
		onEditorFormatChanged: function(active, data) {
			if (data.format === 'italic') this.toggle(active, false);
		}
	}
});
