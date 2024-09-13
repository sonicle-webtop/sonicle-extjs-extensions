/**
 * Override original {@link Ext.grid.RowEditorButtons}
 * - Add support to button reversing (show order inverted)
 * - Supports distinct UIs for both button
 */
Ext.define('Sonicle.overrides.grid.RowEditorButtons', {
	override: 'Ext.grid.RowEditorButtons',
	
	/**
	 * @cfg {Boolean} [reverseButtons]
	 * Set to `true` to invert buttons ordering: from `save > cancel` to `cancel > save`.
	 */
	reverseButtons: false,
	
	/**
	 * @cfg {String} [updateButtonUI]
	 * A UI style for a update button.
	 */
	
	/**
	 * @cfg {String} [cancelButtonUI]
	 * A UI style for a cancel button.
	 */
	
	initComponent: function() {
		var me = this,
			cssPrefix = Ext.baseCSSPrefix,
			updateCls = cssPrefix + 'row-editor-update-button',
			cancelCls = cssPrefix + 'row-editor-cancel-button',
			update, cancel;
		
		me.callParent(arguments);
		update = me.getComponent('update');
		cancel = me.getComponent('cancel');
		
		if (!Ext.isEmpty(me.updateButtonUI)) update.setUI(me.updateButtonUI);
		if (!Ext.isEmpty(me.cancelButtonUI)) cancel.setUI(me.cancelButtonUI);
		
		if (me.reverseButtons === true) {
			update.removeCls(updateCls).addCls(cancelCls);
			cancel.removeCls(cancelCls).addCls(updateCls);
			me.moveAfter(update, cancel);
		}
	}
});	