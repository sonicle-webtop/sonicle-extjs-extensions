/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 */
Ext.define('Sonicle.Utils', {
    singleton: true,
	uses: [
		'Sonicle.Object',
		'Sonicle.String'
	],
	
	/**
	 * 
	 * @param {Ext.Base} classInst The class instance.
	 * @param {Object} constructorConfig The config object passed to constructor.
	 * @param {String[]|String|Object|Object[]|Mixed[]} names Array of config names to get value for.
	 * If the item is an object like "{name:boolean}" instead of String value
	 * @returns {Object} The resulting values object.
	 */
	getConstructorConfigs: function(classInst, constructorConfig, names) {
		var namesMap = {}, icfg = {};
		Ext.iterate(Ext.Array.from(names, false), function(name) {
			if (Ext.isString(name)) {
				namesMap[name] = false;
			} else if (Ext.isObject(name)) {
				var keys = Ext.Object.getKeys(name);
				if (keys.length > 0) {
					namesMap[keys[0]] = name[keys[0]] === true;
				}
			}
		});
		Ext.iterate(namesMap, function(key, isProp) {
			icfg[key] = isProp ? classInst[key] : classInst.getInitialConfig(key);
		});
		return Ext.apply(icfg, Sonicle.Object.pluck(constructorConfig, Ext.Object.getKeys(namesMap)));
	},
	
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
	},
	
	/**
	 * Generates HTML attriutes to display tooltip suitable to complete markup.
	 * @param {String/Object} tooltip It can be a string to be used as innerHTML (html tags are accepted) or QuickTips config object.
	 * @returns {String} The HTML attributes, or an empty string in case of misconfigurations.
	 */
	generateTooltipAttrs: function(tooltip) {
		var qtips = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
				encode = Ext.String.htmlEncode;
		
		if (Ext.isString(tooltip)) {
			return (qtips ? ' data-qtip' : ' title') + '="' + encode(tooltip) + '"';
		} else if (Ext.isObject(tooltip)) {
			if (qtips) {
				return ' data-qtitle="' + encode(tooltip.title) + '" data-qtip="' + encode(tooltip.text) + '"';
			} else {
				return ' title' + '="' + encode(Sonicle.String.deflt(tooltip.text, tooltip.title)) + '"';
			}
		} else {
			return '';
		}
	}
});
