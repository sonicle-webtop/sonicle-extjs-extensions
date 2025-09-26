/**
 * Override original {@link Ext.button.Button}
 * - Add defaultUI config according to {@link Ext.button.Button#ui} in order to track what default value is
 * - Append custom ui-derived CSS class (eg. x-btn-ui-*myui*) that does NOT use scale value inside its name
 * - Add support to toggle-indicator
 */
Ext.define('Sonicle.overrides.button.Button', {
	override: 'Ext.button.Button',
	requires: [
		'Sonicle.Utils'
	],
	
	defaultUI: 'default',
	
	/**
	 * @cfg {Boolean} enableToggleIndicator
	 * True to enable pressed/not pressed toggling status indicator.
	 */
	enableToggleIndicator: false,
	
	iconTpl_0: 
		'<tpl if="useToggleIndicator">' +
		'<span id="{id}-btnToggleIndicatorEl" data-ref="btnToggleIndicatorEl" role="presentation" unselectable="on" class="{baseToggleIndicatorCls} ' +
				'{baseToggleIndicatorCls}-{ui}">' +
		'</span>' +
		'</tpl>',
	
	childEls: [
		'btnEl', 'btnWrap', 'btnInnerEl', 'btnToggleIndicatorEl', 'btnIconEl', 'arrowEl', 'tooltipEl'
	],
	
	_baseToggleIndicatorCls: Ext.baseCSSPrefix + 'btn-toggle-indicator-el',
	
	constructor: function(cfg) {
		var me = this,
			icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, ['disablePressedStyle']);
		
		if (icfg.disablePressedStyle === true) cfg.hidePressedStyle = true;
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		if (me.hidePressedStyle) me.addCls(me._pressedCls + '-nostyle');
	},
	
	getTemplateArgs: function() {
		var me = this,
			toggleIndicatorCls = me._baseToggleIndicatorCls;
		
		return Ext.apply(me.callParent(arguments), {
			useToggleIndicator: !!me.enableToggle && !!me.enableToggleIndicator,
			baseToggleIndicatorCls: toggleIndicatorCls
		});
	},
	
	onRender: function() {
		var me = this;
		me.callParent(arguments);
		
		if (me.el) me.el.addCls(me.baseCls + '-ui-' + me.saniziteUI(me.ui));
	},
	
	setUI: function(ui) {
		var me = this;
		
		if (me.el) me.el.removeCls(me.baseCls + '-ui-' + me.saniziteUI(me.ui));
		me.callParent(arguments);
		if (me.el) me.el.addCls(me.baseCls + '-ui-' + me.saniziteUI(me.ui));
	},
	
	privates: {
		
		/**
		 * Strips from passed UI value any scale suffix (according to allowed set).
		 * @param {String} ui
		 * @returns {String}
		 */
		saniziteUI: function(ui) {
			if (Ext.isString(ui)) {
				Ext.iterate(this.allowedScales, function(scale) {
					ui = ui.replace('-' + scale, '');
				});
			}
			return ui;
		}
	}
}, function() {
	var proto = Ext.button.Button.prototype;
	proto.iconTpl = this.prototype.iconTpl_0 + proto.iconTpl;
});
