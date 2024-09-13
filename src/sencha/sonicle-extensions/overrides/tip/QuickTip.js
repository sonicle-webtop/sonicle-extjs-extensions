/**
 * Override default {@link Ext.tip.QuickTip}
 * - Support dismissDelay on target el: like 'data-qshowDelay', lookup value from 'data-qdismissdelay' and 'data-qshowdelay' (note lowercase)
 */
Ext.define('Sonicle.overrides.tip.QuickTip', {
	override: 'Ext.tip.QuickTip',
	
	activateTarget: function() {
		var me = this,
			cfg = me.tagConfig,
			ns = cfg.namespace,
			showDelay = parseInt(me.activeTarget.el.getAttribute(ns + 'qshowdelay'), 10),
			dismissDelay = parseInt(me.activeTarget.el.getAttribute(ns + 'qdismissdelay'), 10);
		
		if (Ext.isNumber(showDelay)) me.activeTarget.showDelay = showDelay;
		if (Ext.isNumber(dismissDelay)) me.activeTarget.dismissDelay = dismissDelay;
		me.callParent();
	}
});

