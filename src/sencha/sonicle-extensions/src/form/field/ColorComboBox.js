/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * @deprecated
 * This field has been deprecated by new component {@link Sonicle.form.field.ComboBox}.
 */
Ext.define('Sonicle.form.field.ColorComboBox', {
	extend: 'Ext.form.field.ComboBox',
	alias: ['widget.socolorcombo', 'widget.socolorcombobox'],
	
	/**
	 * @cfg {geometry|text} colorize [colorize=geometry]
	 * Specify the target element on which apply the color.
	 */
	colorize: 'geometry',
	
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
	inputWrapSwatchCls: 'so-'+'colorcombo-swatch-spacer',
	
	preSubTpl: [
		'<tpl if="hasSwatch">',
			'<div id={cmpId}-swatchWrap data-ref="swatchWrap" class="{swatchWrapCls}">',
				'<div id={cmpId}-swatchEl data-ref="swatchEl" class="{swatchCls} {swatchCircleCls}"></div>',
			'</div>',
		'</tpl>',
		// Original tpl (as Ext.form.field.Text) with customized wrap cls added!
		'<div id="{cmpId}-triggerWrap" data-ref="triggerWrap"',
				'<tpl if="ariaEl == \'triggerWrap\'">',
					'<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
				'<tpl else>',
					' role="presentation"',
				'</tpl>',
				' class="{triggerWrapCls} {triggerWrapCls}-{ui}">',
			'<div id={cmpId}-inputWrap data-ref="inputWrap"',
				' role="presentation" class="{inputWrapCls} {inputWrapCls}-{ui} {inputWrapSwatchCls}">'
	],
	childEls: ['swatchWrap', 'swatchEl'],
	
	inheritableStatics: {
		warnDeprecated: function() {
			Ext.log.warn('Sonicle.form.field.ColorComboBox is deprecated. Use Sonicle.form.field.ComboBox instead.');
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
	
	getSubTplData: function(fieldData) {
		var me = this,
				hasSwatch = (me.colorize === 'geometry');
		return Ext.apply(me.callParent(arguments), {
			hasSwatch: hasSwatch,
			inputWrapSwatchCls: hasSwatch ? me.inputWrapSwatchCls : '',
			swatchWrapCls: me.swatchWrapCls,
			swatchCls: me.swatchCls,
			swatchCircleCls: (me.geometry === 'circle') ? (me.swatchCls + '-circle') : ''
		});
	},	
		
	/**
	 * Returns modified inner template.
	 */
	getListItemTpl: function(displayField) {
		var list = this,
			picker = list.pickerField,
			enc = (list.escapeDisplay === true) ? ':htmlEncode' : '',
			colorizeGeometry = (picker.colorize === 'geometry'),
			style = picker.genStyleForListItem(colorizeGeometry, picker.colorField);
		
		if (colorizeGeometry) {
			var lwcls = picker.listSwatchCls,
					lwccls = (picker.geometry === 'circle') ? (lwcls + '-circle') : '';
			return '<div class="' + picker.componentCls + ' x-combo-list-item">'
				+ '<div class="' + lwcls + ' ' + lwccls + '" style="'+style+'"></div>'
				+ '<span>{' + displayField+enc + '}</span>'
				+ '</div>';
		} else {
			return '<span style="'+style+'">{' + displayField+enc + '}</span>';
		}
	},
	
	/**
	 * Override original {@link Ext.form.field.ComboBox#afterRender}
	 */
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.inputWrap && me.swatchWrap) {
			me.swatchWrap.setHeight(me.inputWrap.getHeight());
		}
	},
	
	/**
	 * Override original {@link Ext.form.field.Field#onChange}
	 */
	onChange: function(newVal, oldVal) {
		var me = this;
		me.updateColor(newVal, oldVal);
		me.callParent(arguments);
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
		if (me.swatchEl) {
			if (!editable) {
				me.swatchEl.on('click', me.onTriggerClick, me);
			} else {
				me.swatchEl.un('click', me.onTriggerClick, me);
			}
		}
	},
	
	privates: {
		updateColor: function(nv, ov) {
			var me = this,
					colorizeGeometry = (me.colorize === 'geometry'),
					style = me.getStyleForItem(colorizeGeometry, me.getColorByValue(nv));
			
			if (colorizeGeometry) {
				if (me.swatchEl) me.swatchEl.applyStyles(style);
			} else {
				if (me.inputEl) me.inputEl.applyStyles(style);
			}
		},
		
		getStyleForItem: function(colorizeGeometry, color) {
			if (colorizeGeometry) {
				return Ext.dom.Helper.generateStyles({
					backgroundColor: color,
					border: '1px solid black'
				});
			} else {
				return Ext.dom.Helper.generateStyles({
					color: color
				});
			}
		},
		
		genStyleForListItem: function(colorizeGeometry, colorField) {
			if (colorizeGeometry) {
				return Ext.dom.Helper.generateStyles({
					backgroundColor: '{'+colorField+'}',
					border: '1px solid black'
				});
			} else {
				return Ext.dom.Helper.generateStyles({
					color: '{'+colorField+'}'
				});
			}
		},
		
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
		 * Gets iconClass for specified value.
		 */
		getColorByValue: function(value) {
			var me = this,
					rec = me.findRecordByValue(value);
			return (rec) ? rec.get(me.colorField) : '';
		}
	}
});
