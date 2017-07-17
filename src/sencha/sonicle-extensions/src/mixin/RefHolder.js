/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.mixin.RefHolder', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'refholder'
	},
	
	__refs: null,
	
	constructor: function() {
		this.__refs = {};
	},
	
	destroy: function() {
		this.__refs = null;
	},
	
	/**
	 * Adds a reference.
	 * @param {String} [group] The reference group.
	 * @param {String} name The reference name.
	 * @param {Mixed} obj The reference to add.
	 * @return {Mixed} The reference added.
	 */
	addRef: function(group, name, obj) {
		var me = this;
		if (arguments.length === 2) {
			obj = name;
			name = group;
			group = Sonicle.mixin.RefHolder.DEFAULT_GROUP;
		}
		if (!me.__refs[group]) me.__refs[group] = {};
		
		return (me.__refs[group][name] = obj);
	},
	
	/**
	 * Gets a reference from the specified group.
	 * If not provided, 'default' group is used.
	 * @param {String} [group] The reference group.
	 * @param {String} name The reference name.
	 * @return {Mixed} The reference.
	 */
	getRef: function(group, name) {
		var me = this;
		if (arguments.length === 1) {
			name = group;
			group = Sonicle.mixin.RefHolder.DEFAULT_GROUP;
		}
		return (me.__refs[group]) ? me.__refs[group][name] : undefined;
	},
	
	/**
	 * Gets all references.
	 * @param {String} group The reference group.
	 * @returns {Object} The references map.
	 */
	getRefs: function(group) {
		return this.__refs[group];
	},
	
	statics: {
		DEFAULT_GROUP: 'default'
	}
});
