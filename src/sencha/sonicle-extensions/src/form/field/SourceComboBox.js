/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * @deprecated
 * This field has been deprecated by new component {@link Sonicle.form.field.ComboBox}.
 */
Ext.define('Sonicle.form.field.SourceComboBox', {
	extend: 'Ext.form.field.ComboBox',
	alias: ['widget.sosourcecombo', 'widget.sosourcecombobox'],
	
	/**
	 * @cfg {String} sourceField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as source.
	 */
	sourceField: 'source',
	
	inheritableStatics: {
		warnDeprecated: function() {
			Ext.log.warn('Sonicle.form.field.SourceComboBox is deprecated. Use Sonicle.form.field.ComboBox instead.');
		}
	},
	
	onClassExtended: function() {
		this.warnDeprecated();
	},
	
	constructor: function(cfg) {
		this.self.warnDeprecated();
		this.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		
		me.listConfig = Ext.apply(this.listConfig || {}, {
			getInnerTpl: me.getListItemTpl
		});
		me.callParent(arguments);
	},
	
	/**
	 * @private
	 * Returns modified inner template.
	 */
	getListItemTpl: function(displayField){
		var list = this,
			picker = list.pickerField,
			enc = (list.escapeDisplay === true) ? ':htmlEncode' : '';
		return '<div style="float:left; white-space: pre;">'
			+ '{' + displayField+enc + '}'
			+ '</div>'
			+ '<div style="text-align: right; width:100%">'
			+ '{' + picker.sourceField+enc + '}'
			+ '</div>';
			//this.tpl = '<tpl for="."><div class="x-combo-list-item"><div style="float:left; white-space: pre;">{' + this.displayField + '}</div><div style="text-align: right; width:100%">{' + this.sourceField + '}</div></div></tpl>';
	}
});
