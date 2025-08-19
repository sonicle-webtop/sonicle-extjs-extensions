/**
 * Override original {@link Ext.grid.column.Column}
 * - Add support to headerAlign: allow to set a different align from cell align
 * - Add support to emptyCls application in case of empty values
 */
Ext.define('Sonicle.overrides.grid.column.Column', {
	override: 'Ext.grid.column.Column',
	requires: [
		'Sonicle.Utils'
	],
	
	defaultRenderer: Sonicle.Utils.generateBaseColumnRenderer({useEmptyCls: true, htmlEncode: true}),
	
	/**
	 * @cfg {String} tooltipDataIndex
	 * The name of the field in the grid's {@link Ext.data.Store}'s {@link Ext.data.Model}
	 * definition from which to fill the column's tooltip.
	 */
	
	/**
	 * @cfg {'start'/'center'/'end'} [headerAlign]
	 * Sets the alignment of the header, overwriting value set using {@link Ext.grid.column.Column#align}.
	 */
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		if (!Ext.isEmpty(me.headerAlign)) {
			me.removeCls(Ext.baseCSSPrefix + 'column-header-align-' + me.getMappedAlignment(me.align));
			me.addCls(Ext.baseCSSPrefix + 'column-header-align-' + me.getMappedAlignment(me.headerAlign));
		}
	},
	
	setupRenderer: function(type) {
		var me = this,
			tooltipDataIndex = me.tooltipDataIndex,
			isColumnRenderer, rendererName, renderer;
		
		type = type || 'column';
		isColumnRenderer = type === 'column';
		rendererName = me.rendererNames[type];
		me.callParent(arguments);
		
		if (isColumnRenderer && Ext.isString(tooltipDataIndex)) {
			renderer = me[rendererName];
			if (Ext.isFunction(renderer)) {
				me[rendererName] = Ext.Function.wrap(renderer, function(origResult, value, meta, rec) {
					var ttip;
					if (Ext.isString(tooltipDataIndex)) ttip = rec.get(tooltipDataIndex);
					if (Ext.isString(origResult) && ttip) {
						return '<span ' + Sonicle.Utils.generateTooltipAttrs(ttip) + '>' + origResult + '</span>';
					} else {
						return origResult;
					}
				});
			}
		}
	}
});
