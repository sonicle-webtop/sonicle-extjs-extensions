/**
 * Override original {@link Ext.grid.plugin.RowExpander}
 * - Add support to isRowExpanderHidden to control per-row visibility programmatically
 */
Ext.define('Sonicle.overrides.grid.plugin.RowExpander', {
	override: 'Ext.grid.plugin.RowExpander',
	
	/**
	 * @cfg {Function} isRowExpanderHidden A function which determines whether 
	 * the row-expander is hidden for a particular row item and returns `true` or `false`.
	 * 
	 * The function is passed the following params:
	 * @param {Ext.data.Model} record The Record underlying the row.
	 * @param {Number} rowIndex The row index.
	 * @param {Number} colIndex The column index.
	 * @param {Ext.view.Table} view The owning TableView.
	 * @return {Boolean} `true` or `false` indicating whether the row-expander is hidden
	 */
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link #getHeaderConfig}
	 * - Pass modified renderer under certain circumstances
	 */
	getHeaderConfig: function() {
		var me = this,
			isRowExpanderHidden = me.isRowExpanderHidden,
			ret = me.callParent(arguments);
		
		if (Ext.isFunction(isRowExpanderHidden)) {
			return Ext.apply(ret, {
				renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
					var hide = isRowExpanderHidden ? Ext.callback(isRowExpanderHidden, this, [record, rowIndex, colIndex, store, view]) : false, // <-- added
						cls = Ext.baseCSSPrefix + (record.isNonData || hide === true // <-- added hide condition
							? 'grid-row-non-expander'
							: 'grid-row-expander'),
						expanderElId;
					expanderElId = this.id + '_expanderEl_' + metaData.rowIndex + metaData.columnIndex;
					metaData.tdAttr += ' aria-activedescendant="' + expanderElId + '"';
					
					return '<div class="' + cls + '" id="' + expanderElId +
						'" role="presentation" tabIndex="-1"></div>';
				}
			});
		} else {
			return ret;
		}
	}
});