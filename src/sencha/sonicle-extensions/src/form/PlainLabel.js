/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.PlainLabel', {
	extend: 'Ext.Component',
	alias: ['widget.soplainlabel'],
	require: [
		'Sonicle.String'
	],
	
	/**
	 * @cfg {String} [text='']
	 * The plain text to display within the label. If you need to include HTML
	 * tags within the label's innerHTML, use the {@link #html} config instead.
	 */
	
	/**
	 * @cfg {String} [html='']
	 * An HTML fragment that will be used as the label's innerHTML.
	 * Note that if {@link #text} is specified it will take precedence and this value will be ignored.
	 */
	
	getElConfig: function() {
		var me = this;
		me.html = me.text ? Ext.util.Format.htmlEncode(Sonicle.String.htmlEncodeLineBreaks(me.text)) : (me.html || '');
		return me.callParent();
	}
});
