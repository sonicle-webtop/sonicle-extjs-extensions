/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.Text', {
	extend: 'Ext.form.Label',
	alias: ['widget.sotext'],
	require: [
		'Sonicle.String'
	],
	
	autoEl: {
		tag: 'div'
	},
	
	componentCls: 'x-unselectable',
	
	getElConfig: function() {
		var me = this;
		me.html = me.text ? Ext.util.Format.htmlEncode(Sonicle.String.htmlEncodeLineBreaks(me.text)) : (me.html || '');
		return me.callParent();
	},
	
	/**
	 * Updates the label's innerHTML with the specified string.
	 * @param {String} text The new label text
	 * @param {Boolean} [encode=true] False to skip HTML-encoding the text when rendering it
	 * to the label. This might be useful if you want to include tags in the label's innerHTML rather
	 * than rendering them as string literals per the default logic.
	 * @return {Ext.form.Label} this
	 */
	setText: function(text, encode) {
		var me = this;

		encode = encode !== false;
		if (encode) {
			me.text = text;
			delete me.html;
		} else {
			me.html = text;
			delete me.text;
		}

		if (me.rendered) {
			me.el.dom.innerHTML = encode !== false ? Ext.util.Format.htmlEncode(Sonicle.String.htmlEncodeLineBreaks(text)) : text;
			me.updateLayout();
		}
		return me;
	}
});
