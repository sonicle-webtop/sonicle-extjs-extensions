/*
 * ExtJs UX
 * Copyright (C) 2023 Matteo Albinola
 * matteo.albinola[at]gmail.com
 * Inspired by https://bensmithett.github.io/dragster/
 */
Ext.define('Sonicle.mixin.DragOverMonitor', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'dragovermonitor'
	},
	
	/**
	 * @cfg {Boolean} monitorExtDrag
	 * Attach a monitor for built-in ExtJs dragging system based on drag/drop zones.
	 */
	monitorExtDrag: true,
	
	/**
	 * @cfg {String[]|String} ddGroups
	 * A set of groups to which the drop-zone belongs. If a group is specified, 
	 * then the target object will only interact with other drag drop objects 
	 * in the same group. Defaults to `default`.
	 */
	ddGroups: undefined,
	
	/**
	 * @cfg {Boolean} monitorBrowserDrag
	 * Attach a monitor for dragging of browser objects (eg. files, link, etc).
	 */
	monitorBrowserDrag: true,
	
	browserDrag: undefined,
	dropZone: undefined,
	
	/**
	 * @template
	 * Template method called after a dragging operation starts involving the Component.
	 * @param {Object} dragOp An object containing drag operation data:
	 * @param {Ext.event.Event} dragOp.event The drag event.
	 * @param {Ext.dd.DragSource} [dragOp.source] The drag source that was dragged over (if any).
	 * @param {Object} [dragOp.data] An object containing arbitrary data supplied by the drag source (if any).
	 */
	onDragOperationEnter: undefined,
	
	/**
	 * @template
	 * Template method called after a dragging operation stops involving the Component.
	 * @param {Object} dragOp An object containing drag operation data:
	 * @param {Ext.event.Event} dragOp.event The drag event.
	 * @param {Ext.dd.DragSource} [dragOp.source] The drag source that was dragged over (if any).
	 * @param {Object} [dragOp.data] An object containing arbitrary data supplied by the drag source (if any).
	 */
	onDragOperationLeave: undefined,
	
	/**
	 * @template
	 * Template method called when method {@link Ext.dd.DropZone#notifyEnter} 
	 * of configured DropZone is called.
	 * @param {Ext.dd.DragSource} source The drag source that was dragged.
	 * @param {Event} e The event.
	 * @param {Object} data An object containing arbitrary data supplied by the drag source.
	 * @return {String|Boolean} status The CSS class that communicates the drop status back, a boolean indicating the result (default CSS classes will be used). Default to success.
	 */
	onExtNotifyEnter: undefined,
	
	/**
	 * @template
	 * Template method called when method {@link Ext.dd.DropZone#onNodeOver} 
	 * of configured DropZone is called.
	 * @param {Object} node The custom data associated with the drop node.
	 * @param {Ext.dd.DragSource} source The drag source that was dragged.
	 * @param {Event} e The event.
	 * @param {Object} data An object containing arbitrary data supplied by the drag source.
	 * @return {String|Boolean} status The CSS class that communicates the drop status back, a boolean indicating the result (default CSS classes will be used). Default to success.
	 */
	onExtNodeOver: undefined,
	
	/**
	 * @template
	 * Template method called when method {@link Ext.dd.DropZone#onNodeDrop} 
	 * of configured DropZone is called.
	 * @param {Object} node The custom data associated with the drop node.
	 * @param {Ext.dd.DragSource} source The drag source that was dragged.
	 * @param {Event} e The event.
	 * @param {Object} data An object containing arbitrary data supplied by the drag source.
	 * @return {Boolean} The validity of the operation.
	 */
	onExtNodeDrop: undefined,
	
	/**
	 * Attach monitor to specified components in order to monitoring drag 
	 * operations involving component's main element.
	 * @param {Ext.Component} comp The target component.
	 */
	initDragMonitoring: function(comp) {
		var me = this,
			extDrag = !!me.monitorExtDrag;
			browserDrag = !!me.monitorBrowserDrag;
		
		me.initBrowserDrag();
		if (comp) {
			if (comp.rendered) {
				if (extDrag) me.dropZone = me.attachDropZone(comp);
				if (browserDrag) me.attachBrowserDragEvents(comp);
					
			} else {
				comp.on('render', function(s) {
					if (extDrag) me.dropZone = me.attachDropZone(s);
					if (browserDrag) me.attachBrowserDragEvents(s);
				}, me, {single: true});
			}
		}
	},
	
	/**
	 * Clears monitoring about specified component.
	 * @param {Ext.Component} comp The target component being monitored.
	 */
	cleanupDragMonitoring: function(comp) {
		var me = this;
		if (me.dropZone) me.dropZone = me.dropZone.destroy();
	},
	
	/**
	 * Resets monitoring: call this after drop!
	 */
	resetDragMonitoring: function() {
		this.initBrowserDrag();
	},
	
	privates: {
		attachDropZone: function(comp) {
			var me = this,
				ddGroups = Ext.Array.from(me.ddGroups),
				dddz;
			
			dddz = Ext.create('Ext.dd.DropZone', comp.getEl(), {
				ddGroup: ddGroups.length > 0 ? ddGroups[0] : undefined,
				getTargetFromEvent: function(e) {
					return true;
				},
				notifyEnter: function(source, e, data) {
					var ret = Ext.callback(me.onExtNotifyEnter, me, [source, e, data]);
					if (Ext.isString(ret)) {
						return ret;
					} else if (Ext.isBoolean(ret)) {
						return me.dropZoneStatusCls(source, ret);
					} else {
						return me.dropZoneStatusCls(source, true);
					}
				},
				onNodeEnter:function(node, source, e, data) {
					//console.log('dddz.onNodeEnter');
					Ext.callback(me.onDragOperationEnter, me, [{event: e, data: data, source: source}]);
				},
				onNodeOut:function(node, source, e, data) {
					//console.log('dddz.onNodeOut');
					Ext.callback(me.onDragOperationLeave, me, [{event: e, data: data, source: source}]);
				},
				onNodeOver:function(node, source, e, data) {
					//console.log('dddz.onNodeOver');
					var ret = Ext.callback(me.onExtNodeOver, me, [node, source, e, data]);
					if (Ext.isString(ret)) {
						return ret;
					} else if (Ext.isBoolean(ret)) {
						return me.dropZoneStatusCls(source, ret);
					} else {
						return me.dropZoneStatusCls(source, true);
					}
				},
				onNodeDrop: function(node, source, e, data) {
					//console.log('dddz.onNodeDrop');
					if (Ext.callback(me.onExtNodeDrop, me, [node, source, e, data]) === false) {
						return false;
					} else {
						return true;
					}
				}
			});
			for (var i=1; i<ddGroups.length; i++) {
				dddz.addToGroup(ddGroups[i]);
			}
			return dddz;
		},
		
		dropZoneStatusCls: function(source, isDropValid) {
			var obj = (source && source.proxy) ? source.proxy : source;
			return isDropValid ? obj.dropAllowed : obj.dropNotAllowed;
		},
				
		initBrowserDrag: function() {
			// See dragster for more info about first, second flags :)
			this.browserDrag = {first: false, second: false};
		},
		
		attachBrowserDragEvents: function(comp) {
			var me = this;
			comp.mon(comp.getEl(), {
				scope: me,
				dragenter: me._onElBrowserDragEnter,
				dragleave: me._onElBrowserDragLeave,
				drop: me._onElBrowserDragLeave
			});
		},
		
		_onElBrowserDragEnter: function(e) {
			var me = this,
				bdrag = me.browserDrag;
			
			if (bdrag.first) {
				bdrag.second = true;
			} else {
				bdrag.first = true;
				Ext.callback(me.onDragOperationEnter, me, [{event: e, data: undefined, source: undefined}]);
			}
		},
		
		_onElBrowserDragLeave: function(e) {
			var me = this,
				bdrag = me.browserDrag;
			
			if (bdrag.second) {
				bdrag.second = false;
			} else if (bdrag.first) {
				bdrag.first = false;
			}
			if (!bdrag.first && !bdrag.second) {
				Ext.callback(me.onDragOperationLeave, me, [{event: e, data: undefined, source: undefined}]);
			}
		}
	},
	
	inheritableStatics: {
		isExtDrag: function(dragOp) {
			return dragOp.event && dragOp.source;
		},
		
		isBrowserDrag: function(dragOp) {
			return dragOp.event && !dragOp.source;
		},
		
		isBrowserFileDrag: function(dragOp) {
			return Sonicle.plugin.DropMask.isBrowserDrag(dragOp) && dragOp.event.browserEvent.dataTransfer && Ext.Array.from(dragOp.event.browserEvent.dataTransfer.types).indexOf('Files') !== -1;
		}
	}
});
