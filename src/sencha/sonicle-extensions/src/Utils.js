/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 */
Ext.define('Sonicle.Utils', {
    singleton: true,
	uses: [
		'Sonicle.Object',
		'Sonicle.String',
		'Sonicle.Number'
	],
	
	/**
	 * Returns first valid Number value of provided arguments.
	 * {@link Sonicle.Utils#coalesceNumber} is alias for {@link Sonicle.Number#coalesce}
	 * @param {Mixed...} numbers List of numbers.
	 * @returns {Mixed} The first valid value.
	 */
	numberCoalesce: function(numbers) {
		return Sonicle.Number.coalesce.apply(Sonicle.Number, arguments);
	},
	
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
	 * Merges some more docked-items into new `dockedItems` object.
	 * @param {Object|Object[]} dockedItems The source `dockedItems` object.
	 * @param {Object|Object[]} moreComponents Components to be added as docked-item.
	 * @returns {Object|Object[]} Object to use as {@link Ext.panel.Panel#dockedItems}.
	 */
	mergeDockedItems_old: function(dockedItems, moreComponents, append) {
		if (append === undefined || !Ext.isBoolean(append)) append = true;
		dockedItems = Ext.Array.from(dockedItems || {});
		var ret = dockedItems;
		if (moreComponents) {
			ret = append ? Ext.Array.push(dockedItems, Ext.Array.from(moreComponents)) : Ext.Array.insert(dockedItems, 0, Ext.Array.from(moreComponents));
		}
		return ret;
	},
	
	/**
	 * Merges some more docked-items into new `dockedItems` object.
	 * @param {Object|Object[]} dockedItems The source `dockedItems` object.
	 * @param {top|bottom|left|right} dock The region where to dock passed items.
	 * @param {Object|Object[]} moreComponents Components to be added as docked-item.
	 * @returns {Object|Object[]} Object to use as {@link Ext.panel.Panel#dockedItems}.
	 */
	mergeDockedItems: function(dockedItems, dock, moreComponents, append) {
		if (append === undefined || !Ext.isBoolean(append)) append = true;
		dockedItems = Ext.Array.from(dockedItems);
		var ret = dockedItems;
		if (moreComponents) {
			moreComponents = Ext.Array.from(moreComponents);
			if (!append) ret = [];
			Ext.iterate(moreComponents, function(cmp) {
				ret.push(Ext.apply(cmp || {}, { dock: dock }));
			});
			if (!append) Ext.Array.push(ret, dockedItems);
		}
		return ret;
	},
	
	/**
	 * Merges some more items into passed toolbar configuration.
	 * @param {Object|Object[]} toolbar An array of items or a Toolbar configuration object.
	 * @param {Object|Object[]} items The items to add.
	 * @param {Boolean} [append=true] Set to `false` to insert at beginning.
	 * @returns {Object|Object[]}
	 */
	mergeToolbarItems: function(toolbar, items, append) {
		if (append === undefined || !Ext.isBoolean(append)) append = true;
		if (Ext.isArray(toolbar)) {
			return append ? Ext.Array.push(toolbar, items) : Ext.Array.insert(toolbar, 0, items);
		} else if (Ext.isObject(toolbar) && !toolbar.isComponent) {
			toolbar.items =	append ? Ext.Array.push(toolbar.items || [], items) : Ext.Array.insert(toolbar.items || [], 0, items);
			return toolbar;
		}
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
	 * @param {Object} opts An object containing options.
	 * @param {raw|map|el} [opts.outputType] Set to `map` to switch to encoded map output, `el` for (unencoded) attrs object for HTMLElement. Defaults to `raw`.
	 * @param {Number} [opts.showDelay] Tooltip show delay. Only for QuickTips.
	 * @param {Number} [opts.dismissDelay] Tooltip dismiss delay. Only for QuickTips.
	 * @returns {String/Object} HTML attributes as String or Object map depending on configuration, or an empty string in case of misconfigurations.
	 */
	generateTooltipAttrs: function(tooltip, opts) {
		opts = opts || {};
		var SoS = Sonicle.String,
			qtips = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
			encode = SoS.htmlAttributeEncode,
			rawOutput = !SoS.isIn(opts.outputType, ['map', 'el']),
			encodeMap = opts.outputType === 'map',
			out = rawOutput ? '' : {};
		
		if (qtips) {
			if (Ext.isString(tooltip)) {
				if (rawOutput) {
					out += ' data-qtip="' + encode(tooltip) + '"';
				} else {
					out['data-qtip'] = encodeMap ? encode(tooltip) : tooltip;
				}
				//s += ' data-qtip="' + encode(tooltip) + '"';
			} else if (Ext.isObject(tooltip)) {
				if (rawOutput) {
					out += ' data-qtitle="' + encode(tooltip.title) + '" data-qtip="' + encode(tooltip.text) + '"';
				} else {
					out['data-qtitle'] = encodeMap ? encode(tooltip.title) : tooltip.title;
					out['data-qtip'] = encodeMap ? encode(tooltip.text) : tooltip.text;
				}
				//s += ' data-qtitle="' + encode(tooltip.title) + '" data-qtip="' + encode(tooltip.text) + '"';
			}
			if (Ext.isNumber(opts.showDelay)) {
				if (rawOutput) {
					out += ' data-qshowdelay="' + encode(opts.showDelay+'') + '"';
				} else {
					out['data-qshowdelay'] = encodeMap ? encode(opts.showDelay+'') : (opts.showDelay+'');
				}
				//s += ' data-qshowdelay="' + encode(opts.showDelay+'') + '"';
			}
			if (Ext.isNumber(opts.dismissDelay)) {
				if (rawOutput) {
					out += ' data-qdismissdelay="' + encode(opts.dismissDelay+'') + '"';
				} else {
					out['data-qdismissdelay'] = encodeMap ? encode(opts.dismissDelay+'') : (opts.dismissDelay+'');
				}
				//s += ' data-qdismissdelay="' + encode(opts.dismissDelay+'') + '"';
			}
			if (!Ext.isEmpty(opts.width)) {
				if (rawOutput) {
					out += ' data-qwidth="' + encode(opts.width+'') + '"';
				} else {
					out['data-qwidth'] = encodeMap ? encode(opts.width+'') : (opts.width+'');
				}
			}
			if (!Ext.isEmpty(opts.cls)) {
				if (rawOutput) {
					out += ' data-qclass="' + encode(opts.cls+'') + '"';
				} else {
					out['data-qclass'] = encodeMap ? encode(opts.cls+'') : (opts.cls+'');
				}
			}
			
		} else {
			if (Ext.isString(tooltip)) {
				if (rawOutput) {
					out += ' title="' + encode(tooltip) + '"';
				} else {
					out['title'] = encode(tooltip);
				}
				//s += ' title="' + encode(tooltip) + '"';
			} else if (Ext.isObject(tooltip)) {
				if (rawOutput) {
					out += ' title="' + encode(SoS.deflt(tooltip.text, tooltip.title)) + '"';
				} else {
					out['title'] = encode(SoS.deflt(tooltip.text, tooltip.title));
				}
				//s += ' title="' + encode(SoS.deflt(tooltip.text, tooltip.title)) + '"';
			}
		}
		return out;
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
	 * @param {Function} [formatFn] The format function to apply when getting value from Model's field.
	 * @returns {Mixed}
	 */
	rendererEvalValue: function(value, record, fieldName, getFn, fallbackValue, formatFn) {
		if (record && Ext.isFunction(getFn)) {
			return getFn.apply(this, [value, record]);
		} else if (record && !Ext.isEmpty(fieldName)) {
			return Ext.isFunction(formatFn) ? formatFn.apply(this, [record.get(fieldName)]) : record.get(fieldName);
			//return record.get(fieldName);
		} else {
			return (fallbackValue === undefined) ? value : fallbackValue;
		}
	},
	
	/**
	 * Returns a template function capable to evaluate a value from a getter 
	 * function or sustained by a field name. The getter function has precedence over the field's value.
	 * @param {String} fieldName
	 * @param {Function|Obect} getFn
	 * @param {Mixed} [fallbackValue] A fallback value that the function will return.
	 * @returns {Function} A function to use within {@link Ext.XTemplate} definition.
	 */
	tplValueGetterFn: function(fieldName, getFn, fallbackValue) {
		if (Ext.isFunction(getFn) || (Ext.isObject(getFn) && Ext.isFunction(getFn.fn))) {
			var fn = Ext.isFunction(getFn) ? getFn : getFn.fn,
				scope = Ext.isObject(getFn) ? getFn.scope || this : this;
			return function(values) {
				return Sonicle.Object.coalesce(fn.apply(scope, [values, values[fieldName]]), fallbackValue);
			};
		} else if (!Ext.isEmpty(fieldName)) {
			return function(values) {
				return Sonicle.Object.coalesce(values[fieldName], fallbackValue);
			};
		} else {
			return function(values) {
				return fallbackValue;
			};
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
			ct = container, i;
		for (i=0; i < keys.length; i++) {
			ct = ct.lookupReference(keys[i]);
			if(!ct) break;
		}
		return ct;
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
	 * @param {Object} [data] Useful data to pass (data will be saved into menu.menuData property).
	 * @param {Object} [opts] An object containing options.
	 * @param {Ext.dom.Element|Ext.Component} [opts.alignTo] The HTMLElement/component to align the menu with (using menuAlign config).
	 * @param {String} [opts.alignment] The position to align to. Defaults to "tl-bl?".
	 * @param {Ext.dom.Element|Ext.Component} [opts.shownBy] The HTMLElement/component on which apply active CSS Class.
	 * @param {String} [opts.shownByCls] The CSS Class to apply to owner's element.
	 * @returns {Ext.menu.Menu}
	 */
	showContextMenu: function(evt, menu, data, opts) {
		opts = opts || {};
		var me = this, lcm, alignEl;
		
		evt.stopEvent();
		me.hideContextMenu();
		if (!menu || !menu.isXType('menu')) return;
		
		menu.menuData = data || {};
		me.lastContextMenu = lcm = {
			menu: menu,
			shownByEl: (opts.shownBy && opts.shownBy.isComponent) ? opts.shownBy.el : opts.shownBy,
			shownByCls: opts.shownByCls || 'so-contextmenu-owner'
		};
		menu.on('hide', function(s) {
			var lcm = me.lastContextMenu;
			s.menuData = {};
			if (lcm && lcm.menu.getId() === s.getId()) {
				if (Ext.isString(lcm.shownByCls) && lcm.shownByEl) {
					lcm.shownByEl.removeCls(lcm.shownByCls);
				}
				delete me.lastContextMenu;
			}
		}, me, {single: true});
		
		if (Ext.isString(lcm.shownByCls) && lcm.shownByEl) {
			lcm.shownByEl.addCls(lcm.shownByCls);
		}
		
		if (opts.alignTo) {
			if (opts.alignTo.isComponent && opts.alignTo.el) {
				alignEl = opts.alignTo.el;
				if (!opts.alignment) opts.alignment = opts.alignTo.menuAlign;
			} else {
				alignEl = opts.alignTo;
			}
			menu.showBy(alignEl, opts.alignment || 'tl-bl?');
			// Trick: call a fn to resets some internal props assigned by {@link Ext.Component#showBy} otherwise menu won't be positionable anymore!
			menu.clearAlignEl();
		} else {
			menu.showAt(evt.getXY());
		}
		return menu;
	},
	
	/**
	 * Hides currently visible context menu.
	 */
	hideContextMenu: function() {
		var lcm = this.lastContextMenu;
		if (lcm && lcm.menu) lcm.menu.hide();
	},
	
	/**
	 * Returns context menu data previously saved into menu.menuData property.
	 * @returns {Object} The data object.
	 */
	getContextMenuData: function() {
		var lcm = this.lastContextMenu;
		return (lcm && lcm.menu) ? lcm.menu.menuData : null;
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
	},
	
	relaxConstrainRegion: function(region, opts) {
		opts = opts || {};
		if (region instanceof Ext.util.Region) {
			if (opts.top === true) {
				region.height = region.height + region.top;
				region['1'] = region.y = region.top = 0;
			}
			if (opts.left === true) {
				region.width = region.width + region.left;
				region['0'] = region.x = region.left = 0;
			}
		}
		return region;
	},
	
	/**
	 * Returns a renderer function for column cell, properly customized using options.
	 * @param {Object} [opts] An object containing configuration.
	 * 
	 * This object may contain any of the following properties:
	 * 
	 * @param {Boolean} opts.useEmptyCls Set to `true` to use an empty-CSS class to mark empty cells.
	 * @param {Boolean} opts.htmlEncode Set to `true` to apply HTML encoding to resulting output.
	 * @returns {Function} The renderer function
	 */
	generateBaseColumnRenderer: function(opts) {
		opts = opts || {};
		return function(value, metaData) {
			if (metaData && opts.useEmptyCls === true) {
				// This is the same check for empty value done in Ext.view.Table!
				if (value == null ||
					value.length === 0 ||
					(Ext.isString(value) && value.replace(/\s/g, '').length === 0)
				) {
					metaData.tdCls += ' x-grid-cell-empty';
				}
			}
			if (opts.htmlEncode === true) value = Ext.String.htmlEncode(value);
			return value;
		};
	},
	
	/**
	 * Extract property's name of passed binding object.
	 * @param {Ext.app.bind.Binding} binding
	 * @returns {String}
	 */
	getBindingName: function(binding) {
		return (binding && binding.isInstanceOfClass('Ext.app.bind.Binding')) ? binding.stub.name : undefined;
	},
	
	/**
	 * Removes configured header from passed Panel.
	 * @param {Ext.Component} cmp
	 */
	removePanelHeader: function(cmp) {
		if (!cmp.isPanel) return;
		if (cmp.header && cmp.header.isHeader) {
			cmp.header.destroy();
		}
		cmp.header = false;
		cmp.updateHeader();
	}
});
