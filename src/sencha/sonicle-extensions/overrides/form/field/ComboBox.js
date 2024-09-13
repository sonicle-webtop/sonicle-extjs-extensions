/**
 * Override original {@link Ext.form.field.ComboBox}
 * - Fix value NOT published when blurring-out quickly (remote + forceSelection false + value and display field set)	 WT-789
 * - Add autoLoadOnQuery option: initially load the store only when the first 
 *   query is issued (for eg. by clicking the trigger). Useful in situations where 
 *   you do not want to preload all data when initially displaying the field.
 * - Lookup single value record on setValue: when pagination is used, label may 
 *   NOT be decoded because the underlyning record may NOT be in the exact page 
 *   currently loaded into the Store. The beforeQuery override simply marks to 
 *   pass value to backend in the next Store load.
 * 
 * - (Ext 6.2 - seems the fix is not working anymore)
 *   Fix binding not updated (value remains outdated) under some circumstances 
 *   when forceSelection is `false` and queryMode is `local`:
 *    1) typing value and blurring out quickly from the field
 *    2) whole value is cleared out using Backspace or Canc when store is NOT loaded yet
 */
Ext.define('Sonicle.overrides.form.field.ComboBox', {
	override: 'Ext.form.field.ComboBox',
	
	/**
	 * @cfg {Boolean} autoLoadOnQuery
	 * This option controls whether to *initially* load the store when  
	 * a query is performed so that the display value can be determined 
	 * from the appropriate record.
	 * The store will only be loaded in a limited set of circumstances:
	 * - The store is not currently loading.
	 * - The store does not have a pending {@link Ext.data.Store#autoLoad}.
	 * - The store has not been loaded before.
	 * This is useful for eg. when combo has a value set, the store is not 
	 * loaded yet (autoLoad is false), and the user clicks on the trigger: 
	 * list is populated instead of displaying no values.
	 */
	autoLoadOnQuery: false,
	
	/**
	 * @cfg {String} [valueParam="id"]
	 * The name of the 'value' parameter to send in a request. Defaults to 'id'.
	 * Set this to `''` or null if you don't want to disable this feature.
	 */
	valueParam: 'id',
	
	doQueryTaskCount: 0,
	lastDoQueryTaskCount: 0,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.doQueryTask = new Ext.util.DelayedTask(Ext.Function.createInterceptor(me.doRawQuery, function() {
			me.doQueryTaskCount++;
		}), me);
		Ext.Function.interceptBefore(me.doQueryTask, 'delay', function() {
			me.lastDoQueryTaskCount = me.doQueryTaskCount;
		});
		me.loadStoreBuffered = Ext.Function.createBuffered(me.doLoadStore, 100);
	},
	
	/**
	 * Loads the underlyning Store buffering the method-call.
	 * @param {Object} [options] Loading options; see {@link Ext.data.ProxyStore#load}.
	 */
	loadStore: function(options) {
		this.loadStoreBuffered(options);
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 */
	onBlur: function(e) {
		var me = this,
				inputEl = me.inputEl.dom;
		if (!me.forceSelection && me.queryMode === 'remote' && me.hasBindingValue && inputEl) {
			// When remote queries are enabled (remote queryMode) and the user can 
			// type in the field, if blur occurs too quickly after typing some text, 
			// not letting doQuery run (blur occurs before queryDelay value elapsed), 
			// the published value may NOT be updated. See WT-789 for more info!
			if (me.doQueryTaskCount === me.lastDoQueryTaskCount) {
				me.publishValue();
			}
		}
		me.callParent(arguments);
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 */
	beforeQuery: function(queryPlan) {
		var me = this,
			qp = me.callParent(arguments),
			store, unloaded;
		
		if (!qp.cancel) { // if not already vetoed
			store = queryPlan.combo.getStore();
			unloaded = !store.isLoaded() && !store.hasPendingLoad();
			if (me.autoLoadOnQuery && unloaded) {
				qp.cancel = true;
				store.load({
					callback: function(recs, op, success) {
						if (success) me.doQuery(qp.query, qp.forceAll, qp.rawQuery);
					}
				});
			}
		}
		return qp;
	},
	
	getStoreListeners: function(store) {
		var me = this,
			result = me.callParent(arguments);
		if (result) {
			Ext.apply(result, {
				beforeload: me.onBeforeLoad
			});
		}
		return result;
	},
	
	onBeforeLoad: function(store, op) {
		var me = this, params;
		if (!Ext.isEmpty(me.valueParam) && me.injectValueOnLoad !== undefined) {
			params = op.getParams() || {};
			params[me.valueParam] = me.injectValueOnLoad;
			op.setParams(params);
			me.injectValueOnLoad = undefined;
		}
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 */
	doSetValue: function(value /* private for use by addValue */, add) {
		var me = this;
		
		// When pagination is active, label may NOT be decoded because the 
		// record underlined by the value set may NOT be in the exact page 
		// loaded into the store: remote code can simply return only data 
		// targeted by current value.
		if (!Ext.isEmpty(value) && !Ext.isEmpty(me.valueParam) && me.queryMode === 'remote' && me.pageSize > 0) {
			var store = me.getStore(),
				autoLoadOnValue = me.autoLoadOnValue,
				isLoaded = store.getCount() > 0 || store.isLoaded(),
				pendingLoad = store.hasPendingLoad(),
				unloaded = autoLoadOnValue && !isLoaded && !pendingLoad,
				isEmptyStore = store.isEmptyStore,
				parentWillForceLoading = unloaded && !isEmptyStore;
			
			// parentWillForceLoading will simply mock logic applied in the original 
			// doSetValue, in order to determine if a call to callParent will 
			// trigger a store.load()
			
			if (parentWillForceLoading) { // Store will be loaded by parent method
				// We can simply mark to inject the value in next store load call.
				me.injectValueOnLoad = value;
				
			} else { // Store won't be loaded by parent method: check if record is present otherwise issue a load
				var rec = me.findRecordByValue(value);
				if (!rec) {
					me.injectValueOnLoad = value;
					store.load();
				}
			}
		}
		return me.callParent(arguments);
	},
	
	privates: {
		doLoadStore: function(options) {
			var store = this.getStore();
			if (store) store.load(options);
		}
	}
	
	/*
	onTriggerClick: function(comboBox, trigger, e) {
		var me = this,
			oldAutoSelect;
		
		if (!me.readOnly && !me.disabled) {
			if (me.isExpanded) {
				me.collapse();
				// Hide keyboard for touch devices when the picker list is collapsed
				if (e && e.pointerType !== 'mouse') {
					trigger.getEl().focus();
				}
			} else {
				// Alt-Down arrow opens the picker but does not select items:
				// http://www.w3.org/TR/wai-aria-practices/#combobox
				if (e && e.type === 'keydown' && e.altKey) {
					oldAutoSelect = me.autoSelect;
					me.autoSelect = false;
					me.expand();
					me.autoSelect = oldAutoSelect;
				} else {
					var store = me.getStore(),
						callDoQuery = function() {
							if (me.triggerAction === 'all') {
								me.doQuery(me.allQuery, true);
							} else if (me.triggerAction === 'last') {
								me.doQuery(me.lastQuery, true);
							} else {
								me.doQuery(me.getRawValue(), false, true);
							}
						};
					if (store && me.autoLoadOnTriggerClick && !store.isLoaded()) {
						store.load({
							callback: function(recs, op, success) {
								if (success) callDoQuery();
							}
						});
					} else {
						callDoQuery();
					}
				}
			}
			if (me.forceResetCaret && me.inputEl) {
				me.setCaretPos(0);
			}
		}
	}
	*/
	
	//Ext 7.4 - removing fix that may not work anymore
	/*onBlur: function() {
		var me = this,
				sto = me.getStore();
		if (!me.destroying && sto) {
			if (!me.forceSelection && me.queryMode !== 'local') {
				if (Ext.isEmpty(me.getValue()) && !sto.isLoaded()) { // case 2
					me.publishValue();
				} else { // case 1
					me.checkChange();
				}
			}
		}
		me.callParent(arguments);
	}*/
});
