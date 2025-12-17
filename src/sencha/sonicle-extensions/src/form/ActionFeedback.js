/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.ActionFeedback', {
	extend: 'Ext.form.FieldContainer',
	alias: 'widget.soformactionfeedback',
	requires: [
		'Sonicle.String'
	],
	
	/**
	 * We wouldn't use Ext.form.FieldContainer as parent here, 
	 * label management is completely unuseful but any attempt to extend 
	 * from Ext.container.Container and replicate some of FieldContainer 
	 * behaviour has failed.
	 * So, disable label for now!
	 */
	hideLabel: true,
	hideEmptyLabel: true,
	
	config: {
		/**
		 * @cfg {Boolean} [accent=true]
		 * Specifies whether to show a colored accent on component side.
		 */
		accent: true,
		
		/**
		 * @cfg {info|alert|warning|success} [type=info]
		 * The feedback type.
		 */
		type: 'info',
		
		/**
		 * @cfg {String} text
		 * The feedback text to display.
		 */
		text: ''
	},
	
	/**
	 * @cfg {Object[]} buttons
	 * Convenience config used for adding buttons next to the message.
	 */
	buttons: null,
	
	componentCls: 'so-' + 'formactionfeedback',
	
	initComponent: function() {
		var me = this,
			items;
		
		me.layout = {
			type: 'hbox',
			align: 'middle'
		};
		
		items = [
			{
				xtype: 'label',
				itemId: 'lbltext',
				text: me.text,
				cls: me.componentCls + '-text',
				margin: '0 5 0 0'
			}
		];
		if (Ext.isArray(me.buttons)) {
			Ext.iterate(me.buttons, function(button) {
				if (Ext.isObject(button)) {
					if (button.isButton) {
						button.addCls(me.componentCls + '-button');
					} else {
						button.cls = Sonicle.String.join(' ', button.cls, me.componentCls + '-button');
					}
				}
			});
			items = Ext.Array.join(items, me.buttons);
			delete me.buttons;
		}
		me.items = items;
		me.callParent();
	},
	
	updateAccent: function(nv, ov) {
		this[nv === true ? 'addCls' : 'removeCls'](this.componentCls + '-accent');
	},
	
	applyType: function(type) {
		return Sonicle.String.isIn(type, ['info', 'alert', 'warning', 'success']) ? type : 'info';
	},
	
	updateType: function(nv, ov) {
		var me = this;
		if (Ext.isString(ov)) me.removeCls(me.componentCls + '-' + ov);
		if (Ext.isString(nv)) me.addCls(me.componentCls + '-' + nv);
	},
	
	updateText: function(nv, ov) {
		if (!this.isConfiguring) {
			var label = this.getComponent('lbltext');
			if (label) label.setText(nv);
		}
	}
});
