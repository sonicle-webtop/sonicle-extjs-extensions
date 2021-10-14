/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/advlist/main/ts/core/Actions.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/advlist/main/ts/api/Commands.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/advlist/main/ts/ui/Buttons.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/advlist/main/ts/core/ListUtils.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.BullListSelect', {
	extend: 'Sonicle.form.field.tinymce.tool.base.SplitButton',
	alias: ['widget.so-tmcetoolbulllistselect'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.form.field.tinymce.tool.base.StateButton'
	],
	uses: [
		'Sonicle.form.field.tinymce.tool.NumListSelect'
	],
	
	enableToggle: true,
	tooltip: 'Bullet list',
	
	toolIconCls: 'fa fa-list-ul',
	defaultIconCls: 'so-tmcetoolbulllistselect-default',
	defaultText: 'Default',
	circleIconCls: 'so-tmcetoolbulllistselect-circle',
	circleText: 'Circle',
	squareIconCls: 'so-tmcetoolbulllistselect-square',
	squareText: 'Square',
	
	listStyleMap: {
		'default': 'disc',
		'circle': 'circle',
		'square': 'square'
	},
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				plain: true,
				items: [
					{
						xtype: 'buttongroup',
						columns: 3,
						defaults: {
							xtype: 'button',
							scale: 'large',
							iconAlign: 'center',
							toggleGroup: me.id + 'bulllist',
							handler: function(s) {
								me.applyList(s.pressed ? me.listStyleMap[s.getItemId()] : false);
							},
							scope: me
						},
						items: [
							{
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'default',
								iconCls: me.defaultIconCls,
								tooltip: me.defaultText
							}, {
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'circle',
								iconCls: me.circleIconCls,
								tooltip: me.circleText
							}, {
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'square',
								iconCls: me.squareIconCls,
								tooltip: me.squareText
							}
						]
					}
				],
				listeners: {
					beforeshow: function(s) {
						var ed = me.getEditor(),
								group = s.getComponent(0),
								noMatch = true,
								style, key;
						if (ed) {
							// Style can be any list type (ordered/unordered)
							style = Sonicle.form.field.tinymce.tool.NumListSelect.getSelectedStyleType(ed, me.listStyleMap['default']);
							if (style === null) { // List not active, unpress all items
								// Do nothing, noMatch is already true
							} else { // List active, look for the right key
								key = Ext.Object.getKey(me.listStyleMap, style);
								if (key) {
									noMatch = false;
									group.getComponent(key).toggle(true);
								}
							}
							if (noMatch) {
								group.items.each(function(item) {
									item.toggle(false, true);
								});
							}
						}
					}
				}
			},
			handler: function(s) {
				me.applyList(s.pressed ? me.listStyleMap['default'] : false);
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
		} else if (editor) {
			editor.off('NodeChange', monCbks['onNodeChange']);
		}
	},
	
	privates: {
		applyList: function(styleType) {
			if (styleType === false) {
				this.getHtmlEditor().editorExecuteCommand('RemoveList');
			} else {
				var hed = this.getHtmlEditor();
				hed.editorExecuteCommand('InsertUnorderedList', {
					'list-style-type': styleType,
					'list-attributes': {style: hed.generateCurrentStyles({fontFamily: false, fontSize: false})}
				});
			}
		},
		
		onEditorNodeChange: function(e) {
			var me = this,
					NLS = Sonicle.form.field.tinymce.tool.NumListSelect;
			me.toggle(NLS.isWithinList(me.getEditor(), e, 'UL'), true);
		}
	}
});
