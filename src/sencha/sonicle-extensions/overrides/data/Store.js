/**
 * Override original {@link Ext.data.AbstractStore}
 * - Fix broken loadCount: in ExtJS 7.4 the first value is 2 (EXTJS-27955)
 */
Ext.define('Sonicle.overrides.data.Store', {
	override: 'Ext.data.Store',
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.data.AbstractStore#onCollectionAdd}
	 * - Avoid loadCount increment
	 */
	onCollectionAdd: function(collection, info) {
		//this.loadCount = this.loadCount || 1; <-- this is the line that causes the problem
		this.onCollectionAddItems(collection, info.items, info);
	}
});
