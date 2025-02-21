/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 */
Ext.define('Sonicle.Data', {
    singleton: true,
	
	/**
	 * Applies extra-params to passed Proxy, or to the inner Proxy in case of Store.
	 * @param {Ext.data.proxy.Proxy/Ext.data.Store} proxy The proxy.
	 * @param {Object} extraParams Extra params to apply.
	 * @param {Boolean} [clear=false] 'true' to clear previous params, 'false' to merge them.
	 */
	applyExtraParams: function(proxy, extraParams, clear) {
		if (arguments.length === 2) clear = false;
		if (!proxy.isProxy && !proxy.isStore) return;
		proxy = (proxy.isStore) ? proxy.getProxy() : proxy;
		if (proxy) {
			var obj = Ext.apply((clear) ? {} : proxy.getExtraParams(), extraParams);
			proxy.setExtraParams(obj);
		}
	},
	
	/**
	 * Removes extra-params from passed Proxy, or from the inner Proxy in case of Store.
	 * @param {Ext.data.proxy.Proxy/Ext.data.Store} proxy The proxy.
	 * @param {String|String[]} names Names of extraParams to remove.
	 */
	removeExtraParams: function(proxy, names) {
		if (!proxy.isProxy && !proxy.isStore) return;
		proxy = (proxy.isStore) ? proxy.getProxy() : proxy;
		names = Ext.Array.from(names);
		if (proxy) {
			var obj = {};
			Ext.iterate(proxy.getExtraParams(), function(k,v) {
				if (names.indexOf(k) !== -1) obj[k] = v;
			});
			proxy.setExtraParams(obj);
		}
	},
	
	/**
	 * Reloads passes Store applying specified extra-params.
	 * @param {Ext.data.Store} store The store.
	 * @param {Object} extraParams Extra params to apply.
	 * @param {Boolean} [overwrite=false] Set as 'true' to clear previous extra-params, 'false' to merge them.
	 * @param {Function} [callback] A callback function to call after load operation.
	 * @param {Object} [scope] The scope (**this** reference) in which the callback is executed.
	 */
	loadWithExtraParams: function(store, extraParams, overwrite, callback, scope) {
		if (!store.isStore) return;
		var opts = {};
		if (Ext.isFunction(callback)) {
			Ext.apply(opts, {callback: callback});
			if (scope !== undefined) Ext.apply(opts, {scope: scope});
		}
		this.applyExtraParams(store, extraParams, overwrite);
		store.load(opts);
	},
	
	/**
	 * Gets the params of a hypotetical load operation executed against passed store.
	 * @param {Ext.data.Store|Ext.data.Proxy} store The store.
	 * @returns {Object}
	 */
	getParams: function(store) {
		var params = {}, proxy, lopts, op;
		if (store && store.isStore) {
			proxy = store.getProxy();
		} else if (store && store.isProxy) {
			proxy = store;
			store = null;
		}
		
		if (store) {
			lopts = {};
			store.setLoadOptions(lopts);
		}
		if (proxy) {
			if (lopts) {
				op = Ext.createByAlias('data.operation.read', lopts);
				params = proxy.getParams(op);
			}
			params = Ext.apply(params, proxy.getExtraParams() || {});
		}
		return params;
	},
	
	/**
	 * Checks if a store needs a sync operation.
	 * @param {Ext.data.Store} store The store.
	 * @returns {Boolean}
	 */
	storeNeedsSync: function(store) {
		var needsSync = false;
		if (store.isStore) {
			if (store.getNewRecords().length > 0) needsSync = true;
			if (store.getUpdatedRecords().length > 0) needsSync = true;
			if (store.getRemovedRecords().length > 0) needsSync = true;
		}
		return needsSync;
	},
	
	/**
	 * Deep-clone a store.
	 * @param {Ext.data.Store} store The store to be cloned.
	 * @returns {Ext.data.Store} The new store
	 */
	storeDeepClone: function(store) {
		var source = Ext.isString(store) ? Ext.data.StoreManager.lookup(store) : store,
			target;
		
		if (source && source.isStore) {
			target = Ext.create(source.$className, {
				model: source.model
			});
			target.add(Ext.Array.map(source.getRange(), function(rec) {
				return rec.copy();
			}));
		}
		return target;
	},
	
	/**
	 * Returns an array of Records of the specified IDs.
	 * A null element will be added in case the Record is missing for an ID.
	 * @param {Ext.data.Store} store The data store.
	 * @param {Mixed|Mixed[]} ids Array of IDs for which to collect records.
	 * @returns {Ext.data.Model[]}
	 */
	getByIds: function(store, ids) {
		var ret = [], rec;
		Ext.iterate(Ext.Array.from(ids), function(id) {
			rec = store.getById(id);
			ret.push(rec);
		});
		return ret;
	},
	
	/**
	 * Finds the matching Records in the store by a specific field value.
	 * When store is filtered, finds records only within filter.
	 * @param {Ext.data.Store} store The data store.
	 * @param {String} fieldName The name of the Record field to test.
	 * @param {String/RegExp} value Either a string that the field value should begin with, or a RegExp to test against the field.
	 * @param {Boolean} [anyMatch=false] True to match any part of the string, not just the beginning.
	 * @param {Boolean} [caseSensitive=false] True for case sensitive comparison.
	 * @param {Boolean} [exactMatch=false] True to force exact match (^ and $ characters added to the regex). Ignored if `anyMatch` is `true`.
	 * @returns {Ext.data.Model[]} The matched records or an empty array.
	 */
	findRecords: function(store, fieldName, value, anyMatch, caseSentitive, exactMatch) {
		var recs = [],
				iof = -1, start = 0, rec;
		while (true) {
			rec = store.findRecord(fieldName, value, start, anyMatch, caseSentitive, exactMatch);
			iof = store.indexOf(rec);
			if (iof === -1) break;
			recs.push(rec);
			start = iof+1;
		}
		return recs;
	},
	
	/**
	 * Finds the first matching Record in this Store by a function.
	 * @param {Ext.data.Store} store The data store.
	 * @param {Function} fn The function to be called. It will be passed the following parameters:
	 * @param {Ext.data.Model} fn.record The record to test for filtering. Access field values using {@link Ext.data.Model#get}.
	 * @param {Object} fn.id The ID of the Record passed.
	 * @param {Object} [scope] The scope (this reference) in which the function is executed. Defaults to this Store.
	 * @param {Number} [start=0] The index at which to start searching.
	 * @returns {Ext.data.Model} The matched record, null if no record is found for matched index, otherwise undefined.
	 */
	findRecordBy: function(store, fn, scope, start) {
		var ridx, rec;
		if (store && store.isStore) {
			ridx = store.findBy(fn, scope, start);
			if (ridx !== -1) {
				rec = store.getAt(ridx);
			}
		}
		return rec;
	},
	
	/**
	 * Wrapper method for {@link Ext.data.Model#getData}. Like the original one, 
	 * it gets all values for each field in this model and returns an object 
	 * containing the current data.
	 * @param {Ext.data.Model} rec The record/model to use as source.
	 * @param {Object} opts An object containing options describing the data desired.
	 * All options declared in wrapped method are valid. If undefined simply 
	 * returns data as the original method with `true` param.
	 * @param {Boolean} [opts.ignoreId=false] Pass `true` to remove model's 
	 * idProperty value from result set.
	 * @returns {Object} An object containing all the values in this model.
	 */
	getModelData: function(rec, opts) {
		if (rec.isModel) {
			if (opts === undefined) {
				return rec.getData(true);
			} else {
				var data = rec.getData(opts);
				if (opts.ignoreId === true) {
					delete data[rec.getIdProperty()];
				}
				return data;
			}
		}
		return null;
	},
	
	/**
	 * Sets model's field value using passed data, under certain conditions: 
	 * current value is undefined/null or is equal to field's default value.
	 * It will always be set if force options is active.
	 * Unless specified, model's dirty status will not be altered.
	 * @param {Ext.data.Model} model The model/record.
	 * @param {String} name The field name to set.
	 * @param {Mixed} defValue The value to set.
	 * @param {Object} [opts] An object containing options.
	 * @param {Boolean} [opts.force=false] Set to `true` to force setting value.
	 * @param {Boolean} [opts.dirty=false] Set to `true` to set the dirty status.
	 * @returns {undefined}
	 */
	setModelDefaultValueIf: function(model, name, defValue, opts) {
		opts = opts || {};
		if (model && model.isModel && Ext.isString(name)) {
			var field = model.getField(name), value;
			if (field) {
				value = model.get(name);
				if (!!opts.force || (value == null || field.getDefaultValue() === value)) {
					model.set(name, defValue, {dirty: Ext.isBoolean(opts.dirty) ? opts.dirty : false});
				}
			}
		}
	},
	
	/**
	 * Returns an array of values for a given set of fields.
	 * @param {Ext.data.Model} rec The record/model to use as source.
	 * @param {String[]|String} fieldNames Names whose values will be extracted.
	 * @returns {Mixed[]} An array of specified field values.
	 */
	modelMultiGet: function(rec, fieldNames) {
		var arr = [],
				names = Ext.isString(fieldNames) ? [fieldNames] : fieldNames;
		if (Ext.isArray(names)) {
			Ext.iterate(names, function(name) {
				arr.push(rec.get(name));
			});
		}
		return arr;
	},
	
	/**
	 * Clones the passed Model.
	 * @param {Ext.data.Model} rec The record/model to be cloned.
	 * @param {Object} opts An object containing options.
	 * @param {Boolean} [opts.modifications=true] Set to `false` to model's modifications (see {@link #modelReset}).
	 * @returns {Ext.data.Model}
	 */
	modelClone: function(rec, opts) {
		opts = opts || {};
		if (rec.isModel) {
			if (opts.modifications === false) {
				return this.modelReset(rec.clone(), {dirty: true, modified: true, previousValues: true});
			} else {
				return rec.clone();
			}
		}
		return undefined;
	},
	
	/**
	 * Resets the passed Model.
	 * @param {Ext.data.Model} rec The record/model to be reset.
	 * @param {Object} opts An object containing options.
	 * @param {Boolean} [opts.dirty=false] Set to `true` to reset dirty status.
	 * @param {Boolean} [opts.modified=false] Set to `true` to clear {@link Ext.data.Model#modified} map.
	 * @param {Boolean} [opts.previousValues=false] Set to `true` to clear {@link Ext.data.Model#previousValues} map.
	 * @param {Boolean} [opts.all=false] Set to `true` to apply all resets above.
	 * @returns {Ext.data.Model} Itself
	 */
	modelReset: function(rec, opts) {
		opts = opts || {};
		if (rec.isModel) {
			if (opts.all === true || opts.dirty === true) rec.dirty = false;
			if (opts.all === true || opts.modified === true) delete rec.modified;
			if (opts.all === true || opts.previousValues === true) delete rec.previousValues;
		}
		return rec;
	},
	
	/**
	 * Collects underlying values of passed record collection.
	 * @param {Ext.data.Store|Ext.data.Model[]} coll A {@link Ext.data.Store} or an array of {@link Ext.data.Model records} to use as source.
	 * @param {String} [fieldName] A custom field name to get, otherwise {@link Ext.data.Model#getId} will be used.
	 * @param {Function} [filterFn] A custom filter function which is passed each item in the collection. Should return `true` to accept each item or `false` to reject it.
	 * @param {Function} [valueFn] A custom function which is passed each candidate value that allow to modify value before actually adding to the collection. It MUST return the value to be added, otherwise `undefined` means to skip the insertion.
	 * @param {Object} [scope] The scope (`this` reference) in which the `filterFn` function will be called.
	 * @returns {Mixed[]} An array of collected id values.
	 */
	collectValues: function(coll, fieldName, filterFn, valueFn, scope) {
		if (arguments.length >= 2 && arguments.length <= 3) {
			if (Ext.isFunction(fieldName)) {
				filterFn = fieldName;
				fieldName = undefined;
			}
		}
		var me = this,
			loopFn = function(rec) {
				if (!Ext.isFunction(filterFn) || Ext.callback(filterFn, scope || me, [rec]) === true) {
					var candidate = Ext.isEmpty(fieldName) ? rec.getId() : rec.get(fieldName), actual;
					if (Ext.isFunction(valueFn)) {
						actual = Ext.callback(valueFn, scope || me, [candidate]);
						if (actual !== undefined) ids.push(actual);
					} else {
						ids.push(candidate);
					}
				}
				/*
				if (!filterFn || Ext.callback(filterFn, scope || me, [rec])) {
					ids.push(Ext.isEmpty(fieldName) ? rec.getId() : rec.get(fieldName));
				}
				*/
			},
			ids = [];
		
		if (Ext.isArray(coll)) {
			Ext.iterate(coll, loopFn);
		} else if (coll.isStore) {
			coll.each(loopFn, this, {filtered: true});
		}
		return ids;
	},
	
	getDuplValue: function(coll, fieldName, value, patt) {
		if (arguments.length < 4) patt = '{0}_{1}';
		var me = this,
				vals = me.collectValues(coll, fieldName),
				copied, i;
		for (i = 1; i < 100; i++) {
			copied = Ext.String.format(patt, value, i);
			if (vals.indexOf(copied) === -1) return copied;
		}
		return undefined;
	}
});
