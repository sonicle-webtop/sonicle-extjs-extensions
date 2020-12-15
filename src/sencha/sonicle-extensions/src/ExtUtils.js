/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.ExtUtils', {
    singleton: true,
	requires: [
		'Sonicle.Utils'
	],
	
	/**
	 * @deprecated Use {@link Sonicle.Utils#scrollable} instead
	 * Merges some other triggers into initial configuration.
	 * @param {Object} cfg The config passed to class constructor.
	 * @param {Object} triggers Triggers config objects to add. The values in this object
	 * are {@link Ext.form.trigger.Trigger Trigger} configuration objects.
	 * @returns {cfg.triggers} Object to use as {@link Ext.form.field.Text#triggers}.
	 */
	mergeTriggers: function(cfg, triggers) {
		return Sonicle.Utils.mergeTriggers(cfg.triggers, triggers);
	},
	
	/**
	 * @deprecated Use {@link Sonicle.Utils#mergePlugins} instead
	 * Merges some other plugins into initial configuration.
	 * @param {Object} cfg The config passed to class constructor.
	 * @param {Ext.plugin.Abstract[]/Ext.plugin.Abstract/Object[]/Object/Ext.enums.Plugin[]/Ext.enums.Plugin} plugins An array of plugins.
	 * @returns {Array} Result plugin array
	 */
	mergePlugins: function(cfg, plugins) {
		return Sonicle.Utils.mergePlugins(cfg.plugins || [], plugins);
	}
});
