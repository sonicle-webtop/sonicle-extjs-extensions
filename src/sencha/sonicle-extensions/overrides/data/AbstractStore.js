/**
 * Override default Ext.data.AbstractStore
 * - Fix broken getGroupField: after the introduction of multi-grouping (EXTJS-29617)
 *  (see config {@link Ext.data.AbstractStore#groupers}) in ExtJS 7.4 seems 
 *  that the setter (setGroupField) sets data into Grouper, the getter 
 *  (getGroupField - the problematic) gets data from Groupers instead.
 *  Yes Grouper(s) with an `s` at the end!!
 */
Ext.define('Sonicle.overrides.data.AbstractStore', {
	override: 'Ext.data.AbstractStore',
	
	/**
	 * @override getGroupField to restore backward compatibility
	 */
	getGroupField: function() {
		var me = this,
				group = '',
				grouper;
		
		if (me.usesGroupers === true) {
			group = me.callParent(arguments);
		} else {
			grouper = me.getGrouper();
			if (grouper) group = grouper.getProperty();
		}
		return group;
	}
});
