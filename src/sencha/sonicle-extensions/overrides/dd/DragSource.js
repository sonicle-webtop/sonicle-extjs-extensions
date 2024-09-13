/**
 * Override original {@link Ext.dd.DragSource}
 * - Ignore repairHighlightColor when undefined or falsy
 */
Ext.define('Sonicle.overrides.dd.DragSource', {
	override: 'Ext.dd.DragSource',
	
	afterRepair: function() {
		var me = this,
			color = me.repairHighlightColor;
		
		if (Ext.enableFx && color) {
			me.el.highlight(color);
		}
		me.dragging = false;
	}
});

