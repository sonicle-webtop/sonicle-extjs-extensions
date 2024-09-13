/**
 * Override original {@link Ext.event.Event}
 * - Context menu data management: returns injected menuData
 */
Ext.define('Sonicle.overrides.event.Event', {
	override: 'Ext.event.Event',
	uses: [
		'Sonicle.Object'
	],
	
	/**
	 * Gets menuData object or a single property value if property name is specified.
	 * @param {Ext.event.Event} evt The raw event object from which extract menuData.
	 * @param {String} [prop] Property name whose value will be extracted.
	 * @returns {Object|Mixed} The whole menuData object or single property value if necessary.
	 */
	getContextMenuData: function(prop) {
		var me = this;
		return me.menuData ? (Ext.isString(prop) ? Sonicle.Object.getValue(me.menuData, prop) : me.menuData) : undefined;
	}
});