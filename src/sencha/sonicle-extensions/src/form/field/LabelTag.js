/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.LabelTag', {
	extend: 'Sonicle.form.field.Tag',
	alias: 'widget.solabeltagfield',
	
	listItemIconCls: 'fas fa-tag',
	
	/**
	 * Override original {@link Sonicle.form.field.Tag#initListConfig}:
	 *  - force specific boundlist options
	 */
	initListConfig: function() {
		var me = this;
		return Ext.apply(me.callParent() || {}, {
			colorize: 'icon',
			getIcon: function() {
				return me.listItemIconCls;
			}
		});
	}
});
