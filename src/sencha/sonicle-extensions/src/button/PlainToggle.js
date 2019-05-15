/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.button.PlainToggle', {
	extend: 'Sonicle.button.Toggle',
	alias: ['widget.soplaintogglebutton'],
	
	cls: 'so-plaintoggle-button',
	
	constructor: function(cfg) {
		this.callParent([Ext.apply(cfg || {}, {
				focusable: false,
				_focusCls: '',
				_pressedCls: ''
		})]);
	}
});
