/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.Display', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.so-displayfield'],
	uses: [
		'Sonicle.ColorUtils',
		'Sonicle.view.BoundList'
	],
	
	/**
	 * @cfg {Boolean} enableClickEvents
	 * Set to `true` to enable the proxying of click events for the HTML field
	 */
	enableClickEvents: false,
	
	/**
	 * @cfg {String} clickEvent
	 * The DOM event that will fire the handler of the button. This can be any valid event name (dblclick, contextmenu).
	 */
	clickEvent: 'click',
	
	/**
	 * @cfg {Boolean} preventDefault
	 * Is set to `true` to prevent the default action when the {@link #clickEvent} is processed.
	 */
	preventDefault: true,
	
	/**
	 *  @cfg {String/Object} tooltip
	 *  The tooltip for the button - can be a string or QuickTips config object.
	 */
	
	/**
	 *  @cfg {String} iconCls
	 *  An additional CSS class (or classes) to be added to the icon's element.
	 */
	iconCls: null,
	
	/**
	 * @cfg {none|swatch|text} colorize [colorize=none]
	 * Specify the target element on which apply the color: the marker itself or display text.
	 */
	colorize: 'none',
	
	/**
	 * @cfg {rounded|square|circle} [swatchGeometry=rounded]
	 * Changes the geometry of the swatch that displays the color.
	 */
	swatchGeometry: 'rounded',
	
	/**
	 * @cfg {Function/String} handler
	 * A function called when the button is clicked (can be used instead of click event).
	 * @param {Ext.form.field.Display} field This field.
	 * @param {Ext.event.Event} e The click event.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope (**this** reference) in which the `{@link #handler}` is executed. Defaults to this Field.
	 */
	
	/**
     * @event click
     * Fires when this button is clicked, before the configured {@link #handler} is invoked.
     * Execution of the {@link #handler} may be vetoed by returning `false` to this event.
     * @param {Ext.button.Button} this 
     * @param {Event} e The click event
     */
	
	htmlEncode: true, // Force HTML encoding by default!
	
	clickableCls: 'so-' + 'displayfield-clickable',
	displayIconCls: 'so-' + 'displayfield-icon',
	swatchCls: 'so-'+'displayfield-swatch',
	inputSwatchCls: 'so-'+'displayfield-input-swatch',
	swatchGeometryBaseCls: 'so-'+'colorswatch',
	
	preSubTpl: [
		'<tpl if="hasSwatch">',
			'<div id="{cmpId}-swatchEl" data-ref="swatchEl" class="{swatchCls} {geomSwatchCls}"></div>',
		'</tpl>'
	],
	childEls: ['swatchEl'],
	
	constructor: function(cfg) {
		var me = this,
			icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, ['colorize']);
		if (Ext.isBoolean(icfg.colorize)) {
			cfg.colorize = (icfg.colorize === true) ? 'swatch' : 'off';
		}
		me.callParent([cfg]);
	},
	
	getSubTplData: function(fieldData) {
		var me = this,
			hasSwatch = (me.colorize === 'swatch');
		
		return Ext.apply(me.callParent(arguments), {
			hasSwatch: hasSwatch,
			swatchCls: me.swatchCls,
			geomSwatchCls: me.swatchGeometryBaseCls + '-' + me.swatchGeometry
		});
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.form.field.Display#getDisplayValue}
	 */
	getDisplayValue: function() {
		var me = this,
			value = me.getRawValue(),
			tooltip = me.tooltip,
			renderer = me.renderer,
			display = '';
		
		if (!Ext.isEmpty(tooltip)) display += '<span ' + Sonicle.Utils.generateTooltipAttrs(tooltip) + '>';
		if (!Ext.isEmpty(me.iconCls)) display += '<i class="' + me.displayIconCls + ' ' + me.iconCls + '" aria-hidden="true"></i>';
		if (renderer) {
			display += Ext.callback(renderer, me.scope, [value, me], 0, me);
		} else {
			display += (me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value);
		}
		if (!Ext.isEmpty(tooltip)) display += '</span>';
		return display;
	},
	
	getIconCls: function() {
		return this.iconCls;
	},
	
	setIconCls: function(iconCls) {
		var me = this;
		me.iconCls = iconCls;
		if (me.rendered) {
			me.inputEl.dom.innerHTML = me.getDisplayValue();
			me.updateLayout();
		}
	},
	
	getColor: function() {
		return this.color;
	},
	
	setColor: function(color) {
		var me = this;
		me.color = color;
		if (me.rendered) {
			me.updateColor(color);
		}
	},
	
	initEvents: function() {
		var me = this;
		me.callParent(arguments);
		if (me.inputEl && me.enableClickEvents === true) {
			me.mon(me.inputEl, me.clickEvent, me.onClick, me);
		}
	},
	
	onRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.colorize === 'swatch') me.inputEl.addCls(me.inputSwatchCls);
		if (me.enableClickEvents === true) me.inputEl.addCls(me.clickableCls);
	},
	
	/**
	 * Assigns this Button's click handler
	 * @param {Function} handler The function to call when the value is clicked
	 * @param {Object} [scope] The scope (`this` reference) in which the handler function is executed. Defaults to this Field.
	 * @return {Ext.form.field.Display} this
	 */
	setHandler: function(handler, scope) {
		var me = this;
		me.handler = handler;
		if (arguments.length > 1) {
			me.scope = scope;
		}
		return me;
	},
	
	privates: {
		updateColor: function(color) {
			var me = this,
				swatch = Sonicle.ColorUtils.generateColorSwatch(me.colorize, color);
			
			if (me.swatchEl) {
				if (swatch.swatchStyle) me.swatchEl.applyStyles(swatch.swatchStyle);
				me.swatchEl.removeCls(swatch.framedCls); // Make sure to remove any frame CSS class
				if (swatch.swatchCls) me.swatchEl.addCls(swatch.swatchCls);
			}
			if (me.inputEl) {
				if (swatch.inputStyle) me.inputEl.applyStyles(swatch.inputStyle);
			}
		},
		
		onClick: function(e) {
			var me = this;
			if (e && me.preventDefault) e.preventDefault();
			me.fireHandler(e);
		},
		
		fireHandler: function(e) {
			var me = this;
			// Click may have destroyed the button
			if (me.fireEvent('click', me, e) !== false && !me.destroyed) {
				Ext.callback(me.handler, me.scope, [me, e], 0, me);
			}
		}
	}
});
