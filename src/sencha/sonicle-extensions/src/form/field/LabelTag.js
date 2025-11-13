/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.LabelTag', {
	extend: 'Sonicle.form.field.Tag',
	alias: 'widget.solabeltagfield',
	requires: [
		'Sonicle.Utils'
	],
	
	/**
	 * @cfg {hex|cls} [listColorMode]
	 * Controls how to define the icon:
	 *  - hex: {@link colorField} value returns a HEX color string
	 *  - cls: {@link colorField} value returns a CSS class
	 */
	listColorMode: 'hex',
	
	/**
	 * @cfg {String} [listItemIconCls]
	 * The icon CSS Class to apply to each picker's list item by specifying the {@link #getIcon} method.
	 * This is only used if {@link #iconField} and {@link #getIcon} are not specified.
	 */
	listItemIconCls: 'fas fa-tag',
	
	/**
	 * Override original {@link Sonicle.form.field.Tag#initListConfig}:
	 *  - force specific boundlist options
	 */
	initListConfig: function() {
		var me = this;
		return Sonicle.Utils.applyIfDefined(me.callParent() || {}, {
			colorize: 'icon',
			colorMode: me.listColorMode,
			getIcon: (Ext.isString(me.iconField) || Ext.isFunction(me.getIcon)) ? undefined : function() {
				return me.listItemIconCls;
			}
		});
	}
});
