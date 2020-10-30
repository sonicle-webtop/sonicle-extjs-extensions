/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.tool.FormatBold', {
	extend: 'Sonicle.form.field.tinymce.tool.base.StateButton',
	alias: ['widget.so-tmcetoolbold'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	
	tooltip: 'Bold',
	
	toolIconCls: 'fa fa-bold',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			handler: function() {
				me.getHtmlEditor().editorExecuteCommand('Bold');
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
			editor.formatter.formatChanged('bold', monCbks['onFormatChanged']);
		} else if (editor) {
			// Do nothing...
		}
	},
	
	privates: {
		onEditorFormatChanged: function(active, data) {
			if (data.format === 'bold') this.toggle(active, false);
		}
	}
});
