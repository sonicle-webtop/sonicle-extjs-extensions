/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.Object', {
	singleton: true,
	
	/**
	 * Returns passed value as an Object value.
	 * @param {Mixed} value The value to be evaluated.
	 * @param {Object} [defaultValue=null] The value to return when provided value is not defined.
	 * @returns {Object}
	 */
	objectValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = null;
		return Ext.isObject(value) ? value : defaultValue;
	},
	
	/**
	 * Returns passed value as a String value.
	 * @param {Mixed} value The value to be evaluated.
	 * @param {String} [defaultValue=null] The value to return when provided value is not defined.
	 * @returns {String}
	 */
	stringValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = null;
		if (Ext.isEmpty(value)) return defaultValue;
		return ''+value;
	},
	
	/**
	 * Returns passed value as a Boolean value.
	 *  - `true`, `t`, `yes`, `y`, `1` are treated as `true` boolean value
	 *  - `false`, `f`, `no`, `n`, `0` are treated as `false` boolean value
	 * @param {Mixed} value The value to be evaluated.
	 * @param {Mixed} [defaultValue=false] The value to return when provided value is not defined.
	 * @returns {Boolean}
	 */
	booleanValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = false;
		if (Ext.isEmpty(value)) return defaultValue;
		if (Ext.isBoolean(value)) return value;
		switch (this.stringValue(value).toLowerCase().trim()) {
			case 'true': case 't': case 'yes': case 'y': case '1': return true;
			case 'false': case 'f': case 'no': case 'n': case '0': return false;
			default: defaultValue;
		}
	},
	
	/**
	 * Returns passed value as a Number value.
	 * @param {Mixed} value The value to be evaluated.
	 * @param {Number} [defaultValue=null] The value to return when provided value is not defined.
	 * @returns {Number}
	 */
	numberValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = null;
		if (Ext.isEmpty(value)) return defaultValue;
		if (Ext.isNumber(value)) return value;
		return Number(value);
	},
	
	/**
	 * Returns passed value as a Date value.
	 * @param {Mixed} value The value to be evaluated.
	 * @param {Date} [defaultValue=null] The value to return when provided value is not defined.
	 * @returns {Date}
	 */
	dateValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = null;
		if (Ext.isEmpty(value)) return defaultValue;
		if (Ext.isDate(value)) return value;
		return Ext.Date.parse(value, 'Y-m-d');
	},
	
	/**
	 * Returns passed value as a Date value.
	 * @param {Mixed} value The value to be evaluated.
	 * @param {Date} [defaultValue=null] The value to return when provided value is not defined.
	 * @returns {Date}
	 */
	timeValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = null;
		if (Ext.isEmpty(value)) return defaultValue;
		if (Ext.isDate(value)) return value;
		var ret = Ext.Date.parse(value, 'H:i:s');
		if (ret) return ret;
		return Ext.Date.parse(value, 'H:i');
	},
	
	/**
	 * Returns passed value as a Date value.
	 * @param {Mixed} value The value to be evaluated.
	 * @param {Date} [defaultValue=null] The value to return when provided value is not defined.
	 * @returns {Date}
	 */
	dateTimeValue: function(value, defaultValue) {
		if (arguments.length === 1) defaultValue = null;
		if (Ext.isEmpty(value)) return defaultValue;
		if (Ext.isDate(value)) return value;
		var ret = Ext.Date.parse(value, 'Y-m-d H:i:s');
		if (ret) return ret;
		return Ext.Date.parse(value, 'Y-m-d H:i');
	},
	
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
	 * Sets a property into an object.
	 * @param {Object} object The receiver of the property.
	 * @param {String} key The property name to set in target object.
	 * @param {Mixed} value The value to set.
	 * @param {Boolean} [ifDefined=false] Set to `true` to set property only if whose value is defined.
	 * @returns {Object} returns `object`.
	 */
	setProp: function(object, key, value, ifDefined) {
		if (Ext.isObject(object) && Ext.isString(key)) {
			if (!ifDefined || Ext.isDefined(value)) object[key] = value;
		}
		return object;
	},
	
	/**
	 * Plucks the value of properties targeted by specified keys.
	 * By default, matching keys' value will be included in resulting object.
	 * @param {Object} object The object in which dig into.
	 * @param {String[]|String|Boolean} keys List of keys to match or set to `true` to match all keys.
	 * @param {Boolean} [exclude=false] `true` to return only properties that not match passed keys.
	 * @param {Object} [newKeys] Optional mapping table for keys in the form 'key -> newKey' for renaming purposes.
	 * @param {Object} [scope] The scope (this reference) in which `newKeys` function is executed.
	 * @returns {Object} New object with plucked properties.
	 */
	pluck: function(object, keys, exclude, newKeys, scope) {
		if (keys !== true) keys = Ext.Array.from(keys, false);
		exclude = Ext.isBoolean(exclude) ? exclude : false;
		if (!Ext.isObject(object)) return object;
		var obj = {};
		Ext.iterate(Ext.Object.getKeys(object), function(key) {
			if ((keys === true) || (exclude && keys.indexOf(key) === -1) || (!exclude && keys.indexOf(key) !== -1)) {
				var newKey = key;
				if (Ext.isObject(newKeys) && newKeys.hasOwnProperty(key)) {
					newKey = newKeys[key];
				} else if (Ext.isFunction(newKeys)) {
					newKey = Ext.callback(newKeys, scope || this, [key]);
				}
				obj[newKey] = object[key];
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
	},
	
	/**
	 * Copies the specified property value from Source `object` into the Target `object`.
	 * Undefined values will be ignored, unless copyIfEmpty is active.
	 * @param {Object} object The receiver of the property.
	 * @param {Boolean} copyIfEmpty `true` to process empty/undefined values, `false` otherwise.
	 * @param {Object} source The primary source of the properties.
	 * @param {String} name The property name to look-for in source object.
	 * @param {String} [newName] The new property name to use in target object, as the above if not specified.
	 * @param {Function} [parseFn] Optional function used to modify value before writing it.
	 * @param {Object} [scope] The scope (`this` reference) in which the `parseFn` function will be called.
	 * @return {Object} returns `object`.
	 */
	copyProp: function(object, copyIfEmpty, source, name, newName, parseFn, scope) {
		if (arguments.length === 4) {
			newName = name;
		} else if (arguments.length === 5 && Ext.isFunction(newName)) {
			parseFn = newName;
			newName = name;
		}
		if (Ext.isObject(object) && Ext.isObject(source) && Ext.isString(name) && (source[name] !== undefined) && (copyIfEmpty || !Ext.isEmpty(source[name]))) {
			object[newName] = Ext.isFunction(parseFn) ? Ext.callback(parseFn, scope || this, [source[name]]) : source[name];
		}
		return object;
	},
	
	/**
	 * Puts specified value at key in the passed multi-value map.
	 * @param {Object} map The Map.
	 * @param {String} key The key.
	 * @param {Mixed} value The value to push in values list.
	 * @returns {Object} returns `map`.
	 */
	multiValueMapPut: function(map, key, value) {
		if (Ext.isObject(map)) {
			var arr = Ext.Array.from(map[key]);
			arr.push(value);
			map[key] = arr;
		}
		return map;
	},
	
	/**
	 * Merges two multi-value Maps, one into the other. Both Maps must be of same type.
	 * @param {Object} destMap The destination Map.
	 * @param {Object} map The The map that will be merged.
	 * @returns {Object} returns `destMap`.
	 */
	multiValueMapMerge: function(destMap, map) {
		if (Ext.isObject(map)) {
			Ext.iterate(map, function(key, values) {
				Ext.iterate(values, function(value) {
					Sonicle.Object.multiValueMapPut(destMap, key, value);
				});
			});
		}
		return destMap;
	}
});