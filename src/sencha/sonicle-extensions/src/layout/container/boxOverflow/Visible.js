Ext.define('Sonicle.layout.container.boxOverflow.Visible', {
    extend: 'Ext.layout.container.boxOverflow.None',
    alternateClassName: 'Ext.layout.boxOverflow.Visible',
	
	alias: [
        'box.overflow.visible',
        'box.overflow.Visible' // capitalized for 4.x compat
    ],
	
	visibleOverflowCls: 'so-' + 'box-overflow-visible',
	
	getOverflowCls: function(direction) {
		return this.visibleOverflowCls;
	}
});