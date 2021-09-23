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
		//if (isParent || isChild) html += 'width:20px;';
		if (isParent) html += 'width:15px;';
		if (isChild) html += 'width:20px;';
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
			html += '<span class="' + me.hierarchySymbolExtraCls + '" style="padding-left:20px;">' + Sonicle.grid.column.Nest.hierarchySvg() + '</span>';
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
		hierarchySvg: function(color, beginColor, endColor) {
			var SoS = Sonicle.String,
					base = SoS.deflt(color, 'currentcolor'),
					replObj = {
						'{line-color}': base,
						'{circle1-color}': SoS.deflt(beginColor, base),
						'{circle2-color}': SoS.deflt(endColor, base)
					};
			return SoS.replace(Sonicle.grid.column.Nest.hierarchySvgTpl, replObj);
		},
		hierarchySvgTpl: '<svg width="12" height="12" viewBox="0 0 12 12">' +
				'<path fill="{line-color}" d="M3 4.95V6.5a2.5 2.5 0 002.336 2.495L5.5 9h1.55v1H5.5a3.5 3.5 0 01-3.495-3.308L2 6.5V4.95H3"></path>' +
				'<path fill="{circle1-color}" d="M2.5 0A2.5 2.5 0 012.5 5V5A2.5 2.5 0 012.5 0zm0 1A1.5 1.5 0 102.5 4A1.5 1.5 0 002.5 1z"></path>' +
				'<path fill="{circle2-color}" d="M7 9.5A2.5 2.5 0 1112 9.5A2.5 2.5 0 017 9.5zm2.5-1.5a1.5 1.5 0 100 3a1.5 1.5 0 000-3z"></path>' +
				'</svg>'
	}
});