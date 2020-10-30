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
Ext.define('Sonicle.form.field.tinymce.tool.NumListSelect', {
	extend: 'Sonicle.form.field.tinymce.tool.base.SplitButton',
	alias: ['widget.so-tmcetoolnumlistselect'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.form.field.tinymce.tool.base.StateButton'
	],
	
	enableToggle: true,
	tooltip: 'Numbered list',
	
	toolIconCls: 'fa fa-list-ol',
	defaultIconCls: 'so-tmcetoolnumlistselect-default',
	defaultText: 'Default',
	lowerAlphaIconCls: 'so-tmcetoolnumlistselect-lowerAlpha',
	lowerAlphaText: 'Lower Alpha',
	lowerGreekIconCls: 'so-tmcetoolnumlistselect-lowerGreek',
	lowerGreekText: 'Lower Greek',
	lowerRomanIconCls: 'so-tmcetoolnumlistselect-lowerRoman',
	lowerRomanText: 'Lower Roman',
	upperAlphaIconCls: 'so-tmcetoolnumlistselect-upperAlpha',
	upperAlphaText: 'Upper Alpha',
	upperRomanIconCls: 'so-tmcetoolnumlistselect-upperRoman',
	upperRomanText: 'Upper Roman',
	
	listStyleMap: {
		'default': 'decimal',
		'lowerAlpha': 'lower-alpha',
		'lowerGreek': 'lower-greek',
		'lowerRoman': 'lower-roman',
		'upperAlpha': 'upper-alpha',
		'upperRoman': 'upper-roman'
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
							toggleGroup: me.id + 'numlist',
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
								itemId: 'lowerAlpha',
								iconCls: me.lowerAlphaIconCls,
								tooltip: me.lowerAlphaText
							}, {
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'lowerGreek',
								iconCls: me.lowerGreekIconCls,
								tooltip: me.lowerGreekText
							}, {
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'lowerRoman',
								iconCls: me.lowerRomanIconCls,
								tooltip: me.lowerRomanText
							}, {
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'upperAlpha',
								iconCls: me.upperAlphaIconCls,
								tooltip: me.upperAlphaText
							}, {
								xtype: 'so-tmcetoolstatebutton',
								itemId: 'upperRoman',
								iconCls: me.upperRomanIconCls,
								tooltip: me.upperRomanText
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
				this.getHtmlEditor().editorExecuteCommand('InsertOrderedList', {'list-style-type': styleType});
			}
		},
		
		onEditorNodeChange: function(e) {
			var me = this;
			me.toggle(me.self.isWithinList(me.getEditor(), e, 'OL'), true);
		}
	},
	
	statics: {
		getSelectedStyleType: function(editor, defaultStyleType) {
			var listEl = editor.dom.getParent(editor.selection.getNode(), 'ol,ul');
			if (listEl) {
				return editor.dom.getStyle(listEl, 'listStyleType') || defaultStyleType;
			} else {
				return null;
			}
		},
		
		isChildOfBody: function(editor, el) {
			return editor.$.contains(editor.getBody(), el);
		},
		
		isTableCellNode: function(node) {
			return node && /^(TH|TD)$/.test(node.nodeName);
		},

		isListNode: function(editor, node) {
			return node && (/^(OL|UL|DL)$/).test(node.nodeName) && this.isChildOfBody(editor, node);
		},
		
		isWithinList: function(editor, e, nodeName) {
			var me = this,
					idx = -1, i;
			for (i=0; i<e.parents.length; i++) {
				if (me.isTableCellNode(e.parents[i])) {
					idx = i;
					break;
				}
			}
			
			var parents = idx !== -1 ? e.parents.slice(0, idx) : e.parents,
					lists = Ext.Array.filter(parents, function(parent) {
						return me.isListNode(editor, parent);
					});
			return lists.length > 0 && lists[0].nodeName === nodeName;
		}
	}
});
