/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.TextArea', {
	extend: 'Ext.form.field.TextArea',
	alias: ['widget.sotextareafield', 'widget.sotextarea'],
	
	scrollToBottom: function() {
		var el = this.inputEl;
		if (el) el.setScrollTop(el.dom.scrollHeight);
	}
});
