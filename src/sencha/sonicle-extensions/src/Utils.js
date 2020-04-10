/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 */
Ext.define('Sonicle.Utils', {
    singleton: true,
	
	/**
	 * Copies all the defined properties of `config` to the specified `object`.
	 * @param {Object} object The receiver of the properties.
	 * @param {Object} config The primary source of the properties.
	 * @param {Object} [defaults] An object that will also be applied for default values.
	 * @return {Object} returns `object`.
	 */
	applyIfDefined: function(object, config, defaults) {
		var dconfig = {}, name, value;
		for (name in config) {
			if (config.hasOwnProperty(name)) {
				value = config[name];
				if (value !== undefined) dconfig[name] = value;
			}
		}
		return Ext.apply(object, dconfig, defaults);
	},
	
	/**
	 * 
	 * @param {Object} object The receiver of the property.
	 * @param {String} name The property name to set in target object.
	 * @param {Mixed} value The value to set.
	 * @returns {Object} returns `object`.
	 */
	setProp: function(object, name, value) {
		if (Ext.isObject(object) && Ext.isString(name)) {
			object[name] = value;
		}
		return object;
	},
	
	/**
	 * Copies the specified property value from 'source' into the target `object`.
	 * Undefined values will be ignored, unless applyIfEmpty is active.
	 * @param {Object} object The receiver of the property.
	 * @param {Boolean} applyIfEmpty `true` to process empty/undefined values, `false` otherwise.
	 * @param {Object} config The primary source of the properties.
	 * @param {String} name The property name to look-for in source object.
	 * @param {String} [newName] The new property name to use in target object, as the above if not specified.
	 * @param {Function} [parseFn] Optional function used to modify value before writing it.
	 * @param {Object} [scope] The scope (`this` reference) in which the `parseFn` function will be called.
	 * @return {Object} returns `object`.
	 */
	applyProp: function(object, applyIfEmpty, config, name, newName, parseFn, scope) {
		if (arguments.length === 4) {
			newName = name;
		} else if (arguments.length === 5 && Ext.isFunction(newName)) {
			parseFn = newName;
			newName = name;
		}
		if (Ext.isObject(object) && Ext.isObject(config) && Ext.isString(name) && (config[name] !== undefined) && (!applyIfEmpty && !Ext.isEmpty(config[name]))) {
			object[newName] = Ext.isFunction(parseFn) ? Ext.callback(parseFn, scope || this, [config[name]]) : config[name];
		}
		return object;
	}
});
