/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/SimpleControls.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/IndentOutdent.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/complex/StyleSelect.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/complex/StyleFormat.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.FormatTools', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetoolformattools'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.form.field.tinymce.tool.base.MenuItem',
		'Sonicle.form.field.tinymce.tool.base.StateMenuItem'
	],
	
	tooltip: 'More formatting tools',
	
	toolIconCls: 'fas fa-font',
	strikethroughIconCls: 'fas fa-strikethrough',
	strikethroughText: 'Strikethrough',
	subscriptIconCls: 'fas fa-subscript',
	subscriptText: 'Subscript',
	superscriptIconCls: 'fas fa-superscript',
	superscriptText: 'Superscript',
	blockquoteIconCls: 'fas fa-quote-right',
	blockquoteText: 'Citation',
	codeIconCls: 'fas fa-code',
	codeText: 'Code (inline)',
	preIconCls: 'fas fa-th',
	preText: 'Preformatted',
	outdentIconCls: 'fas fa-outdent',
	outdentText: 'Outdent',
	indentIconCls: 'fas fa-indent',
	indentText: 'Indent',
	clearformatIconCls: 'fas fa-eraser',
	clearformatText: 'Clear formatting',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				items: [
					{
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'strikethrough',
						iconCls: me.strikethroughIconCls,
						text: me.strikethroughText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('Strikethrough');
						}
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'subscript',
						iconCls: me.subscriptIconCls,
						text: me.subscriptText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('Subscript');
						}
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'superscript',
						iconCls: me.superscriptIconCls,
						text: me.superscriptText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('Superscript');
						}
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'blockquote',
						iconCls: me.blockquoteIconCls,
						text: me.blockquoteText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('mceBlockQuote');
						}
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'code',
						iconCls: me.codeIconCls,
						text: me.codeText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('mceToggleFormat', 'code');
						}
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'pre',
						iconCls: me.preIconCls,
						text: me.preText,
						handler: function(s) {
							var hed = me.getHtmlEditor();
							// Issue a RemoveFormat before toggling pre formatting: this make sure
							// that selected text/block has no font-family or other styles that 
							// could affect preformatted block display
							if (s.checked) hed.editorExecuteCommand('RemoveFormat');
							hed.editorExecuteCommand('mceToggleFormat', 'pre');
							if (!s.checked) hed.editorApplyDefaultFormatting();
						}
					}, '-', {
						xtype: 'so-tmcetoolmenuitem',
						itemId: 'outdent',
						iconCls: me.outdentIconCls,
						text: me.outdentText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('outdent');
						}
					}, {
						xtype: 'so-tmcetoolmenuitem',
						itemId: 'indent',
						iconCls: me.indentIconCls,
						text: me.indentText,
						handler: function() {
							me.getHtmlEditor().editorExecuteCommand('indent');
						}
					}, '-', {
						xtype: 'so-tmcetoolmenuitem',
						itemId: 'clearformat',
						iconCls: me.clearformatIconCls,
						text: me.clearformatText,
						handler: function() {
							var hed = me.getHtmlEditor();
							hed.editorExecuteCommand('RemoveFormat');
							hed.editorApplyDefaultFormatting();
						}
					}
				]
			}
		});
		me.callParent(arguments);
	},
	
	bindEditor: function(editor, htmlEditor) {
		var me = this,
				monCbks = me.getEditorMonitoredCallbacks();
		if (htmlEditor) {
			me.editor = editor;
			monCbks['onNodeChange'] = Ext.bind(me.onEditorNodeChange, me);
			editor.on('NodeChange', monCbks['onNodeChange']);
			monCbks['onFormatChanged'] = Ext.bind(me.onEditorFormatChanged, me);
			editor.formatter.formatChanged('strikethrough', monCbks['onFormatChanged']);
			editor.formatter.formatChanged('subscript', monCbks['onFormatChanged']);
			editor.formatter.formatChanged('superscript', monCbks['onFormatChanged']);
			editor.formatter.formatChanged('blockquote', monCbks['onFormatChanged']);
			editor.formatter.formatChanged('code', monCbks['onFormatChanged']);
			editor.formatter.formatChanged('pre', monCbks['onFormatChanged']);
		} else if (editor) {
			editor.off('NodeChange', monCbks['onNodeChange']);
		}
	},
	
	privates: {
		onEditorNodeChange: function() {
			this.getMenu().getComponent('outdent').setDisabled(!this.getHtmlEditor().editorQueryCommandState('outdent'));
		},
		
		onEditorFormatChanged: function(active, data) {
			var menu = this.getMenu();
			if (data.format === 'strikethrough') {
				menu.getComponent('strikethrough').setChecked(active, true);
			}
			if (data.format === 'subscript')  {
				menu.getComponent('subscript').setChecked(active, true);
			}
			if (data.format === 'superscript')  {
				menu.getComponent('superscript').setChecked(active, true);
			}
			if (data.format === 'blockquote')  {
				menu.getComponent('blockquote').setChecked(active, true);
			}
			if (data.format === 'code')  {
				menu.getComponent('code').setChecked(active, true);
			}
			if (data.format === 'pre')  {
				menu.getComponent('pre').setChecked(active, true);
			}
		}
	}
});
