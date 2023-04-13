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
	 * @deprecated use Sonicle.Object.setProp() instead
	 */
	setProp: function(object, name, value) {
		Ext.log.warn('"Sonicle.Utils.setProp" is deprecated. Use "Sonicle.Object.setProp" instead.');
		return Sonicle.Object.setProp.apply(Sonicle.Object, arguments);
	},
	
	/**
	 * @deprecated use Sonicle.Object.copyProp() instead
	 */
	applyProp: function(object, applyIfEmpty, sobject, name, newName, parseFn, scope) {
		Ext.log.warn('"Sonicle.Utils.applyProp" is deprecated. Use "Sonicle.Object.copyProp" instead.');
		return Sonicle.Object.copyProp.apply(Sonicle.Object, arguments);
	},
	
	/**
	 * Collects stack-trace into an array.
	 * @param {Integer} traceback The initial index from which start collecting.
	 * @returns {Array} 
	 */
	stackTrace: function(traceback) {
		var stack = new Error().stack || '';
		stack = stack.split('\n').map(function(line) { return line.trim(); });
		stack = stack.splice(stack[0] === 'Error' ? 2 : 1);
		return (Ext.isNumber(traceback) && (traceback > 0 && traceback <= stack.length)) ? stack.splice(traceback) : stack;
	},
	
	/**
	 * Collects stack-trace as String.
	 * @param {Integer} traceback The initial index from which start collecting.
	 * @returns {String}
	 */
	stackTraceToString: function(traceback) {
		var stack = this.stackTrace(traceback);
		return Ext.isArray(stack) ? Sonicle.String.join('\n', stack) : '';
	},
	
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
		return Ext.apply(icfg, Sonicle.Object.remap(constructorConfig, Ext.Object.getKeys(namesMap)));
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
	 * Generates HTML attriutes to display tooltip suitable to complete markup.
	 * @param {String/Object} tooltip It can be a string to be used as innerHTML (html tags are accepted) or QuickTips config object.
	 * @returns {String} The HTML attributes, or an empty string in case of misconfigurations.
	 */
	generateTooltipAttrs: function(tooltip, opts) {
		opts = opts || {};
		var SoS = Sonicle.String,
			qtips = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
			encode = SoS.htmlAttributeEncode,
			s = '';
		
		if (qtips) {
			if (Ext.isString(tooltip)) {
				s += ' data-qtip="' + encode(tooltip) + '"';
			} else if (Ext.isObject(tooltip)) {
				s += ' data-qtitle="' + encode(tooltip.title) + '" data-qtip="' + encode(tooltip.text) + '"';
			}
			if (Ext.isNumber(opts.showDelay)) s += ' data-qshowdelay="' + encode(opts.showDelay+'') + '"';
			if (Ext.isNumber(opts.dismissDelay)) s += ' data-qdismissdelay="' + encode(opts.dismissDelay+'') + '"';
			
		} else {
			if (Ext.isString(tooltip)) {
				s += ' title="' + encode(tooltip) + '"';
			} else if (Ext.isObject(tooltip)) {
				s += ' title="' + encode(SoS.deflt(tooltip.text, tooltip.title)) + '"';
			}
		}
		return s;
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
	},
	
	/**
	 * Looks for a component with the specified {@link #reference} value into 
	 * the passed container component. This method, unlike the {@link Ext.mixin.Container#lookupReference original one}, 
	 * supports nesting of references using a dotted-style notation: a separate 
	 * `lookupReference` call will be issued for each token found, so you with 
	 * this you can dig down into the component hierarchy easily.
	 * @param {Ext.container.Container} container The root hierarchy container in which start lookup.
	 * @param {String} path A single reference or a reference path in dotted-notation.
	 * @returns {Ext.Component} The referenced component or `null` if it is not found.
	 */
	lookupReference: function(container, path) {
		var keys = path.split('.'),
				cnt = container, i;
		for (i=0; i < keys.length; i++) {
			cnt = cnt.lookupReference(keys[i]);
			if(!cnt) break;
		}
		return cnt;
	},
	
	/**
	 * Transforms passed array into a suitable JSON String. If passed value is
	 * it's not already an array, an array with one item will be retured.
	 * @param {Object|Object[]} arr The value to use as an array.
	 * @returns {String}
	 */
	toJSONArray: function(arr) {
		return Ext.JSON.encode(Ext.Array.from(arr));
	},
	
	/**
	 * Displays specified contextmenu in a centralized way.
	 * Any previous visible menu will be hide automatically.
	 * @param {Ext.event.Event} evt The raw event object.
	 * @param {Ext.menu.Menu} menu The menu component.
	 * @param {Object} data Useful data to pass (data will be saved into menu.menuData property).
	 * @returns {Ext.menu.Menu}
	 */
	showContextMenu: function(evt, menu, data) {
		var me = this;
		
		evt.stopEvent();
		me.hideContextMenu();
		if (!menu || !menu.isXType('menu')) return;
		
		menu.menuData = data || {};
		me.lastContextMenu = menu;
		menu.on('hide', function(s) {
			s.menuData = {};
			if (me.lastContextMenu && me.lastContextMenu.getId() === s.getId()) {
				me.lastContextMenu = null;
			}
		}, me, {single: true});
		menu.showAt(evt.getXY());
		return menu;
	},
	
	/**
	 * Hides currently visible context menu.
	 */
	hideContextMenu: function() {
		var cxm = this.lastContextMenu;
		if (cxm) cxm.hide();
	},
	
	/**
	 * Returns context menu data previously saved into menu.menuData property.
	 * @returns {Object} The data object.
	 */
	getContextMenuData: function() {
		var cxm = this.lastContextMenu;
		return (cxm) ? cxm.menuData : null;
	},
	
	configurePropertyGrid: function(propertyGrid, sourceConfig, store) {
		var recs, keys;
		if (propertyGrid && propertyGrid.isXType('propertygrid')) {
			if (sourceConfig) {
				propertyGrid.sourceConfig = sourceConfig;
				propertyGrid.configure(sourceConfig);
			}
			if (propertyGrid.sourceConfig && store) {
				keys = Ext.Object.getAllKeys(propertyGrid.sourceConfig);
				recs = [];
				store.each(function(rec) {
					if (!Ext.isDefined(sourceConfig[rec.getId()])) {
						recs.push(rec);
					} else {
						rec.set('index', keys.indexOf(rec.get('name')));
					}
				});
				if (recs.length > 0) store.remove(recs);

				recs = [];
				Ext.iterate(propertyGrid.sourceConfig, function(name, obj) {
					if (!store.getById(name)) {
						recs.push(store.createModel({name: name, value: obj.defaultValue, index: keys.indexOf(name)}));
					}
				});
				if (recs.length > 0) store.add(recs);
			}
		}
	}
});
