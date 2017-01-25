/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.ColorComboBox', {
	extend: 'Ext.form.field.ComboBox',
	alias: ['widget.socolorcombo', 'widget.socolorcombobox'],
	
	/**
	 * @cfg {square|circle} geometry [geometry=square]
	 * Changes the geometry of the marker that displays the color.
	 */
	geometry: 'square',
	
	/**
	 * @cfg {String} colorField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as color.
	 */
	colorField: 'color',
	
	componentCls: 'so-'+'colorcombo',
	swatchWrapCls: 'so-'+'colorcombo-swatch-wrap',
	swatchCls: 'so-'+'colorcombo-swatch',
	listSwatchCls: 'so-'+'colorcombo-list-swatch',
	
	preSubTpl: [
		'<div id={cmpId}-swatchWrap data-ref="swatchWrap" class="{swatchWrapCls}">',
			'<div id={cmpId}-swatchEl data-ref="swatchEl" class="{swatchCls} {swatchCircleCls}"></div>',
		'</div>',
		'<div id="{cmpId}-triggerWrap" data-ref="triggerWrap" class="{triggerWrapCls} {triggerWrapCls}-{ui}">', // Original (as Ext.form.field.Text)
			'<div id={cmpId}-inputWrap data-ref="inputWrap" class="{inputWrapCls} {inputWrapCls}-{ui}">' // Original (as Ext.form.field.Text)
	],
	
	childEls: ['swatchWrap', 'swatchEl'],
	
	initComponent: function() {
		var me = this;
		
		me.listConfig = Ext.apply(this.listConfig || {}, {
			getInnerTpl: me.getListItemTpl
		});
		me.callParent(arguments);
	},
	
	getSubTplData: function(fieldData) {
		var me = this;
		return Ext.apply(me.callParent(arguments), {
			swatchWrapCls: me.swatchWrapCls,
			swatchCls: me.swatchCls,
			swatchCircleCls: (me.geometry === 'circle') ? (me.swatchCls + '-circle') : ''
		});
	},
	
	/**
	 * @private
	 * Returns modified inner template.
	 */
	getListItemTpl: function(displayField){
		var picker = this.pickerField,
				ccls = picker.componentCls,
				lwcls = picker.listSwatchCls,
				lwccls = (picker.geometry === 'circle') ? (lwcls + '-circle') : '',
				style = Ext.dom.Helper.generateStyles({
					backgroundColor: '{'+picker.colorField+'}',
					border: '1px solid black'
				});
		
		return '<div class="' + ccls + ' x-combo-list-item">'
			+ '<div class="' + lwcls + ' ' + lwccls + '" style="'+style+'"></div>'
			+ '<span>{'+displayField+'}</span>'
			+ '</div>'
		;
	},
	
	/**
	 * Overrides default implementation of {@link Ext.form.field.ComboBox#afterRender}.
	 */
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.inputWrap && me.swatchWrap) {
			me.swatchWrap.setHeight(me.inputWrap.getHeight());
		}
	},
	
	/**
	 * Overrides default implementation of {@link Ext.form.field.Field#onChange}.
	 */
	onChange: function(newVal, oldVal) {
		var me = this;
		me.updateSwatch(newVal, oldVal);
		me.callParent(arguments);
	},
	
	/**
	 * @private
	 */
	generateSwatchStyle: function(color) {
		if (Ext.isEmpty(color)) {
			return '';
		} else {
			return Ext.dom.Helper.generateStyles({
				backgroundColor: color,
				border: '1px solid black'
			});
		}
	},
	
	/**
	 * @private
	 * Gets iconClass for specified value.
	 */
	getColorByValue: function(value) {
		var me = this,
				rec = me.findRecordByValue(value);
		return (rec) ? rec.get(me.colorField) : '';
	},
	
	/**
	 * @private
	 * Replaces old swatch with the new one.
	 */
	updateSwatch: function(nv, ov) {
		var me = this, color;
		if(me.swatchEl) {
			color = me.getColorByValue(nv);
			me.swatchEl.applyStyles(me.generateSwatchStyle(color));
		}
	},
	
	onBindStore: function(store, initial){
		var me = this;
		me.callParent(arguments);
		if(store && store.autoCreated) {
			me.colorField = !store.expanded ? 'field3' : 'field2';
		}
	},
	
	updateEditable: function(editable, oldEditable) {
		var me = this;
		me.callParent(arguments);
		if(me.swatchEl) {
			if(!editable) {
				me.swatchEl.on('click', me.onTriggerClick, me);
			} else {
				me.swatchEl.un('click', me.onTriggerClick, me);
			}
		}
	}
});
