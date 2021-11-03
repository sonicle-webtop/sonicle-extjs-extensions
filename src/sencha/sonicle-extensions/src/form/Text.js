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
	
	/**
	 * @cfg {info|warn|error} iconType
	 * An optional icon do display before text.
	 */
	iconType: null,
	
	/**
	 *  @cfg {String} iconExtraCls
	 *  An additional CSS class (or classes) to be added to the icon's element.
	 */
	iconExtraCls: null,
	
	// Make component unselectable and force a minimal height
	componentCls: 'x-unselectable x-form-item-body-default',
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Overrides default implementation of {@link Ext.form.Label#getElConfig}.
	 * This allows prepending htmlEncodeLineBreaks call.
	 */
	getElConfig: function() {
		var me = this;
		me.html = me.text ? Ext.util.Format.htmlEncode(Sonicle.String.htmlEncodeLineBreaks(me.text)) : (me.html || '');
		me.html = me.genIconMarkup(me.iconType, me.iconExtraCls) + me.html; // Add support to icons
		return Ext.apply(Sonicle.form.Text.superclass.superclass.getElConfig.apply(me, arguments), {
			htmlFor: me.forId || ''
		});
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Overrides default implementation of {@link Ext.form.Label#setText}.
	 * This allows prepending htmlEncodeLineBreaks call.
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
			me.el.dom.innerHTML = me.genIconMarkup(me.iconType, me.iconExtraCls) + me.el.dom.innerHTML; // Add support to icons
			me.updateLayout();
		}
		return me;
	},
	
	privates: {
		genIconMarkup: function(type, extraCls) {
			var cls;
			if ('info' === type) {
				cls = 'fa fa-info-circle';
			} else if ('warn' === type) {
				cls = 'fa fa-exclamation-triangle';
			} else if ('error' === type) {
				cls = 'fa fa-times-circle';
			}
			return cls ? '<i class="' + cls + ' ' + Sonicle.String.deflt(extraCls, '') + '" aria-hidden="true"></i>&nbsp;' : '';
		}
	}
});
