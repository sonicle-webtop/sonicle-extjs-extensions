/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Nest', {
	extend: 'Sonicle.grid.column.Icon',
	alias: 'widget.so-nestcolumn',
	
	/**
	 * @cfg {String} isParentField
	 * The fieldName for determining whether to show the collapse/expand tool.
	 */
	isParentField: null,
	
	/**
	 * @cfg {String} isChildField
	 * The fieldName for determining whether to show the child icon.
	 */
	isChildField: null,
	
	/**
	 * @cfg {String} collapsedField
	 * The fieldName for getting the status of the tool: collapsed or not.
	 * Useful only if the above hasChildrenField was provided.
	 */
	collapsedField: null,
	
	/**
	 * @cfg {String} depthField
	 * The fieldName for getting the depth value to apply indentation.
	 * If not provided, it will be determined using {@link #isChildrenField}
	 */
	depthField: null,
	
	/**
	 * @cfg {Integer} [indentationSize=10]
	 */
	indentationSize: 10,
	
	/**
	 * @cfg {Boolean} [collapseDisabled=false]
	 * Set to `true` to disable collapse/expand tool.
	 */
	collapseDisabled: false,
	
	/**
	 * @cfg {Function/String} collapseHandler
	 * A function called when the thread collapse/expand icon is clicked.
	 * @cfg {Ext.view.Table} handler.view The owning TableView.
	 * @cfg {Number} handler.rowIndex The row index clicked on.
	 * @cfg {Number} handler.colIndex The column index clicked on.
	 * @cfg {Event} handler.e The click event.
	 * @cfg {Ext.data.Model} handler.record The Record underlying the clicked row.
	 * @cfg {HTMLElement} handler.row The table row clicked upon.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope (`this` reference) in which the `{@link #collapseHandler}`
	 * functions are executed.
	 * Defaults to this Column.
	 */
	
	collapseToolCls: 'so-'+'nestcolumn-collapsetool',
	hierarchySymbolExtraCls: '',
	collapsedIconCls: 'fa-plus-square-o',
	expandedIconCls: 'fa-minus-square-o',
	wrapCls: 'so-'+'nestcolumn-wrap',
	
	collapseTooltip: 'Click to expand/collapse groups',
	
	buildHtml: function(value, rec) {
		var me = this,
			SoS = Sonicle.String,
			wrapCls = me.wrapCls,
			isParent = me.isParentField && rec.get(me.isParentField) === true ? true : false,
			isChild = me.isChildField && rec.get(me.isChildField) === true ? true : false,
			depthField = me.depthField,
			collapsedField = me.collapsedField,
			ohtml = me.callParent(arguments),
			depth, margin = '', html = '';
	
		if (depthField || isChild) {
			if (depthField) depth = rec.get(depthField);
			if (!Ext.isNumber(depth) && isChild) depth = 1;
			depth = Ext.isNumber(depth) && depth >= 0 ? depth : 0;
			if (Ext.isNumber(depth)) margin = 'margin-right:' + depth * me.indentationSize + 'px;';
		}
		html += '<div class="' + wrapCls + '" style="';
		if (isParent || isChild) html += 'width:20px;';
		html += margin + '">';
		
		//<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M4.5 2A2.5 2.5 0 015 6.95V8.5a2.5 2.5 0 002.336 2.495L7.5 11h1.55a2.5 2.5 0 110 1H7.5a3.5 3.5 0 01-3.495-3.308L4 8.5V6.95A2.5 2.5 0 014.5 2zm7 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-7-7a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path></svg>
		
		if (isParent) {
			if (collapsedField) {
				var toolCls = !!rec.get(collapsedField) ? me.collapsedIconCls : me.expandedIconCls,
					tip = me.collapseDisabled ? '' : SoS.htmlAttributeEncode(me.collapseTooltip),
					cls = me.collapseToolCls + ' ' + (me.collapseDisabled ? me.collapseToolCls+'-disabled' : ''),
					//style = me.collapseDisabled ? '' : 'cursor:pointer;';
					style = '';
				html += '<i class="' + cls + ' fa ' + toolCls + '" data-qtip="'+ tip +'" style="' + style + '"></i>';
			}
		} else if (isChild) {
			html += '<span class="' + me.hierarchySymbolExtraCls + '">' + Sonicle.grid.column.Nest.hierarchySvg + '</span>';
		}
		html += '</div>';
		return html + '<div class="' + wrapCls + '">' + ohtml + '</div>';
	},
	
	processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
		var me = this,
			isClick = type === 'click',
			disabled = me.disabled,
			ret;
		
		if (!disabled && isClick) {
			if (!me.collapseDisabled && e.getTarget('.' + me.collapseToolCls)) {
				// Flag event to tell SelectionModel not to process it.
				e.stopSelection = me.stopSelection;
				// Do not allow focus to follow from this mousedown unless the grid is already in actionable mode 
				if (isClick && !view.actionableMode) {
					e.preventDefault();
				}
				Ext.callback(me.collapseHandler, me.origScope, [view, recordIndex, cellIndex, e, record, row], undefined, me);
			}
		} else {
			ret = me.callParent(arguments);
		}
		return ret;
	},
	
	statics: {
		hierarchySvg: '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M4.5 2A2.5 2.5 0 015 6.95V8.5a2.5 2.5 0 002.336 2.495L7.5 11h1.55a2.5 2.5 0 110 1H7.5a3.5 3.5 0 01-3.495-3.308L4 8.5V6.95A2.5 2.5 0 014.5 2zm7 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-7-7a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path></svg>'
	}
});