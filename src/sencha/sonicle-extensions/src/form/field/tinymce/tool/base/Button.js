/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.tool.base.Button', {
	extend: 'Ext.button.Button',
	alias: ['widget.so-tmcetoolbutton'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	}
	
	/*
	initComponent: function() {
		var me = this,
				tipTitle = me.tooltipTitle,
				tipText = me.tooltipText;
		if (!Ext.isEmpty(Sonicle.String.coalesce(tipTitle, tipText))) {
			me.tooltip = !Ext.isEmpty(tipText) ? {title: tipTitle, text: tipText} : tipTitle;
		}
		me.callParent(arguments);
	}
	*/
});
