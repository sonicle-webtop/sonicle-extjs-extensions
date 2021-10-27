/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 */
Ext.define('Sonicle.Data', {
    singleton: true,
	
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
	 * @param {Object} [scope] The scope (`this` reference) in which the `filterFn` function will be called.
	 * @returns {Mixed[]} An array of collected id values.
	 */
	collectValues: function(coll, fieldName, filterFn, scope) {
		if (arguments.length >= 2 && arguments.length <= 3) {
			if (Ext.isFunction(fieldName)) {
				filterFn = fieldName;
				fieldName = undefined;
			}
		}
		var me = this,
			loopFn = function(rec) {
				if (!filterFn || Ext.callback(filterFn, scope || me, [rec])) {
					ids.push(Ext.isEmpty(fieldName) ? rec.getId() : rec.get(fieldName));
				}
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
	},
	
	/**
	 * Returns an array of Records of the specified IDs.
	 * A null element will be added in case the Record is missing for an ID.
	 * @param {Ext.data.Store} store The data store.
	 * @param {Mixed[]} ids Array of IDs for which to collect records.
	 * @returns {Ext.data.Model[]}
	 */
	getByIds: function(store, ids) {
		var ret = [], rec;
		Ext.iterate(ids, function(id) {
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
	}
});
