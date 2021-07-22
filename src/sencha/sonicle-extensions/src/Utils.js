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
	 * Merges some more triggers into new object.
	 * @param {Object} triggers The original triggers object.
	 * @param {Object} moreTriggers Triggers config objects to add. The values in this object
	 * are {@link Ext.form.trigger.Trigger Trigger} configuration objects.
	 * @returns {Object} Object to use as {@link Ext.form.field.Text#triggers}.
	 */
	mergeTriggers: function(triggers, moreTriggers) {
		if (Ext.isArray(moreTriggers)) {
			Ext.warn('Passed `moreTriggers` param should be an object.');
			return triggers;
		}
		return Ext.apply(moreTriggers || {}, triggers);
	},
	
	/**
	 * Merges some more plugins into new array.
	 * @param {Ext.plugin.Abstract[]/Ext.plugin.Abstract/Object[]/Object/Ext.enums.Plugin[]/Ext.enums.Plugin} plugins The original plugin set (for eg. that in config).
	 * @param {Ext.plugin.Abstract[]/Ext.plugin.Abstract/Object[]/Object/Ext.enums.Plugin[]/Ext.enums.Plugin} morePlugins An array of plugins to add.
	 * @returns {Array} Resulting plugin array
	 */
	mergePlugins: function(plugins, morePlugins) {
		var oplu = plugins && !Ext.isArray(plugins) ? [plugins] : (plugins || []),
				nplu = morePlugins && !Ext.isArray(morePlugins) ? [morePlugins] : (morePlugins || []),
				arr = [];
		
		Ext.iterate(oplu, function(plu) {
			arr.push(plu);
		});
		Ext.iterate(nplu, function(plu) {
			arr.push(plu);
		});
		return arr;
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
		var SoS = Sonicle.String,
				qtips = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
				encode = SoS.htmlAttributeEncode;
		
		if (Ext.isString(tooltip)) {
			return (qtips ? ' data-qtip' : ' title') + '="' + encode(tooltip) + '"';
		} else if (Ext.isObject(tooltip)) {
			if (qtips) {
				return ' data-qtitle="' + encode(tooltip.title) + '" data-qtip="' + encode(tooltip.text) + '"';
			} else {
				return ' title' + '="' + encode(SoS.deflt(tooltip.text, tooltip.title)) + '"';
			}
		} else {
			return '';
		}
	},
	
	/**
	 * Function to evaluate a return value based on parameters specified.
	 * If both record and getFn are specified, it return the value returned by
	 * getFn call. Otherwise if record and field name are specified, it returns
	 * the corresponding field's value whose name is specified. Finally, if 
	 * defined, it returns the fallback value is returned, otherwise the value itself.
	 * @param {Mixed} value The value.
	 * @param {Ext.data.Model} [record] A record related to value.
	 * @param {String} [fieldName] The record field's name.
	 * @param {Function} [getFn] The getter function.
	 * @param {Mixed} [fallbackValue] If specified, the value to return as fallback instead of value param.
	 * @returns {Mixed}
	 */
	rendererEvalValue: function(value, record, fieldName, getFn, fallbackValue) {
		if (record && Ext.isFunction(getFn)) {
			return getFn.apply(this, [value, record]);
		} else if (record && !Ext.isEmpty(fieldName)) {
			return record.get(fieldName);
		} else {
			return (fallbackValue === undefined) ? value : fallbackValue;
		}
	},
	
	/**
	 * Iterates specified item IDs as components into passed menu and sets 
	 * menu-item checked status.
	 * @param {Ext.menu.Menu} menu The menu holding the item/s.
	 * @param {String/String[]} itemId The itemId or a collection of IDs to set together.
	 * @param {Boolean} checked Checked value to set.
	 */
	checkMenuItem: function(menu, itemId, checked) {
		if (!menu || !menu.isXType('menu')) return;
		if (!Ext.isBoolean(checked)) checked = true;
		var itemIds = Ext.Array.from(itemId), cmp;
		Ext.iterate(itemIds, function(iid) {
			cmp = menu.getComponent(iid);
			if (cmp && cmp.isXType('menucheckitem')) {
				cmp.setChecked(checked);
			}
		});
	},
	
	/**
	 * Checks, using the passed grid component, if the specified column is hidden or not.
	 * @param {Ext.grid.Panel} grid The grid panel.
	 * @param {String} itemId The column ID to check.
	 * @returns {Boolean}
	 */
	isGridColumnHidden: function(grid, itemId) {
		var col = grid.getView().getColumnManager().getHeaderById(itemId);
		return (col && col.hidden) ? true : false;
	}
});
