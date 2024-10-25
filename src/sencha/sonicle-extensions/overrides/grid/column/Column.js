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
	 * @cfg {boolean} [cellTooltip]
	 * Set to 'true' to display a cell tooltip using the value referenced by specified {@link #dataIndex}.
	 */
	cellTooltip: false,
	
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
			isColumnRenderer, rendererName, renderer;
		
		type = type || 'column';
		isColumnRenderer = type === 'column';
		rendererName = me.rendererNames[type];
		me.callParent(arguments);
		
		if (isColumnRenderer && me.cellTooltip === true) {
			renderer = me[rendererName];
			if (Ext.isFunction(renderer)) {
				me[rendererName] = Ext.Function.wrap(renderer, function(origResult, value) {
					if (Ext.isString(origResult) && value) {
						return '<span ' + Sonicle.Utils.generateTooltipAttrs(value) + '>' + origResult + '</span>';
					} else {
						return origResult;
					}
				});
			}
		}
	}
});
