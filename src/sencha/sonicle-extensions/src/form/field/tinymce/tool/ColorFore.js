/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/color/ColorSwatch.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.ColorFore', {
	extend: 'Sonicle.form.field.tinymce.tool.base.SplitButton',
	alias: ['widget.so-tmcetoolforecolor'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.picker.Color'
	],
	uses: [
		'Sonicle.ColorUtils',
		'Sonicle.Utils'
	],
	
	/**
	 * @property {String[]} colors
	 * An array of 6-digit color hex code strings (without the # symbol).
	 */
	
	tooltip: 'Fore color',
	
	toolIconCls: 'fas fa-font',
	removeColorIconCls: 'fas fa-eraser',
	removeColorText: 'Remove color',
	
	defaultColor: '000000',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				plain: true,
				items: [
					Sonicle.Utils.applyIfDefined({
						xtype: 'socolorpicker',
						plain: true,
						clickEvent: 'mousedown',
						focus: Ext.emptyFn,
						allowReselect: true,
						handler: function(s, color) {
							me.applyColor(color);
							s.up('menu').hide();
						},
						value: me.defaultColor
					}, {
						colors: Ext.isArray(me.colors) ? me.colors : undefined,
						tilesPerRow: Ext.isNumber(me.tilesPerRow) ? me.tilesPerRow : undefined
					}),
					'-',
					{
						text: me.removeColorText,
						iconCls: me.removeColorIconCls,
						handler: function() {
							me.applyColor(null);
						}
					}
				]
			},
			handler: function() {
				var picker = me.getMenu().getComponent(0);
				if (picker) me.applyColor(picker.getValue());
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
	
	setColorValue: function(color, updatePicker) {
		var me = this,
				hex = Sonicle.form.field.tinymce.tool.ColorFore.parseColor(color),
				picker;
		
		if (hex) {
			me.setButtonColor(hex);
			if (updatePicker !== false) {
				picker = me.getMenu().getComponent(0);
				if (picker) picker.select(hex, true);
			}
		}
	},
	
	privates: {
		onEditorNodeChange: function() {
			this.setColorValue(this.getHtmlEditor().editorQueryCommand('ForeColor'), false);
		},
		
		applyColor: function(color) {
			var me = this,
					hed = me.getHtmlEditor(),
					hcolor = Sonicle.String.prepend(color, '#', true);
			if (color) {
				hed.editorExecuteCommand('ForeColor', hcolor, {focus: true});
				hed.editorExecuteCommand('mceApplyTextcolor', 'forecolor', {args: hcolor, plain: true});
			} else {
				hed.editorExecuteCommand('mceRemoveTextcolor', 'forecolor', {plain: true});
			}
			me.setButtonColor(hcolor);
		},
		
		setButtonColor: function(hcolor) {
			var me = this;
			if (me.btnIconEl) {
				me.btnIconEl.setStyle(!Ext.isEmpty(hcolor) ? {
						borderBottom: '4px solid ' + hcolor,
						lineHeight: '0.8em'
					} : {
						borderBottom: 'none',
						lineHeight: '1em'
				});
			}
		}
	},
	
	statics: {
		parseColor: function(color) {
			var SoCU = Sonicle.ColorUtils,
					cobj = SoCU.parseColor(color);
			return cobj ? SoCU.rgb2hex(cobj, true) : null;
		}
	}
});
