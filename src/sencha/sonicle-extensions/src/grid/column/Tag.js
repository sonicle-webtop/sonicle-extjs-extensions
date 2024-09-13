/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Tag', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.sotagcolumn',
	requires: [
		'Sonicle.form.field.Tag'
	],
	
	config: {
		/**
		 * @cfg {Ext.data.Store} tagsStore
		 * The Store that this column should use as its data source
		 */
		tagsStore: null
	},
	
	/**
	 * @cfg {String} tagsValueField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as tag values.
	 */
	tagsValueField: 'tags',
	
	/**
	 * @cfg {Boolean} hideValueText
	 * `false` to display column's text value next to tags, {@link #dataIndex} will be used as source field.
	 */
	hideValueText: true,
	
	/**
	 * @cfg {Function} getValueText
	 * A function which returns the text to display next to tags icons.
	 */
	
	/**
	 * @cfg {String} tagNameField
	 * The underlying {@link Ext.data.Field#name data field name} of {@link #tagsStore} to bind as name.
	 */
	tagNameField: 'name',
	
	/**
	 * @cfg {String} tagColorField
	 * The underlying {@link Ext.data.Field#name data field name} of {@link #tagsStore} to bind as color.
	 */
	tagColorField: 'color',
	
	/**
	 * @cfg {String} emptyText
	 * The default text to place into an empty column.
	 */
	emptyText: '',
	
	/**
	 * @cfg {String} emptyCls
	 * The CSS class to apply to an empty column to style the **{@link #emptyText}**.
	 */
	
	/**
	 * @cfg {Number} [maxTags=-1]
	 * The maximum number of visible tags.
	 */
	maxTags: -1,
	
	/**
	 * @cfg {String} delimiter
	 * The character(s) used to separate tag values.
	 */
	delimiter: '|',
	
	sortable: false,
	groupable: false,
	
	tpl: [
		'<tpl if="textValue">',
		'<span>{textValue}</span>',
		'</tpl>',
		'<tpl if="emptyText">',
		'<span class="{emptyCls}">{emptyText}</span>',
		'</tpl>',
		'<tpl for="tags">',
		'<span style="color:{color};margin:0 0 0 2px" data-qtip="{name}">',
			'<i class="fas fa-tag"></i>',
		'</span>',
		'</tpl>'
	],
	
	initComponent: function() {
		var me = this;
		me.tpl = (!Ext.isPrimitive(me.tpl) && me.tpl.compile) ? me.tpl : new Ext.XTemplate(me.tpl);
		me.hasCustomRenderer = true;
		me.callParent(arguments);
	},
	
	onDestroy: function() {
		this.setTagsStore(null);
		this.callParent();
	},
	
	applyTagsStore: function(store) {
		if (store) {
			store = Ext.data.StoreManager.lookup(store);
		}
		return store;
	},
	
	defaultRenderer: function(val, meta, rec, ridx, cidx, sto) {
		return this.tpl.apply(this.prepareTplData(val, rec));
	},
	
	updater: function(cell, val, rec) {
		cell.firstChild.innerHTML = this.tpl.apply(this.prepareTplData(val, rec));
	},
	
	prepareTplData: function(val, rec) {
		var me = this,
				text = !me.hideValueText ? me.evalValue(val, rec, me.getValueText, me.dataIndex, null) : null,
				tags = rec.get(me.tagsValueField),
				empty = (Ext.isEmpty(tags) && !Ext.isEmpty(me.emptyText)) ? me.emptyText : null,
				emptyCls = !Ext.isEmpty(me.emptyCls) ? me.emptyCls : '';
		//TODO: handle store not ready case -> issue view update after the first load!
		return {
			textValue: text,
			emptyText: empty,
			emptyCls: emptyCls,
			tags: Sonicle.form.field.Tag.buildTagsData(me.tagsStore, me.tagNameField, me.tagColorField, me.maxTags, tags, me.delimiter)
		};
	},
	
	privates: {
		evalValue: function(value, rec, getFn, field, fallback) {
			if (rec && Ext.isFunction(getFn)) {
				return getFn.apply(this, [value, rec]);
			} else if (rec && !Ext.isEmpty(field)) {
				return rec.get(field);
			} else {
				return (fallback === undefined) ? value : fallback;
			}
		}
	}
});
