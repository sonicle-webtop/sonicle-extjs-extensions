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
	
	/**
	 * Extracts the value of the key/property from specified object.
	 * @param {Object} object The object from which extract value.
	 * @param {String} key The property name.
	 * @param {Mixed} [ifMissing=undefined] The value to return if property is missing, otherwise undefined will be returned.
	 * @returns {undefined|Mixed} Property value.
	 */
	getValue: function(object, key, ifMissing) {
		if (Ext.isObject(object) && Ext.isString(key)) {
			return object.hasOwnProperty(key) ? object[key] : ifMissing;
		}
		return undefined;
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
	},
	
	/**
	 * Applies key/value pairs into the specified object.
	 * The cardinality of keys and value array must be the same.
	 * @param {Object} object The object in which apply values.
	 * @param {String[]|String} keys The list of keys to be set.
	 * @param {Mixed[]|Mixed} values The list of values to set.
	 * @returns {Object} The object itself.
	 */
	applyPairs: function(object, keys, values) {
		keys = Ext.Array.from(keys, false);
		values = Ext.Array.from(values, false);
		if (keys.length === values.length) {
			for (var i=0; i < keys.length; i++) {
				var key = keys[i];
				if (!Ext.isEmpty(key)) {
					object[new String(key)] = values[i];
				}
			}
		}
		return object;
	}
});