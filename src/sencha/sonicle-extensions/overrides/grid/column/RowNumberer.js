/**
 * Override original {@link Ext.grid.column.RowNumberer}
 * - Add autoSize feature: when numbers has two or more digits, column's default
 *   size is not enough to accomodate the whole number, so text is truncated.
 */
Ext.define('Sonicle.overrides.grid.column.RowNumberer', {
	override: 'Ext.grid.column.RowNumberer',
	
	autoSize: true,
	
	/**
	 * @override Check me during ExtJs upgrade!
	 */
	renumberRows: function() {
		if (this.destroying || this.destroyed) {
			return;
		}
		
		var me = this,
			view = me.getView(),
			dataSource = view.dataSource,
			recCount = dataSource.getCount(),
			context = new Ext.grid.CellContext(view).setColumn(me),
			rows = me.getView().all,
			index = rows.startIndex;

		while (index <= rows.endIndex && index < recCount) {
			context.setRow(index);
			me.updater(context.getCell(true), ++index, null, view, dataSource);
		}
		
		// New auto-size code starts here !!
		// We cannot call callParent because otherwise contex.getCell will return false.
		if (me.autoSize === true) {
			var cellEl = context.getCell(),
				innerEl, minWidth;
			if (cellEl) {
				innerEl = cellEl.getFirstChild();
				minWidth = innerEl.getTextWidth() + innerEl.getPadding('lr') + cellEl.getBorderWidth('lr');
				if (me.getWidth() < minWidth) me.setWidth(minWidth);
			}
		}
	}
});
