/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Tag', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.sotagcolumn',
	
	config: {
		/**
		 * @cfg {Ext.data.Store} tagsStore
		 * The Store that this column should use as its data source
		 */
		tagsStore: null
	},
	
	/**
	 * @cfg {String} nameField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as name.
	 */
	nameField: 'name',
	
	/**
	 * @cfg {String} colorField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as color.
	 */
	colorField: 'color',
	
	/**
	 * @cfg {Number} [maxTags=-1]
	 * The maximum number of visible tags.
	 */
	maxTags: -1,
	
	sortable: false,
	groupable: false,
	
	tpl: [
		'<tpl for="tags">',
			'<span style="color:{color};margin:0 0 0 2px" data-qtip="{tooltip}">',
				'<i class="fa fa-tag"></i>',
			'</span>',
		'</tpl>'
	],
	
	initComponent: function() {
		var me = this;
		me.tpl = (!Ext.isPrimitive(me.tpl) && me.tpl.compile) ? me.tpl : new Ext.XTemplate(me.tpl);
		me.hasCustomRenderer = true;
		me.callParent(arguments);
	},
	
	doDestroy: function() {
		this.setStore(null);
		this.callParent();
	},
	
	applyTagsStore: function(store) {
		if (store) {
			store = Ext.data.StoreManager.lookup(store);
		}
		return store;
	},
	
	defaultRenderer: function(val, meta, rec, ridx, cidx, sto) {
		return this.tpl.apply(this.prepareTplData(val));
	},
	
	updater: function(cell, val, rec) {
		cell.firstChild.innerHTML = this.tpl.apply(this.prepareTplData(val));
	},
	
	prepareTplData: function(tags) {
		var me = this;
		//TODO: handle store not ready case -> issue view update after the first load!
		return {
			tags: Sonicle.grid.column.Tag.buildTagsData(me.tagsStore, me.nameField, me.colorField, me.maxTags, tags)
		};
	},
	
	statics: {
		buildTagsData: function(tagsStore, nameField, colorField, max, tags) {
			var ids = Sonicle.String.split(tags, '|'),
					arr = [];
			if ((ids.length > 0) && tagsStore) {
				Ext.iterate(ids, function(id) {
					if ((max !== -1) && (arr.length >= max)) return false;
					var rec = tagsStore.getById(id);
					if (rec) arr.push({color: rec.get(colorField), tooltip: rec.get(nameField)});
				});
			}
			return arr;
		}
	}
});
