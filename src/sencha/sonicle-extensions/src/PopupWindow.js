/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.PopupWindow', {
	extend: 'Ext.Window',
	alias: ['widget.sopopupwindow'],
	
	layout: 'fit',
	closeAction: 'hide',
	closable: false,
	minimizable: false,
	resizable: true,
	referenceHolder: true,
	
	width: 300,
	height: 300
});
