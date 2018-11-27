/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.plugin.DragDrop', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sogridviewdragdrop',
	uses: [
		'Sonicle.grid.DragZone'
	],
	
	/**
	 * @cfg {String} [ddGroup=soGridDD]
	 * A named drag drop group to which this object belongs. If a group is specified, 
	 * then both the DragZones and DropZone used by this plugin will only interact 
	 * with other drag drop objects in the same group.
	 */
	ddGroup : "soGridDD",
	
	/**
	 * @cfg {String} [dragGroup]
	 * The {@link #ddGroup} to which the DragZone will belong.
	 * 
	 * This defines which other DropZones the DragZone will interact with.
	 * Drag/DropZones only interact with other Drag/DropZones which are members 
	 * of the same {@link #ddGroup}.
	 */
	
	/**
	 * @cfg {Boolean} enableDrag 
	 * `false` to disallow dragging items from the View.
	 */
	enableDrag: true,
	
	/**
	 * `true` to register this container with the Scrollmanager for auto scrolling during drag operations.
	 * A {@link Ext.dd.ScrollManager} configuration may also be passed.
	 * @cfg {Object/Boolean} containerScroll
	 */
	containerScroll: false,
	
	/**
	 * @template
	 * An false function by default, but provided so that you can disable dragging 
	 * below some custom conditions.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Ext.data.Model} record The record mousedowned upon.
	 * @param {HTMLElement} item The grid row mousedowned upon.
	 * @param {Ext.event.Event} e The mousedown event.
	 * @return {Boolean} `true` to disallow dragging, `false` otherwise
	 */
	isDragDisallowed: Ext.returnFalse,
	
	/**
	 * @template
	 * An empty function by default, but provided so that you can return custom
	 * data to append into original dragData object.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Object} data The original dragData object.
	 * @return {Object} New data to append
	 */
	getDragData: Ext.emptyFn,
	
	/**
	 * @template
	 * An empty function by default, but provided so that you can specify a custom drag text.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Object} data The original dragData object.
	 * @return {String} The drag text to display
	 */
	getDragText: Ext.emptyFn,
	
	init: function(view) {
		view.on('render', this.onViewRender, this, {single: true});
	},
	
	destroy: function() {
		var me = this;
		me.dragZone = Ext.destroy(me.dragZone);
		//me.dropZone = Ext.destroy(me.dropZone);
		me.callParent();
	},
	
	enable: function() {
		var me = this;
		if (me.dragZone) {
			me.dragZone.unlock();
		}
		/*
		if (me.dropZone) {
			me.dropZone.unlock();
		}
		*/
		me.callParent();
	},
	
	disable: function() {
		var me = this;
		if (me.dragZone) {
			me.dragZone.lock();
		}
		/*
		if (me.dropZone) {
			me.dropZone.lock();
		}
		*/
		me.callParent();
	},
	
	onViewRender : function(view) {
		var me = this,
				ownerGrid = view.ownerCt.ownerGrid || view.ownerCt,
				scrollEl;
		
		ownerGrid.relayEvents(view, ['beforedrop', 'drop']);
		if (me.enableDrag) {
			if (me.containerScroll) {
				scrollEl = view.getEl();
			}
			me.dragZone = new Sonicle.grid.DragZone(Ext.apply({
				view: view,
				ddGroup: me.dragGroup || me.ddGroup,
				containerScroll: me.containerScroll,
				scrollEl: scrollEl,
				isDragDisallowed: me.isDragDisallowed,
				getDragItemData: me.getDragData,
				getDragItemText: me.getDragText
			}, me.dragZone));
		}
	}
});