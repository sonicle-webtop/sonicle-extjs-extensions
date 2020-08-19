/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.Object', {
	singleton: true,
	
	/**
	 * Returns first non-NULL value of provided arguments.
	 * @param {Mixed...} values List of values.
	 * @returns {Mixed} The first non-NULL value.
	 */
	coalesce: function(values) {
		for (var i=0; i<arguments.length; i++) {
			if ((arguments[i] !== null) && (arguments[i] !== undefined)) return arguments[i];
		}
		return null;
	},
	
	getValue: function(object, key, ifNoKey) {
		if (Ext.isObject(object) && Ext.isString(key)) {
			return object.hasOwnProperty(key) ? object[key] : ifNoKey;
		} else {
			return undefined;
		}
	},
	
	/**
	 * Plucks the value of properties targeted by specified keys.
	 * By default, matching keys' value will be included in resulting object.
	 * @param {Object} object The object in which dig into.
	 * @param {String[]|String} keys List of keys to match.
	 * @param {Boolean} [exclude=false] `true` to return only properties that not match passed keys.
	 * @returns {Object} New object with plucked properties.
	 */
	pluck: function(object, keys, exclude) {
		keys = Ext.Array.from(keys, false);
		exclude = Ext.isBoolean(exclude) ? exclude : false;
		if (!Ext.isObject(object)) return object;
		var obj = {};
		Ext.iterate(Ext.Object.getKeys(object), function(key) {
			if ((exclude && keys.indexOf(key) === -1) || (!exclude && keys.indexOf(key) !== -1)) {
				obj[key] = object[key];
			}
		});
		return obj;
	}
});