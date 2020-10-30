/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/color/ColorSwatch.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.ColorBack', {
	extend: 'Sonicle.form.field.tinymce.tool.base.SplitButton',
	alias: ['widget.so-tmcetoolbackcolor'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.Utils',
		'Sonicle.picker.Color'
	],
	
	tooltip: 'Background color',
	
	toolIconCls: 'fa fa-pencil',
	removeColorIconCls: 'fa fa-eraser',
	removeColorText: 'Remove color',
	
	defaultColor: 'FFFFFF',
	
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
	
	privates: {
		applyColor: function(color) {
			var me = this,
					hed = me.getHtmlEditor(),
					hcolor = Sonicle.String.prepend(color, '#', true);
			if (color) {
				hed.editorExecuteCommand('mceApplyTextcolor', 'hilitecolor', {args: hcolor, plain: true});
			} else {
				hed.editorExecuteCommand('mceRemoveTextcolor', 'hilitecolor', {plain: true});
			}
			if (me.btnIconEl) {
				me.btnIconEl.setStyle(color ? {
						borderBottom: '4px solid ' + hcolor,
						lineHeight: '0.8em'
					} : {
						borderBottom: 'none',
						lineHeight: '1em'
				});
			}
		}
	}
});
