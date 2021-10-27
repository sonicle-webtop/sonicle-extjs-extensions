/**
 * Override default Ext.menu.Item
 * - Context menu data management: inject menuData into raw event during item click
 */
Ext.define('Sonicle.overrides.menu.Item', {
	override: 'Ext.menu.Item',
	uses: [
		'Sonicle.Utils'
	],
	
	onClick: function(e) {
		e.menuData = Sonicle.Utils.getContextMenuData();
		return this.callParent([e]);
	}
});
