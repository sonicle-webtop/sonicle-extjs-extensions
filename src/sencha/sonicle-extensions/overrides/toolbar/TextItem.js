/**
 * Override original {@link Ext.toolbar.TextItem}
 * - Apply automatic escaping if text config (deprecated since v.5.1.0) is used
 * - Support also escaping in setText
 */
Ext.define('Sonicle.overrides.toolbar.TextItem', {
	override: 'Ext.toolbar.TextItem',
	
	/**
	 * @cfg {String} [text='']
	 * The plain text to display within the item. If you need to include HTML
	 * tags within the item's innerHTML, use the {@link #html} config instead.
	 */
	
	beforeRender: function() {
		var me = this;
		me.callParent();
		me.html = me.text ? Ext.util.Format.htmlEncode(me.text) : (me.html || '');
	},
	
	setText: function(text) {
		this.update(Ext.util.Format.htmlEncode(text));
	}
});