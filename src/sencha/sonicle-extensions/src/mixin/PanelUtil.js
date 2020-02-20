/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.mixin.PanelUtil', {
	extend: 'Ext.Mixin',
	mixinConfig: {
		id: 'sopanelutil'
	},
	
	/**
	 * Generates an `id` concatenating {@link Ext.Component#getId component's id}
	 * with provided string suffix.
	 * @param {String} suffix The suffix to append.
	 * @returns {String} The generated `id`.
	 */
	sufId: function(suffix) {
		return this.getId() + '-' + suffix;
	},
	
	/**
	 * Convenience method to get the toolbar docked on 'top'.
	 * @returns {Ext.toolbar.Toolbar}
	 */
	getTopBar: function() {
		var ret = this.getDockedItems('toolbar[dock="top"]');
		return (ret && (ret.length > 0)) ? ret[0] : null;
	},
	
	/**
	 * Convenience method to get the toolbar docked on 'bottom'.
	 * @returns {Ext.toolbar.Toolbar}
	 */
	getBottomBar: function() {
		var ret = this.getDockedItems('toolbar[dock="bottom"]');
		return (ret && (ret.length > 0)) ? ret[0] : null;
	},
	
	/**
	 * Convenience method for getting a reference to a container.
	 * @param {Ext.container.Container} cmp The component on which calling {@link Ext.container.Container#lookupReference}
	 * @param {String} path Reference path to follow
	 * @returns {Ext.container.Container}
	 */
	lref: function(cmp, path) {
		if(arguments.length === 1) {
			path = cmp;
			cmp = this;
		}
		var i, keys = path.split('.');
		for(i=0; i<keys.length; i++) {
			cmp = cmp.lookupReference(keys[i]);
			if(!cmp) break;
		}
		return cmp;
	},
	
	/**
	 * Convenience method that returns {@link Ext.app.ViewModel#data viewModel}.
	 * @returns {Ext.app.ViewModel}
	 */
	getVM: function() {
		return this.getViewModel();
	},
	
	/**
	 * Convenience method that returns {@link Ext.app.ViewModel#data viewModel data}.
	 * @returns {Object}
	 */
	getVMData: function() {
		return this.getVM().data;
	}
});
