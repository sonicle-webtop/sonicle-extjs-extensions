/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.TextArea', {
	extend: 'Ext.form.field.TextArea',
	alias: ['widget.sotmcetextarea'],
	mixins: {
		tinymce: 'Sonicle.form.field.tinymce.Mixin'
	},
	
	/**
	 * @event editorready
	 * Fired after the TinyMCE instance is initialized.
	 * @param {Sonicle.form.field.tinymce.TextArea} this This component.
	 * @param {Object} The TinyMCE instance.
	 */
	
	/**
	 * @event editorchange
	 * Fired after the TinyMCE editor's value changes.
	 * @param {Sonicle.form.field.tinymce.TextArea} this This component.
	 * @param {String} The value.
	 */
	
	componentCls: 'so-'+'tmcetextarea',
	
	onDestroy: function() {
		var me = this;
		me.setEditor(null);
		me.callParent();
	},
	
	getEditorDomElement: function() {
		return this.inputEl ? this.inputEl.dom : undefined;
	},
	
	setValue: function(value) {
		this.mixins.tinymce.updateValue.call(this, value);
		return this.callParent([value]);
	},

	updateDisabled: function(disabled) {
		this.mixins.tinymce.updateDisabled.call(this, disabled);
	},
	
	createDefaultEditorConfig: function() {
		return this.mixins.tinymce.createDefaultEditorConfig.call(this);
	},
	
	focus: function(selectText, delay) {
		var me = this, ed;
		if (delay) {
			me.getFocusTask().delay(Ext.isNumber(delay) ? delay : 10, me.focus, me, [selectText, false]);
			
		} else {
			ed = me.getEditor();
			if (ed && ed.isReady) {
				ed.focus();
				ed.selection.setCursorLocation(); // Cursor at first avail node of body
			}
		}
		return me;
	}
});
