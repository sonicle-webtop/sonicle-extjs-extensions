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
	 * @cfg {String} [groupField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as group header.
	 * This is suitable for changing the groupField specified in {@link Ext.data.Store#store}.
	 */
	
	/**
	 * @cfg {Function} [getGroup]
	 * A function which returns the group info in the view (eg. useful for computing title dynamically).
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #groupField}.
	 */
	
	/**
	 * @cfg {String} [staticIconCls]
	 * One or more space separated CSS classes to be applied statically to the icon element.
	 * This have precedence over {@link #iconField}.
	 */
	
	/**
	 * @cfg {String} [iconField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as CSS icon class.
	 */
	
	/**
	 * @cfg {Function} [getIcon]
	 * A function which returns the value of icon.
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #iconField}.
	 */
	
	/**
	 * @cfg {String} [colorField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as 
	 * color swatch instead of using an icon.
	 */
	
	/**
	 * @cfg {String} [sourceField]
	 * The underlying {@link Ext.data.Field#name data field name} to bind as source.
	 */
	
	/**
	 * @cfg {Function} [getSource]
	 * A function which returns the value of source.
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #sourceField}.
	 */
	
	/**
	 * @cfg {String} [groupCls]
	 * An additional CSS class (or classes) to be added to group element.
	 */
	
	/**
	 * @cfg {String} [sourceCls]
	 * An additional CSS class (or classes) to be added to source element.
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
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.form.field.Text#preSubTpl}:
	 *  - add swatchEl
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
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.listConfig = me.initListConfig();
	},
	
	initListConfig: function() {
		var me = this,
			defaults = {
				colorize: me.colorize,
				swatchGeometry: me.swatchGeometry,
				iconField: me.iconField,
				getIcon: me.getIcon,
				colorField: me.colorField,
				sourceField: me.sourceField,
				getSource: me.getSource,
				groupCls: me.groupCls,
				sourceCls: me.sourceCls
			};
		
		if (me.store && !Ext.isEmpty(me.store.getGroupField())) {
			Ext.apply(defaults, {
				groupField: me.groupField,
				getGroup: me.getGroup
			});
		}
		return Ext.apply({}, me.listConfig || {}, defaults);
	},
	
	/*
	collapse: function() {
		// Block picker collapsing, only for development!
		console.log('collapse blocked');
	},
	*/
	
	getSubTplData: function(fieldData) {
		var me = this,
			hasIcon = !Ext.isEmpty(me.iconField) || !Ext.isEmpty(me.staticIconCls),
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
	 * Override original {@link Ext.form.field.ComboBox#afterRender}
	 */
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.inputWrap && me.swatchWrap) {
			me.swatchWrap.setHeight(me.inputWrap.getHeight());
		}
		if (!Ext.isEmpty(me.staticIconCls)) me.updateIcon();
		
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
	 * Override original {@link Ext.form.field.Field#onChange}
	 */
	onChange: function(newVal, oldVal) {
		var me = this;
		me.updateIcon(newVal, oldVal);
		me.updateColor(newVal, oldVal);
		me.callParent(arguments);
	},
	
	/**
	 * Override original {@link Ext.form.field.Field#updateEditable}
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
	
	/**
	 * Override original {@link Ext.form.field.ComboBox#createPicker}:
	 *  - customize defaults for boundlist config
	 */
	createPicker: function() {
		var me = this,
			config;
		
		config = Ext.apply(me.defaultListConfig, {
			xtype: 'soboundlist'
		});
		
		me.defaultListConfig = config;
		return me.callParent();
	},
	
	privates: {
		updateColor: function(nv, ov) {
			var me = this,
				SoBL = Sonicle.view.BoundList;
			if ('text' === me.colorize) {
				if (me.inputEl) me.inputEl.applyStyles(SoBL.generateColorStyles('text', me.getColorByValue(nv)));
			} else {
				if (me.swatchEl) me.swatchEl.applyStyles(SoBL.generateColorStyles('swatch', me.getColorByValue(nv)));
			}
		},
		
		updateIcon: function(nv, ov) {
			var me = this, cls;
			if (me.iconEl) {
				if (me.lastIconCls) me.iconEl.removeCls(me.lastIconCls);
				cls = me.staticIconCls || me.getIconClsByValue(nv);
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
