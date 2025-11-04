/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.toolbar.DisplayValue', {
	extend: 'Ext.toolbar.TextItem',
	alias: ['widget.so-tbdisplayvalue', 'widget.tbdisplayvalue'],
	mixins: ['Sonicle.mixin.LabelableToolbarItem'],
	
	/**
	 * @cfg {Boolean} htmlEncode
	 * True to escape HTML in value when rendering it.
	 */
	htmlEncode: false,
	
	value: undefined,
	
	defaultBindProperty: 'value',
	
	setValueLabel: function(label) {
		var me = this;
		me.callParent(arguments);
		me.update(me.buildHtml());
	},
	
	getValue: function() {
		return this.value;
	},
	
	setValue: function(value) {
		var me = this;
		me.value = value;
		me.update(me.buildHtml());
	},
	
	privates: {
		buildHtml: function() {
			var me = this,
				SoS = Sonicle.String,
				value = me.getValue(),
				display = '',
				html = '';
			
			if (!Ext.isEmpty(value)) display = me.htmlEncode ? SoS.htmlEncode(value) : value;
			
			html += me.buildLabelableHtml();
			html += display;
			return html;
		}
	}
});