

Ext.define('Sonicle.plugin.TextAreaResizable', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sotextarearesizable',
	uses: [
		'Sonicle.Utils'
	],
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		if (!field.isXType('textarea')) {
			Ext.raise('Bound component MUST be a `textarea`');
			return;
		}
		field.on('afterrender', me.onCmpAfterRender, me);
	},
	
	destroy: function() {
		var me = this,
			cmp = me.getCmp();
		cmp.un('afterrender', me.onCmpAfterRender, me);
	},
	
	privates: {
		onCmpAfterRender: function(s) {
			var container = s.up('container'),
				updateLayout = function() {
					container.updateLayout();
				};
			if (container) this.resiseObserver = new ResizeObserver(updateLayout).observe(s.getEl().dom);
		}
	}
});