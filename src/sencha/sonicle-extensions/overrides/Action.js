/**
 * Override original {@link Ext.Action}
 * - Add getComponents, a getter for all items
 * - Add getter for text and tooltip configs
 * - Add support to bind config
 * - Add support to ui config
 * - Add support to userCls config
 */
Ext.define('Sonicle.overrides.Action', {
	override: 'Ext.Action',
	
	getText: function() {
		return this.initialConfig.text;
	},
	
	getTooltip: function() {
		return this.initialConfig.tooltip;
	},
	
	setBind: function(bind) {
		this.initialConfig.bind = bind;
		this.callEach('setBind', [bind]);
	},
	
	getBind: function() {
        return this.initialConfig.bind;
    },
	
	getUI: function() {
		return this.initialConfig.ui;
	},
	
	setUI: function(ui) {
		this.initialConfig.ui = ui;
		this.callEach('setUI', [ui]);
	},
	
	getUserCls: function() {
		return this.initialConfig.userCls;
	},
	
	setUserCls: function(userCls) {
		this.initialConfig.userCls = userCls;
		this.callEach('setUserCls', [userCls]);
	},
	
	getComponents: function() {
		return this.items;
	}
});