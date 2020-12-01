/* 
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.ComboBox', {
	extend: 'Ext.form.field.ComboBox',
	alias: ['widget.socombo', 'widget.socombobox'],
	require: ['Sonicle.view.BoundList'],
	
	/**
	 * @cfg {swatch|text} colorize [colorize=swatch]
	 * Specify the target element on which apply the color: the marker itself or display text.
	 */
	colorize: 'swatch',
	
	/**
	 * @cfg {rounded|square|circle} [swatchGeometry=rounded]
	 * Changes the geometry of the swatch that displays the color.
	 */
	swatchGeometry: 'rounded',
	
	/**
	 * @cfg {String} groupField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as group header.
	 * This is suitable for changing the groupField specified in {@link Ext.data.Store#store}.
	 */
	
	/**
	 * @cfg {String} iconField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as CSS icon class.
	 */
	
	/**
	 * @cfg {String} colorField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as 
	 * color swatch instead of using an icon.
	 */
	
	/**
	 * @cfg {String} [sourceField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as source.
	 */
	
	/**
	 * @cfg {String} [sourceCls]
	 * An additional CSS class (or classes) to be added to source element.
	 */
	
	/**
	 * @cfg {Function} [getSource]
	 * A function which returns the value of source.
	 */
	
	componentCls: 'so-'+'combo',
	swatchWrapCls: 'so-'+'combo-swatch-wrap',
	swatchCls: 'so-'+'combo-swatch',
	comboInputSwatchCls: 'so-'+'combo-input-swatch',
	iconCls: 'so-'+'combo-icon',
	
	/*
	preSubTpl: [
        '<div id="{cmpId}-triggerWrap" data-ref="triggerWrap"',
                '<tpl if="ariaEl == \'triggerWrap\'">',
                    '<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
                '<tpl else>',
                    ' role="presentation"',
                '</tpl>',
                ' class="{triggerWrapCls} {triggerWrapCls}-{ui}">',
            '<div id={cmpId}-inputWrap data-ref="inputWrap"',
                ' role="presentation" class="{inputWrapCls} {inputWrapCls}-{ui}">'
    ],
	*/
	
	/**
	 * Override original tpl (as Ext.form.field.Text, see above) to add swatchEl
	 */
	preSubTpl: [
		'<tpl if="hasSwatch">', // <-- Modified adding swatch markup if necessary
			'<div id="{cmpId}-swatchWrap" data-ref="swatchWrap" class="{swatchWrapCls}">',
				'<div id="{cmpId}-swatchEl" data-ref="swatchEl" class="{swatchCls} {geomSwatchCls}"></div>',
			'</div>',
		'</tpl>',
		'<div id="{cmpId}-triggerWrap" data-ref="triggerWrap"',
				'<tpl if="ariaEl == \'triggerWrap\'">',
					'<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
				'<tpl else>',
					' role="presentation"',
				'</tpl>',
				' class="{triggerWrapCls} {triggerWrapCls}-{ui}">',
			'<div id={cmpId}-inputWrap data-ref="inputWrap"',
				' role="presentation" class="{inputWrapCls} {inputWrapCls}-{ui} {comboInputSwatchCls}">',
				'<tpl if="hasIcon">',
					'<i id="{cmpId}-iconEl" data-ref="iconEl" class="{iconCls}"></i>',
				'</tpl>'
	],
	childEls: ['iconEl', 'swatchWrap', 'swatchEl'],
	
	/*
	collapse: function() {
		// Block picker collapsing, only for development!
		console.log('collapse blocked');
	},
	*/
	
	initComponent: function() {
		var me = this;
		me.listConfig = Ext.apply(me.listConfig || {}, {
			xtype: 'soboundlist'
		});
		me.callParent(arguments);
		me.listConfig.colorize = me.colorize;
		me.listConfig.swatchGeometry = me.swatchGeometry;
		if (me.store && me.store.grouper) me.listConfig.groupField = me.groupField;
		me.listConfig.iconField = me.iconField;
		me.listConfig.colorField = me.colorField;
		me.listConfig.sourceCls = me.sourceCls;
		me.listConfig.sourceField = me.sourceField;
		me.listConfig.getSource = me.getSource;
	},
	
	getSubTplData: function(fieldData) {
		var me = this,
				hasIcon = !Ext.isEmpty(me.iconField),
				hasColor = !Ext.isEmpty(me.colorField),
				hasSwatch = !hasIcon && hasColor && (me.colorize === 'swatch');
		
		return Ext.apply(me.callParent(arguments), {
			hasIcon: hasIcon,
			hasSwatch: hasSwatch,
			comboInputSwatchCls: (hasIcon || hasSwatch) ? me.comboInputSwatchCls : '',
			iconCls: me.iconCls,
			swatchWrapCls: me.swatchWrapCls,
			swatchCls: me.swatchCls,
			geomSwatchCls: me.swatchCls + '-' + me.swatchGeometry
		});
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
		
		/*
		elWrap = me.el.down('.x-form-text-wrap');
		elWrap.addCls(me.comboCls);
		
		if (!Ext.isEmpty(me.iconField)) {
			Ext.DomHelper.append(elWrap, {
				tag: 'i', cls: 'so-boundlist-icon'
			});
			me.icon = me.el.down('.so-boundlist-icon');
			if (me.icon && !me.editable) {
				me.icon.on('click', me.onTriggerClick, me);
			}
		}
		*/
	},
	
	/**
	 * Overrides default implementation of {@link Ext.form.field.Field#onChange}.
	 */
	onChange: function(newVal, oldVal) {
		var me = this;
		me.updateIcon(newVal, oldVal);
		me.updateColor(newVal, oldVal);
		me.callParent(arguments);
	},
	
	/**
	 * Overrides default implementation of {@link Ext.form.field.Field#updateEditable}.
	 */
	updateEditable: function(editable, oldEditable) {
		var me = this;
		me.callParent(arguments);
		if (me.iconEl) {
			if (!editable) {
				me.iconEl.on('click', me.onTriggerClick, me);
			} else {
				me.iconEl.un('click', me.onTriggerClick, me);
			}
		}
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
					BL = Sonicle.view.BoundList,
					colorizeSwatch = (me.colorize === 'swatch');
			
			if (colorizeSwatch) {
				if (me.swatchEl) me.swatchEl.applyStyles(BL.generateColorStyles('swatch', me.getColorByValue(nv)));
			} else {
				if (me.inputEl) me.inputEl.applyStyles(BL.generateColorStyles('text', me.getColorByValue(nv)));
			}
		},
		
		updateIcon: function(nv, ov) {
			var me = this, cls;
			if (me.iconEl) {
				if (me.lastIconCls) me.iconEl.removeCls(me.lastIconCls);
				cls = me.getIconClsByValue(nv);
				if (!Ext.isEmpty(cls)) {
					me.lastIconCls = cls;
					me.iconEl.addCls(cls);
				}
			}
		},
		
		getIconClsByValue: function(value) {
			var me = this,
					rec = me.findRecordByValue(value);
			return (rec) ? rec.get(me.iconField) : '';
		},
		
		getColorByValue: function(value) {
			var me = this,
					rec = me.findRecordByValue(value);
			return (rec) ? rec.get(me.colorField) : '';
		}
	}
});
