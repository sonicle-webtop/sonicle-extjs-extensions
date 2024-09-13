/**
 * Override original {@link Ext.toolbar.Toolbar}
 * - Set modified defaultUI in components
 */
Ext.define('Sonicle.overrides.toolbar.Toolbar', {
	override: 'Ext.toolbar.Toolbar',
	
	onBeforeAdd: function(component) {
		var me = this,
			isFooter = me.ui === 'footer',
			defaultButtonUI = isFooter ? me.defaultFooterButtonUI : me.defaultButtonUI;
		
		if (!component.isSegmentedButton && component.isButton) {
			component.defaultUI = defaultButtonUI;
		}
		me.callParent(arguments);
	}
});