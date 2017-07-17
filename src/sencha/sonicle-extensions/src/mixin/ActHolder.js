/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.mixin.ActHolder', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'actholder'
	},
	
	__acts: null,
	
	constructor: function() {
		this.__acts = {};
	},
	
	destroy: function() {
		this.__acts = null;
	},
	
	/**
	 * Adds an action.
	 * @param {String} [group] The action group.
	 * @param {String} name The action name.
	 * @param {Ext.Action|Object} obj The action instance or a configuration object to add.
	 * @return {Ext.Action} The added action.
	 */
	addAct: function(group, name, obj) {
		var me = this;
		if (arguments.length === 2) {
			obj = name;
			name = group;
			group = Sonicle.mixin.ActHolder.DEFAULT_GROUP;
		}
		if (!me.__acts[group]) me.__acts[group] = {};
		if (obj.isAction) {
			return (me.__acts[group][name] = obj);
		} else {
			return (me.__acts[group][name] = me.createAction(group, name, obj));
		}
	},
	
	/**
	 * Gets an action from the specified group.
	 * If not provided, 'default' group is used.
	 * @param {String} [group] The action group.
	 * @param {String} name The action name.
	 * @return {Ext.Action} The action.
	 */
	getAct: function(group, name) {
		var me = this;
		if (arguments.length === 1) {
			name = group;
			group = Sonicle.mixin.ActHolder.DEFAULT_GROUP;
		}
		return (me.__acts[group]) ? me.__acts[group][name] : undefined;
	},
	
	/**
	 * Gets all actions.
	 * @param {String} group The action group.
	 * @returns {Object} The actions map.
	 */
	getActs: function(group) {
		return this.__acts[group];
	},
	
	createAction: function(group, name, cfg) {
		return new Ext.Action(cfg);
	},
	
	statics: {
		DEFAULT_GROUP: 'default'
	}
});
