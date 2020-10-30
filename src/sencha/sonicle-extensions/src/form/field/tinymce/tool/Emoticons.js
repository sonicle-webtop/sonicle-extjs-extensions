/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/emoticons/main/ts/core/Actions.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.Emoticons', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetoolemoticons'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.menu.Emoji'
	],
	
	tooltip: 'Emoticons',
	arrowVisible: false,
	
	toolIconCls: 'fa fa-smile-o',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				plain: true,
				items: [
					{
						xtype: 'soemojipicker',
						header: false,
						recentsText: me.recentsText,
						peopleText: me.peopleText,
						natureText: me.natureText,
						foodsText: me.foodsText,
						activityText: me.activityText,
						placesText: me.placesText,
						objectsText: me.objectsText,
						symbolsText: me.symbolsText,
						flagsText: me.flagsText,
						listeners: {
							select: function(s, emoji) {
								me.getHtmlEditor().editorInsertContent(emoji);
							}
						}
					}
				]
			}
		});
		me.callParent(arguments);
	}
});
