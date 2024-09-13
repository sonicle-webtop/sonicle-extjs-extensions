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
	}
});
