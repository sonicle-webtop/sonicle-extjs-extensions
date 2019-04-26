/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.ExtUtils', {
    singleton: true,
	
	/**
	 * Merges some other triggers into initial configuration.
	 * @param {Object} cfg The config passed to class constructor.
	 * @param {Object} triggers Triggers config objects to add. The values in this object
	 * are {@link Ext.form.trigger.Trigger Trigger} configuration objects.
	 * @returns {cfg.triggers} Object to use as {@link Ext.form.field.Text#triggers}.
	 */
	mergeTriggers: function(cfg, triggers) {
		var cobj = cfg.triggers;
		if (Ext.isArray(triggers)) {
			Ext.warn('Passed `triggers` param should be an object.');
			return cobj;
		}
		return Ext.apply(triggers || {}, cobj);
	},
	
	/**
	 * Merges some other plugins into initial configuration.
	 * @param {Object} cfg The config passed to class constructor.
	 * @param {Ext.plugin.Abstract[]/Ext.plugin.Abstract/Object[]/Object/Ext.enums.Plugin[]/Ext.enums.Plugin} plugins An array of plugins.
	 * @returns {Array} Result plugin array
	 */
	mergePlugins: function(cfg, plugins) {
		var cplugins = cfg.plugins || [], arr = [];
		if (!Ext.isArray(plugins)) plugins = [plugins];
		if (!Ext.isArray(cplugins)) cplugins = [cplugins];
		Ext.iterate(plugins, function(plugin) {
			arr.push(plugin);
		});
		Ext.iterate(cplugins, function(cplugin) {
			arr.push(cplugin);
		});
		return arr;
	}
});
