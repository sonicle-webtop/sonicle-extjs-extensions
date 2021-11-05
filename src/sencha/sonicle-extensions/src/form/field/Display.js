/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.Display', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.so-displayfield'],
	
	/**
	 *  @cfg {String} iconCls
	 *  An additional CSS class (or classes) to be added to the icon's element.
	 */
	iconCls: null,
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Overrides default implementation of {@link Ext.form.field.Display#getDisplayValue}.
	 */
	getDisplayValue: function() {
		var me = this,
			value = me.getRawValue(),
			renderer = me.renderer,
			display;
		
		if (renderer) {
			display = Ext.callback(renderer, me.scope, [value, me], 0, me);
		} else {
			display = Ext.isEmpty(me.iconCls) ? '' : '<i class="' + me.iconCls + '" aria-hidden="true" style="margin-right:5px;"></i>';
			display += (me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value);
		}
		return display;
	}
});
