/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.api.DnDMgr', {
	singleton: true,
	requires: [
		'Sonicle.String'
	],
	
	eventSelector: '.fc-event-draggable',
	
	/**
	 * Created a data object suitable for {@link#performOver} and {@link#performDrop} methods.
	 * @param {Boolean} allDay
	 * @param {Date} start
	 * @param {Date} end
	 * @returns {Object}
	 */
	prepareDropData: function(allDay, start, end) {
		return {
			allDay: allDay,
			start: start,
			end: end
		};
	},
	
	/**
	 * Checks if dragging operation, substained by drag-data, is related to this component.
	 * @param {Object} dragData Data object from {@link Ext.dd.DropZone} methods: eg. {@link Ext.dd.DropZone#onNodeOver} or {@link Ext.dd.DropZone#onNodeDrop}.
	 * @returns {Boolean}
	 */
	isDragMine: function(dragData) {
		return dragData ? this.findSource(dragData.ddel, this.eventSelector) : false;
	},
	
	/**
	 * Performs over operation: this should be called when implementing {@link Ext.dd.DropZone#onNodeOver} method.
	 * @param {Ext.dd.DragSource} source The drag source that was dragged.
	 * @param {Event} e The event.	
	 * @param {Object} dragData An object containing data supplied by the drag-source.
	 * @param {Object} dropData An object containing data necessary to complete drop operation.
	 * @returns {String|Boolean} The CSS class that represents the drop-status or `false` in case of failure.
	 */
	performOver: function(source, e, dragData, dropData) {
		var data = this.prepareRealDropData(dragData, dropData), op;
		if (source && e && data) {
			op = source.dragOperation('drag', e);
			source.proxy.updateMessage(op, data.start, data.end, data.allDay);
			return source.proxy.getDropAllowedCls(op);
			
		} else if (source) {
			source.proxy.setMessage(null);
			return false;
			
		} else {
			return false;
		}
	},
	
	/**
	 * Performs drop operation: this should be called when implementing {@link Ext.dd.DropZone#onNodeDrop} method.
	 * @param {Ext.dd.DragSource} source The drag source that was dragged.
	 * @param {Event} e The event.	
	 * @param {Object} dragData An object containing data supplied by the drag-source.
	 * @param {Object} dropData An object containing data necessary to complete drop operation.
	 * @returns {Boolean|undefined} The status of drop operation or `undefined` in case of failure.
	 */
	performDrop: function(source, e, dragData, dropData) {
		var data = this.prepareRealDropData(dragData, dropData);
		if (data) return source.eventDropMove(dragData.eventId, data.start, data.end, e);
	},
	
	privates: {
		prepareRealDropData: function(dragData, dropData) {
			var obj;
			if (dragData) {
				var SoD = Sonicle.Date,
					fcdd = dragData.fcGetDragData(),
					fcExProps = fcdd.origDef.extendedProps;
				
				obj = {
					allDay: Ext.isBoolean(dropData.allDay) ? dropData.allDay : fcdd.allDay,
					start: dropData.start ? SoD.copyDate(dropData.start, fcExProps.startDate) : null,
					end: dropData.end ? SoD.copyDate(dropData.end, fcExProps.endDate) : null
				};
			}
			return obj;
		},
		
		findSource: function(el, selector) {
			return Ext.fly(el).hasCls(Sonicle.String.removeStart(selector, '.'));
		}
	}
});
