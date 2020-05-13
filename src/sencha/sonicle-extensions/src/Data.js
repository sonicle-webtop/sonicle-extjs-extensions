/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 */
Ext.define('Sonicle.Data', {
    singleton: true,
	
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
	 * Finds the matching Records in the store by a specific field value.
	 * When store is filtered, finds records only within filter.
	 * 
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
