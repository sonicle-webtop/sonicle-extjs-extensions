/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.menu.Header', {
	extend: 'Ext.menu.Item',
	alias: 'widget.somenuheader',
	
	/**
	 * @cfg {String} text
	 * The text/html to display in this item.
	 */
	
	plain: true,
	disabled: true,
	cls: 'so-'+'menu-header'
});
