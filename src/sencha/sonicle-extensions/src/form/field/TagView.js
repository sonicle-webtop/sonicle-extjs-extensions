/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.TagView', {
	extend: 'Sonicle.form.field.Tag',
	alias: 'widget.sotagviewfield',
	
	componentCls: 'so-tagfield so-tagviewfield',
	
	inputDisarmedCls: 'so-tagviewfield-input-disarmed',
	
	growMaxLines: 2,
	
	config: {
		/**
		 * @cfg {Ext.data.Store} itemsStore
		 * The Store that this field should use as its data source.
		 * Warning: although you are using this, also the {@link #store} needs to 
		 * be provided (not empty), otherwise items will NOT be displayed.
		 * So, if you do NOT provide a value for it, setting an {@link #itemsStore} 
		 * will also set the same value for {@link #store}.
		 * In this case {@link #displayField} and {@link #valueField} will be forced 
		 * to {@link #itemsDisplayField} and {@link #itemsValueField} respectively.
		 */
		itemsStore: null
	},
	
	/**
	 * @cfg {Boolean} disablePicker
	 * Set to `true` to disable picker. Following configs will be set automatically:
	 *  - {@link #hideTrigger} : `true`
	 *  - {@link #triggerOnClick} : `false`
	 *  - {@link #forceSelection} : `false`
	 */
	disablePicker: false,
	
	/**
	 * @cfg {String} itemsValueField
	 * The underlying {@link Ext.data.Field#name data field name} of {@link #itemsStore} 
	 * that holds values of this field: this is needed in order to lookup same 
	 * records between the two stores. Required.
	 */
	
	/**
	 * @cfg {String} itemsDisplayField (required, if editing is enabled)
	 * The underlying {@link Ext.data.Field#name data field name} of {@link #itemsStore} 
	 * that holds display values of this field: this is needed in order to edit 
	 * same fields between the two stores. Defaults to {#itemsValueField}.
	 */
	
	/**
	 * @cfg {Function} itemsStoreRecordCreator
	 * A function which is used as a record creation function when a new entry is 
	 * being created for appending to items Store (that holds selected items). This 
	 * is useful to customize data: eg. setting some defaults or implement custom logic.
	 * @param {Object} data Raw data to transform into a record.
	 * @param {Function} Model Model constructor to create a record from the passed data.
	 * @return {Ext.data.Model} The resulting new Model instance.
	 */
	
	/**
	 * @cfg {Function} valuesStoreRecordCreator
	 * A function which is used as a record creation function.
	 * @param {Object} data Raw data to transform into a record.
	 * @param {Function} Model Model constructor to create a record from the passed data.
	 * @return {Ext.data.Model} The resulting new Model instance.
	 */
	
	/**
	 * @event itemadd
	 * Fires when the record associated with tag item is removed.
	 * @param {Sonicle.field.TagView} tag This component.
	 * @param {Ext.data.Model} record The record of {@link #itemsStore} removed.
	 */
	
	/**
	 * @deprecated
	 * 
	 * @event beforeitemremove
	 * Fires when the record associated with tag item is being removed. Return false to cancel the action.
	 * @param {Sonicle.field.TagView} tag This component.
	 * @param {Ext.data.Model} record The record of {@link #itemsStore} being removed.
	 */
	
	/**
	 * @event itemremove
	 * Fires when the record associated with tag item is removed.
	 * @param {Sonicle.field.TagView} tag This component.
	 * @param {Ext.data.Model} record The record of {@link #itemsStore} removed.
	 */
	
	updatingItemsStore: 0,
	
	constructor: function(cfg) {
		var me = this,
			icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, ['disablePicker']);
		if (icfg.disablePicker === true) {
			// We need to hide triggers here: seems that applying setting in initComponent is too late!
			cfg.hideTrigger = true;
			cfg.triggerOnClick = false;
			cfg.forceSelection = false;
		}
		me.callParent([cfg]);
	},
	
	onDestroy: function() {
		var me = this;
		me.setItemsStore(null);
		me.callParent();
	},
	
	applyItemsStore: function(store) {
		if (store) {
			store = Ext.data.StoreManager.lookup(store);
		}
		return store;
	},
	
	updateItemsStore: function(newStore, oldStore) {
		var me = this,
			store = me.store;
		if (newStore && !oldStore) {
			if (!store || store.isEmptyStore) {
				me.valueField = me.itemsValueField;
				me.displayField = me.itemsDisplayField || me.itemsValueField;
				me.setStore(newStore);
			}
			newStore.on({
				scope: me,
				load: me.onItemsStoreUpdateEvents,
				datachanged: me.onItemsStoreUpdateEvents
			});
			me.pupulateFromItemsStore(newStore);
			
		} else if (!newStore && oldStore) {
			oldStore.un({
				scope: me,
				load: me.onItemsStoreUpdateEvents,
				datachanged: me.onItemsStoreUpdateEvents
			});
			if (store && store.getId() === oldStore.getId()) me.setStore(null);
		}
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Base#getSubTplData}:
	 *  - if picker is disabled, push an extra CSS class on inputEl
	 */
	getSubTplData: function(fieldData) {
		var me = this,
			data = me.callParent(arguments);
		if (me.disablePicker) {
			data.fixCls = data.fixCls + ' ' + me.inputDisarmedCls;
		}
		return data;
	},
	
	/**
	 * Overrides original {@link Ext.form.field.ComboBox#onTriggerClick}:
	 *  - if picker is disabled, prevent trigger opening when DOWN arrow is pressed
	 */
	onTriggerClick: function(comboBox, trigger, e) {
		if (!this.disablePicker) {
			this.callParent(arguments);
		}
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#onKeyDown}:
	 *  - if picker is disabled, propagate only some special keys events, stop all others
	 */
	onKeyDown: function(e) {
		var me = this;
		if (me.disablePicker === true) {
			var key = e.getKey(),
				isDelete = key === e.BACKSPACE || key === e.DELETE,
				isRename = key === e.F2,
				isNavigation = key === e.RIGHT || key === e.LEFT,
				isSelection = key === e.A && e.ctrlKey;

			if (isDelete || isRename || isNavigation || isSelection) {
				me.callParent(arguments);
			} else {
				e.stopEvent();
			}
		} else {
			me.callParent(arguments);
		}	
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#setValue}:
	 *  - disarm method, there is no need to call it!
	 */
	setValue: function(value, add, skipLoad) {
		var me = this,
			caller = me.setValue.caller;
		
		if (me.getSuperclass('Sonicle.form.field.Tag').onKeyUp === caller) {
			// This is called when multiselect is enabled and a new text 
			// is typed or a string is pasted into the field
			me.superclassSetValue(value, add, skipLoad);
			
		} else if (me.getSuperclass('Ext.form.field.Base').initValue === caller 
				|| me.getSuperclass('Ext.form.field.ComboBox').setValueOnData === caller) {
			// Skip super call here! ...and do NOT warn!
		} else {
			Ext.log.warn('There is NO need to call setValue within this component: selection will automatically reflect store items.');
		}
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#onValueCollectionEndUpdate}:
	 *  - support adding record to store
	 */
	onValueCollectionEndUpdate: function() {
		var me = this,
			isUpdating = me.isSelectionUpdating(),
			valueStore = me.valueStore,
			oldRecs;
		
		if (!isUpdating) { // If updating, parent call will return soon!
			// Dump current records before calling parent...
			oldRecs = valueStore.getRange();
		}
		me.callParent();
		if (!isUpdating && oldRecs) { // If updating, parent call will return soon!
			var newRecs = valueStore.getRange(),
				oldIIds = Ext.Array.toMap(oldRecs, function(rec) { return rec.internalId; }),
				newIIds = Ext.Array.toMap(newRecs, function(rec) { return rec.internalId; });
			
			Ext.iterate(oldRecs, function(rec) {
				if (!newIIds[rec.internalId]) {
					me.doItemRemove(rec);
				}
			});
			Ext.iterate(newRecs, function(rec) {
				if (!oldIIds[rec.internalId]) {
					me.doItemAdd(rec);
				}
			});
		}
	},
	
	privates: {
		superclassSetValue: function(value, add, skipLoad) {
			return this.getSuperclass('Sonicle.form.field.Tag').setValue.apply(this, arguments);
		},
		
		onItemEditingComplete: function(valueInternalId, newValue, oldValue) {
			// Here we need to update the itemsStore, NOT the store like in superclass!
			var me = this,
				valueField = me.valueField || me.displayField,
				itemsDisplayField = me.itemsDisplayField,
				itemsStore = me.itemsStore,
				rec = me.valueStore.getByInternalId(valueInternalId),
				itemRec;
			
			if (rec && itemsStore) {
				itemRec = itemsStore.findRecord(me.itemsValueField, rec.get(valueField));
				if (itemRec && me.fireEvent('beforeitemedit', me, itemRec, newValue, oldValue) !== false) {
					if (Ext.isString(itemsDisplayField)) itemRec.set(itemsDisplayField, newValue);
					me.fireEvent('itemedit', me, itemRec, newValue, oldValue);
				}
			}
		},
		
		onItemsStoreUpdateEvents: function(store) {
			if (this.updatingItemsStore === 0) {
				this.pupulateFromItemsStore(store);
			}
		},
		
		doItemAdd: function(valueRec) {
			var me = this,
				valueField = me.valueField || me.displayField,
				itemsValueField = me.itemsValueField,
				itemsDisplayField = me.itemsDisplayField,
				itemsStore = me.itemsStore,
				data, itemRec;

			if (itemsStore && valueRec) {
				itemRec = Ext.callback(me.itemsStoreRecordCreator, me, [valueRec.data, itemsStore.getModel()]);
				if (!itemRec) {
					data = {};
					data[itemsValueField] = valueRec.get(valueField);
					if (Ext.isString(itemsDisplayField)) data[itemsDisplayField] = valueRec.get(me.displayField);
					itemRec = itemsStore.createModel(data);
				}
				me.updatingItemsStore++;
				itemsStore.add(itemRec);
				me.updatingItemsStore--;
				me.fireEvent('itemadd', me, itemRec);
			}
		},
		
		doItemRemove: function(valueRec) {
			var me = this,
				valueField = me.valueField || me.displayField,
				itemsValueField = me.itemsValueField,
				itemsStore = me.itemsStore,
				itemRec;
			
			if (itemsStore && valueRec) {
				itemRec = itemsStore.findRecord(itemsValueField, valueRec.get(valueField));
				if (itemRec) {
					me.updatingItemsStore++;
					itemsStore.remove(itemRec);
					me.updatingItemsStore--;
					me.fireEvent('itemremove', me, itemRec);
				}
			}	
		},
		
		pupulateFromItemsStore: function(itemsStore) {
			var me = this,
				displayField = me.displayField,
				valueField = me.valueField || displayField,
				itemsValueField = me.itemsValueField,
				itemsDisplayField = me.itemsDisplayField || itemsValueField,
				store = me.store,
				Model = store.getModel(),
				populateStore = store.getCount() <= 0 || !store.isLoaded(),
				valueStore = me.valueStore,
				valueRecs = [], recs = [],
				rec, ValueModel, valueRec, data;
			
			if (itemsStore && valueStore) {
				if (store.getId() === itemsStore.getId()) {
					// We have to automatically fill original store only if differs from itemsStore!
					populateStore = false;
				}
				ValueModel = valueStore.getModel();
				Ext.iterate(itemsStore.getRange(), function(itemRec) {
					if (populateStore) {
						data = {};
						data[valueField] = itemRec.get(itemsValueField);
						data[displayField] = itemRec.get(itemsDisplayField);
						rec = new Model(data);
						recs.push(rec);
					}
					valueRec = Ext.callback(me.valuesStoreRecordCreator, me, [itemRec.data, ValueModel]);
					if (!valueRec) {
						data = {};
						data[valueField] = itemRec.get(itemsValueField);
						data[displayField] = itemRec.get(itemsDisplayField);
						valueRec = new ValueModel(data);
					}
					valueRecs.push(valueRec);
				});
				
				if (recs.length > 0) {
					store.suspendEvents();
					store.loadRecords(recs);
					store.resumeEvents();
				}
				valueStore.suspendEvents();
				valueStore.loadRecords(valueRecs);
				valueStore.resumeEvents();
				me.superclassSetValue(valueRecs);
			}
		}
		
		/*
		setAllRecordsAsValue: function(store) {
			var me = this,
				SoS = Sonicle.String,
				values = [];
			store = store || me.itemsStore;
			if (store) {
				store.each(function(rec) {
					values.push(rec.get(me.itemsValueField));
				});
				me.superclassSetValue(SoS.deflt(SoS.join(me.delimiter, values), null));
			}
		}
		*/
	}
});
