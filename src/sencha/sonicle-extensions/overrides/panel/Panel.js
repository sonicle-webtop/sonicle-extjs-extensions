/**
 * Override original {@link Ext.panel.Panel}
 * - Add defaultUI config according to {@link Ext.panel.Panel#ui} in order to track what default value is
 * - Force no-borders CSS class when bodyBorder is explicitly `false` and frame is NOT `true`
 */
Ext.define('Sonicle.overrides.panel.Panel', {
	override: 'Ext.panel.Panel',
	
	defaultUI: 'default',
	noBorderCls: Ext.baseCSSPrefix + 'noborder-trbl',
	
	initComponent: function() {
		var me = this;
		if (!me.frame && me.bodyBorder === false) {
			me.addBodyCls(me.noBorderCls);
		}
		me.callParent();
	},
	
	setBorder: function(border, targetEl) {
		if (targetEl) return;
		var me = this;
		if (me.rendered && me.bodyBorder === false) {
			me.addBodyCls(me.noBorderCls);
		}
		me.callParent(arguments);
	}
});