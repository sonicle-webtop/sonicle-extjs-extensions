/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.TextAreaPlain', {
	extend: 'Ext.form.field.TextArea',
	alias: ['widget.sotmceplaintextarea'],
	
	selectText: function(start, end) {
		var me = this,
				el = me.inputEl.dom;
		me.callParent(arguments);
		if (end === 0) {
			el.scrollTo(0, 0);
		}
	}
});
