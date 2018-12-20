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
		'Sonicle.grid.ViewDragZone',
		'Sonicle.grid.ViewDropZone'
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
	 * @cfg {String/String[]} [dropGroup]
	 * The {@link #ddGroup} to which the DropZone will belong.
	 * 
	 * This defines which other DragZones the DropZone will interact with. Drag/DropZones only interact with other
	 * Drag/DropZones which are members of the same {@link #ddGroup}.
	 */
	
	/**
	 * @cfg {Boolean} enableDrag 
	 * `false` to disallow dragging items from the View.
	 */
	enableDrag: true,
	
	/**
	 * @cfg {Boolean} enableDrop 
	 * `false` to disallow dropping items from the View.
	 */
	enableDrop: true,
	
	/**
	 * `true` to register this container with the Scrollmanager for auto scrolling during drag operations.
	 * A {@link Ext.dd.ScrollManager} configuration may also be passed.
	 * @cfg {Object/Boolean} containerScroll
	 */
	containerScroll: false,
	
	/**
	 * @template
	 * A `true` function by default, but provided so that you can disable dragging 
	 * under some custom conditions.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Ext.data.Model} record The record mousedowned upon.
	 * @param {HTMLElement} item The grid row mousedowned upon.
	 * @param {Ext.event.Event} e The mousedown event.
	 * @return {Boolean} `false` to disallow dragging, `true` otherwise
	 */
	isDragAllowed: Ext.returnTrue,
	
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
	
	/**
	 * @template
	 * A `true` function by default, but provided so that you can disable dragging 
	 * under some custom conditions.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Ext.data.Model} record The record mouseovered upon.
	 * @param {HTMLElement} item The grid row mouseovered upon.
	 * @param {Object} data The drag data.
	 * @param {Ext.event.Event} e The mouseover event.
	 * @return {Boolean} `false` to disallow dropping, `true` otherwise
	 */
	isDropAllowed: Ext.returnTrue,
	
	/**
	 * @template
	 * A function to effectively handle the data/record involved in drag operation.
	 * @param {Object} data The drag data.
	 * @param {Ext.data.Model} overRecord The Model over which the drop gesture took place.
	 * @param {String} dropPosition `"before"` or `"after"` depending on whether the cursor is above or below the mid-line of the node.
	 */
	handleNodeDrop: Ext.emptyFn,
	
	/**
	 * @property {Sonicle.grid.DragZone} dragZone
	 * An DragZone which handles mousedown and dragging of records from the grid.
	 */
	
	/**
	 * @property {Ext.grid.ViewDropZone} dropZone
	 * An DropZone which handles mouseover and dropping records in any grid which shares the same {@link #dropGroup}.
	 */
	
	init: function(view) {
		view.on('render', this.onViewRender, this, {single: true});
	},
	
	destroy: function() {
		var me = this;
		me.dragZone = Ext.destroy(me.dragZone);
		me.dropZone = Ext.destroy(me.dropZone);
		me.callParent();
	},
	
	enable: function() {
		var me = this;
		if (me.dragZone) {
			me.dragZone.unlock();
		}
		if (me.dropZone) {
			me.dropZone.unlock();
		}
		me.callParent();
	},
	
	disable: function() {
		var me = this;
		if (me.dragZone) {
			me.dragZone.lock();
		}
		if (me.dropZone) {
			me.dropZone.lock();
		}
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
			me.dragZone = new Sonicle.grid.ViewDragZone(Ext.apply({
				view: view,
				ddGroup: me.dragGroup || me.ddGroup,
				containerScroll: me.containerScroll,
				scrollEl: scrollEl,
				isDragAllowed: me.isDragAllowed,
				getDragItemData: me.getDragData,
				getDragItemText: me.getDragText
			}, me.dragZone));
		}
		if (me.enableDrop) {
			var group = (Ext.isArray(me.dropGroup) && (me.dropGroup.length > 0)) ? me.dropGroup[0] : me.dropGroup;
			me.dropZone = new Sonicle.grid.ViewDropZone(Ext.apply({
				view: view,
				ddGroup: group || me.ddGroup,
				isDropAllowed: me.isDropAllowed,
				handleNodeDrop: me.handleNodeDrop
			}, me.dropZone));
			// Adds remaining groups to the drop zone
			if (Ext.isArray(me.dropGroup)) {
				for (var i=1; i<me.dropGroup.length; i++) {
					me.dropZone.addToGroup(me.dropGroup[i]);
				}
			}
				
		}
	}
});
