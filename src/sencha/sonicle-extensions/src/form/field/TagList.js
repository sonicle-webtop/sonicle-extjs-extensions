/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 * @deprecated in favor of TagView
 */
Ext.define('Sonicle.form.field.TagList', {
	extend: 'Sonicle.form.field.Tag',
	alias: 'widget.sotaglistfield',
	
	componentCls: 'so-tagfield so-taglistfield',
	
	growMaxLines: 2,
	
	/**
	 * @event beforeitemremove
	 * Fires when the record associated with tag item is being removed. Return false to cancel the action.
	 * @param {Sonicle.field.TagList} tag This component.
	 * @param {Ext.data.Model} record The record being removed.
	 */
	
	/**
	 * @event itemremove
	 * Fires when the record associated with tag item is removed.
	 * @param {Sonicle.field.TagList} tag This component.
	 * @param {Ext.data.Model} record The record removed.
	 */
	
	constructor: function(cfg) {
		var me = this;
		Ext.apply(cfg || {}, {
			hideTrigger: true,
			triggerOnClick: false,
			forceSelection: true
		});
		me.callParent([cfg]);
	},
	
	onBindStore: function(store) {
		var me = this;
		me.callParent(arguments);
		if (store) {
			store.on({
				scope: me,
				load: me.onStoreUpdateEvents,
				add: me.onStoreUpdateEvents,
				remove: me.onStoreUpdateEvents,
				update: me.onStoreUpdateEvents,
				clear: me.onStoreUpdateEvents
			});
			me.setAllRecordsAsValue(store);
		}
	},
	
	onUnbindStore: function(store) {
		var me = this;
		store.un({
			scope: me,
			load: me.onStoreUpdateEvents,
			add: me.onStoreUpdateEvents,
			remove: me.onStoreUpdateEvents,
			update: me.onStoreUpdateEvents,
			clear: me.onStoreUpdateEvents
		});
		me.callParent(arguments);
	},
	
	/**
	 * Overrides original {@link Ext.form.field.ComboBox#onTriggerClick}:
	 *  - prevent trigger opening when DOWN arrow is pressed
	 */
	onTriggerClick: function(comboBox, trigger, e) {
		// Do NOT call original onTriggerClick
		//this.callParent(arguments);
		return;
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#onKeyDown}:
	 *  - propagate only some special keys events, stop all others
	 */
	onKeyDown: function(e) {
		var me = this,
			key = e.getKey(),
			isDelete = key === e.BACKSPACE || key === e.DELETE,
			isRename = key === e.F2,
			isNavigation = key === e.RIGHT || key === e.LEFT,
			isSelection = key === e.A && e.ctrlKey;
		
		if (isDelete || isRename || isNavigation || isSelection) {
			me.callParent(arguments);
		} else {
			e.stopEvent();
		}
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#setValue}:
	 *  - disarm method, there is no need to call it!
	 */
	setValue: function(value, add, skipLoad) {
		var caller = this.setValue.caller;
		if (caller && !caller.toString().indexOf('\'value\' in')) {
			// Do not warn for calls from {@link #Ext.form.field.Field#initValue}
			Ext.log.warn('There is NO need to call setValue within this component: selection will automatically reflect store items.');
		}
	},
	
	/**
	 * Overrides original {@link Ext.form.field.Tag#removeByListItemNode}:
	 *  - support removing record from store and firing events
	 */
	removeByListItemNode: function(itemEl) {
		var me = this,
			rec = me.getRecordByListItemNode(itemEl);
		
		me.callParent(arguments);
		if (rec) {
			if (rec && me.fireEvent('beforeitemremove', me, rec) !== false) {
				me.callParent(arguments);
				rec.store.remove(rec);
				me.fireEvent('itemremove', me, rec);
			}
		}
	},
	
	superclassSetValue: function(value, add, skipLoad) {
		return Sonicle.form.field.TagList.superclass.setValue.apply(this, arguments);
	},
	
	privates: {
		onStoreUpdateEvents: function(store) {
			this.setAllRecordsAsValue(store);
		},
		
		setAllRecordsAsValue: function(store) {
			var me = this,
				SoS = Sonicle.String,
				values = [];
			store = store || me.store;
			if (store) {
				store.each(function(rec) {
					values.push(rec.get(me.valueField));
				});
				me.superclassSetValue(SoS.deflt(SoS.join(me.delimiter, values), null));
			}
		}
	}
});
