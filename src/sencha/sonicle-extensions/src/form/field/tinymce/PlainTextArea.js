/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.PlainTextArea', {
	extend: 'Ext.form.field.TextArea',
	alias: ['widget.sotmceplaintextarea'],
	requires: [
		'Sonicle.Utils'
	],
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.pendingResetCaret === true) {
			delete me.pendingResetCaret;
			me.setCaretPosition(0);
		}
	},
	
	/**
	 * Moves the caret to initial position (0).
	 * If component is not rendered yet, a pendin flag will be inserted and
	 * evaluated on afterRender.
	 */
	resetCaretPosition: function() {
		var me = this;
		if (me.rendered) {
			me.setCaretPosition(0);
		} else {
			me.pendingResetCaret = true;
		}
	},
	
	selectText: function(start, end) {
		var me = this,
				el = me.inputEl.dom;
		me.callParent(arguments);
		if (end === 0) {
			el.scrollTo(0, 0);
		}
	},
	
	/**
	 * Inserts a text at specified position
	 * @param {String} text Text to be inserted.
	 * @param {above|below|caret} location Specify where to insert text: before 
	 * initial content, after initial content or at caret position, if valid, before otherwise.
	 * @returns {String} The resulting value.
	 */
	insertText: function(text, location) {
		var me = this,
				val = me.getValue();
		if ('above' === location || !me.inputEl) {
			val = (text || '') + (val || '');
		} else if ('below' === location) {
			val = (val || '') + (text || '');
		} else if ('caret' === location) {
			val = Ext.String.insert(val, text, Math.max(0, me.getCaretPosition()));
		}
		me.setValue(val);
		return val;
	}
});
