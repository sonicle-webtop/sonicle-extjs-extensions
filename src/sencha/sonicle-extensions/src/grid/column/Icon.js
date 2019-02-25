/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Icon', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.soiconcolumn',
	
	tdCls: 'so-'+'grid-cell-iconcolumn',
	innerCls: 'so-'+'grid-cell-inner-iconcolumn',
	
	iconIconCls: 'so-'+'iconcolumn-icon',
	iconTextCls: 'so-'+'iconcolumn-text',
	
	/**
	 * @cfg {String} cellClsField
	 * The fieldName for getting the CSS class to apply to the cell area.
	 * To determine the class dynamically, configure the column with a `getCellCls` function.
	 */
	cellClsField: null,
	
	/**
	 * @cfg {Function} getCellCls
	 * A function which returns the CSS class to apply to the cell area.
	 */
	getCellCls: null,

	/**
	 * @cfg {String} iconClsField
	 * The fieldName for getting the CSS class to apply to the icon image.
	 * To determine the class dynamically, configure the column with a `getIconCls` function.
	 */
	iconClsField: null,
	
	/**
	 * @cfg {Function} getIconCls
	 * A function which returns the CSS class to apply to the icon image.
	 */
	getIconCls: null,
	
	/**
	 * @cfg {String} tipField
	 * The fieldName for getting the tooltip to apply to the icon image.
	 * To determine the class dynamically, configure the column with a `getTip` function.
	 */
	tipField: null,
	
	/**
	 * @cfg {Function} getTip
	 * A function which returns the tooltip to apply to the icon image.
	 */
	getTip: null,
	
	/**
	 * @cfg {Number} iconSize
	 * The icon size in px.
	 */
	iconSize: 16,
	
	/**
	 * @cfg {Boolean} hideText
	 * False to display column's value next to the icon.
	 */
	hideText: true,
	
	/**
	 * @cfg {Boolean} [stopSelection=false]
	 * Prevent grid selection upon click.
	 * Beware that if you allow for the selection to happen then the selection model will steal focus from
	 * any possible floating window (like a message box) raised in the handler. This will prevent closing the
	 * window when pressing the Escape button since it will no longer contain a focused component.
	 */
	stopSelection: false,
	
	constructor: function(cfg) {
		var me=this;
		
		me.scope = me;
		me.origScope = cfg.scope || me.scope;
		me.callParent([ cfg ]);
	},
	
	buildHtml: function(value, rec) {
		var me = this,
				clsico = me.iconIconCls,
				clstxt = me.iconTextCls,
				size = me.iconSize,
				ico = me.evalValue(me.getIconCls, me.iconClsField, value, rec),
				ttip = me.evalValue(me.getTip, me.tipField, value, rec, null),
				style = 'width:'+size+'px;height:'+size+'px;',
				text = '', style;
		
		if (ico) clsico += ' ' + ico;
		if (!me.hideText) text = '<span class="'+clstxt+'">' + Sonicle.String.deflt(value, '') + '</span>';
		if (Ext.isFunction(me.handler)) style += 'cursor:pointer;';
		return '<div class="'+clsico+'" style="' + style + '"' + (ttip ? ' data-qtip="' + ttip + '"' : '') + '></div>' + text;
	},
	
	defaultRenderer: function(value, cellValues) {
		var me=this,
			rec=cellValues ? cellValues.record : null,
			cellCls = me.evalValue(me.getCellCls, me.cellClsField, value, rec);
		if (cellCls && cellValues) cellValues.tdCls += cellCls;
		return this.buildHtml(value, rec);
	},
	
	updater: function(cell, value, rec) {
		//TODO: valutare un metodo di aggiornamento parziale
		cell.firstChild.innerHTML = this.buildHtml(value, rec);
	},
	
	evalValue: function(getFn, field, value, rec, fallback) {
		if(rec && Ext.isFunction(getFn)) {
			return getFn.apply(this, [value, rec]);
		} else if(rec && !Ext.isEmpty(field)) {
			return rec.get(field);
		} else {
			return (fallback === undefined) ? value : fallback;
		}
	},
	
    /**
	 * @private
	 * Process and re-fire events routed from the Ext.panel.Table's processEvent method.
	 * Also fires any configured click handlers. By default, cancels the mousedown event to prevent selection.
	 * Returns the event handler's status to allow canceling of GridView's bubbling process.
	 */
	processEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
		var me = this,
				target = e.getTarget(),
				key = type === 'keydown' && e.getKey(),
				match;

		// Flag event to tell SelectionModel not to process it. 
		e.stopSelection = !key && me.stopSelection;

		// If the target was not within a cell (ie it's a keydown event from the View), then 
		// rely on the selection data injected by View.processUIEvent to grab the 
		// first action icon from the selected cell. 
		if (key && !Ext.fly(target).findParent(view.getCellSelector())) {
			target = Ext.fly(cell).down('.' + me.iconIconCls, true);
		}

		// NOTE: The statement below tests the truthiness of an assignment. 
		if (target && (match = target.className.match(me.actionIdRe))) {
			if (type === 'click' || (key === e.ENTER || key === e.SPACE)) {
				Ext.callback(me.handler, me.origScope, [view, recordIndex, cellIndex, e, record, row], undefined, me);

				// Handler could possibly destroy the grid, so check we're still available. 
				//  
				// If the handler moved focus outside of the view, do not allow this event to propagate 
				// to cause any navigation. 
				if (!view.isDestroyed && !view.el.contains(Ext.Element.getActiveElement())) {
					return false;
				}
			}
		}

		return me.callParent(arguments);
	}
});
