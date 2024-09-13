/**
 * Override original {@link Ext.window.Window}
 * - Support before-* events for maximize and restore functions
 */
Ext.define('Sonicle.overrides.window.Window', {
	override: 'Ext.window.Window',
	
	/**
	 * @event beforemaximize
	 * Fires before maximizing the window, usually because the user has clicked the maximize tool.
	 * Return false from any listener to stop the maximize process being completed.
	 * @param {Ext.window.Window} this
	 */
	
	/**
	 * @event beforerestore
	 * Fires before restoring the window, usually because the user has clicked the restore tool.
	 * Return false from any listener to stop the restore process being completed.
	 * @param {Ext.window.Window} this
	 */
	
	maximize: function(animate, initial) {
		var me = this;
		if (!me.maximized && !me.maximizing && !animate && !initial) {
			if (me.fireEvent('beforemaximize', me) !== false) {
				return me.callParent(arguments);
			} else {
				return me;
			}
		} else {
			return me.callParent(arguments);
		}
	},
	
	restore: function(animate) {
		var me = this;
		if (me.maximized && !animate) {
			if (me.fireEvent('beforerestore', me) !== false) {
				return me.callParent(arguments);
			} else {
				return me;
			}
		} else {
			return me.callParent(arguments);
		}
	}
});
