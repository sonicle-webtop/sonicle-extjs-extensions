/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/AlignmentButtons.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.AlignSelect', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetoolalignselect'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.form.field.tinymce.tool.base.StateMenuItem'
	],
	
	tooltip: 'Align',
	
	alignLeftIconCls: 'fas fa-align-left',
	alignLeftText: 'Left',
	alignCenterIconCls: 'fas fa-align-center',
	alignCenterText: 'Center',
	alignRightIconCls: 'fas fa-align-right',
	alignRightText: 'Right',
	alignJustifyIconCls: 'fas fa-align-justify',
	alignJustifyText: 'Justify',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.alignLeftIconCls,
			menu: {
				defaults: {
					group: 'align',
					checkHandler: me.onItemCheckHandler,
					scope: me
				},
				items: [
					{
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'left',
						iconCls: me.alignLeftIconCls,
						text: me.alignLeftText
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'center',
						iconCls: me.alignCenterIconCls,
						text: me.alignCenterText
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'right',
						iconCls: me.alignRightIconCls,
						text: me.alignRightText
					}, {
						xtype: 'so-tmcetoolstatemenuitem',
						itemId: 'justify',
						iconCls: me.alignJustifyIconCls,
						text: me.alignJustifyText
					}
				]
			}
		});
		me.callParent(arguments);
	},
	
	bindEditor: function(editor, htmlEditor) {
		var me = this;
		if (htmlEditor) {
			me.editor = editor;
			var onFormatChanged = Ext.bind(me.onEditorFormatChanged, me);
			editor.formatter.formatChanged('alignleft', onFormatChanged);
			editor.formatter.formatChanged('aligncenter', onFormatChanged);
			editor.formatter.formatChanged('alignright', onFormatChanged);
			editor.formatter.formatChanged('alignjustify', onFormatChanged);
		} else if (editor) {
			// Do nothing...
		}
	},
	
	setAlignValue: function(align) {
		var me = this,
				mitem = me.getMenu().getComponent(align);
		if (mitem) {
			mitem.setChecked(true, true);
			me.setIconCls(mitem.iconCls);
		}
	},
	
	privates: {
		onEditorFormatChanged: function(active, data) {
			var SoS = Sonicle.String;
			if (SoS.isIn(data.format, ['alignleft', 'aligncenter', 'alignright', 'alignjustify'])) {
				this.setAlignValue(active ? SoS.removeStart(data.format, 'align') : 'left');
			}
		},
		
		onItemCheckHandler: function(s, checked) {
			var me = this;
			if (checked) {
				me.getHtmlEditor().editorExecuteCommand('Justify' + Ext.String.capitalize(s.getItemId()));
			}
		}
	}
});
