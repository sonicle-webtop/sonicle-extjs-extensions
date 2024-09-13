/**
 * Override original {@link Ext.panel.Table}
 * - Marks component body with no-border class when borders are set to off
 * - Add noItemsBackground config to hide items background
 * - Add support to recoverLostSelection config in order to restore selection 
 *   in similar place if the selected row isn't there anymore
 */
Ext.define('Sonicle.overrides.panel.Table', {
	override: 'Ext.panel.Table',
	
	/**
	 * @cfg {Boolean} hideRowBackground
	 * Hides row item background
	 */
	hideRowBackground: false,
	
	/**
	 * @cfg {Boolean} recoverLostSelection
	 * Set to `true` to restore selection on the previous item 
	 * if the selected one is not available
	 */
	recoverLostSelection: false,
	
	noBorderCls: Ext.baseCSSPrefix + 'grid-no-border',
	noItemsBgCls: Ext.baseCSSPrefix + 'grid-no-items-bg',
	
	initComponent: function() {
		var me = this;
		me.callParent();
		if (me.border === false) {
			me.addCls(me.noBorderCls);
			me.addBodyCls(me.noBorderCls);
		}
		if (me.hideRowBackground) me.addBodyCls(me.noItemsBgCls);
	},
	
	setBorder: function(border, targetEl) {
		var me = this;
		me[border ? 'removeCls' : 'addCls'](me.noBorderCls);
		me[border ? 'removeBodyCls' : 'addBodyCls'](me.noBorderCls);
		me.callParent(arguments);
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link #updateBindSelection}
	 */
	updateBindSelection: function(selModel, selection) {
		var me = this,
			hasSelection = selection.length > 0,
			selectionStartIdx = selModel.selectionStartIdx, // added
			selected = null, // added
			newSelIndex;
		
		me.hasHadSelection = me.hasHadSelection || hasSelection;
		
		if (!me.ignoreNextSelection) {
			me.ignoreNextSelection = true;
			if (hasSelection) {
				selected = selModel.getLastSelected();
			}
			
			// --- Add support to recoverLostSelection
			if (selected === null && me.recoverLostSelection === true && Ext.isNumber(selectionStartIdx)) {
				newSelIndex = selectionStartIdx -1;
				if (newSelIndex >= 0) {
					selected = this.getStore().getAt(newSelIndex);
					if (selected) me.ignoreNextSelection = false;
				}
			}
			// ---
			
			if (me.hasHadSelection) {
				me.setSelection(selected);
			}
			me.ignoreNextSelection = false;
		}
	}
});
