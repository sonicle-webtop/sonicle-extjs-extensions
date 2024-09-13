/**
 * Override original {@link Ext.view.Table}
 * - Add support to x-grid-row-with-rowbody CSS class on row when RowBody feature is used
 */
Ext.define('Sonicle.overrides.view.Table', {
	override: 'Ext.view.Table',
	
	initComponent: function() {
		var me = this;
		if (Ext.isArray(me.rowTpl) && me.hasRowBodyFeature()) {
			me.rowTpl.splice(2, 0, 'dataRowCls += " ' + Ext.baseCSSPrefix + 'grid-row-with-rowbody";');
		}
		me.callParent(arguments);
	},
	
	privates: {
		hasRowBodyFeature: function() {
			var me = this,
				features = me.features, i, len, ftype;
			if (features) {
				for (i = 0, len = features.length; i < len; i++) {
					if (Ext.isString(features[i])) {
						if ('rowbody' === features[i]) return true;
					} else if (!features[i].isFeature) {
						if ('rowbody' === features[i].ftype) return true;
					} else if (features[i].isFeature) {
						if (me.isInstanceOfClass('Ext.grid.feature.RowBody')) return true;
					}
				}
			}
			return false;
		}
	}
});
