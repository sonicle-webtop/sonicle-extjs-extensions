/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Action', {
	extend: 'Ext.grid.column.Action',
	alias: 'widget.soactioncolumn',
	uses: [
		'Sonicle.Utils'
	],
	
	draggable: false,
	hideable: false,
	groupable: false,
	editable: false, /* Disable editing */
	editRenderer: function(){ return ''; }, /* Disable cloning of icons when using row-editing */
	align: 'center',
	
	/**
	 * @cfg {Boolean} [showOnSelection=false]
	 * Set to `true` to initially hide all actions, they become visible when row is selected.
	 */
	showOnSelection: false,
	
	/**
	 * @cfg {Boolean} [showOnOver=false]
	 * Set to `true` to initially hide all actions, they become visible when cursor is over the row.
	 */
	showOnOver: false,
	
	/**
	 * @cfg {String} [hideDataIndex=null]
	 * Set the field name specifying visibility of the action on a record per record basis.
	 * When the field of the record is `true`, the action is hidden.
	 */
	hideDataIndex: null,
	
	/**
	 * True to calculate width automatically based on action item's count.
	 * Set to a number to arrange the with on a fixed number of items.
	 * @param {Boolean|Number} [autoWidth=true]
	 */
	autoWidth: true,
	
	/**
	 * Reserved space to add before and after when calculating column width. 
	 * @param {Number} [extraSpace=0]
	 */
	
	constructor: function(cfg) {
		var me = this,
			items = cfg.items || me.items || [me],
			width = cfg.width || me.width;
		me.callParent([cfg]);
		
		if (Ext.isArray(items) && !width) {
			me.on('afterrender', function() {
				//TODO: find way to set flex=1 when column is visible and at last position: this
				//allows a better display, stretching this column to the end of the table. Original
				//size needs to be restored when the column is no more the last.
				//var idx = me.getIndex(),
				//	lidx = me.getRootHeaderCt().getVisibleGridColumns().length-1;
				//console.log('index: '+idx);
				//console.log('last-index: '+lidx);
				if (me.autoWidth !== false) {
					me.setWidth(me.calculateColumnWidth(items));
				}
			}, me, {single: true});
			
			Ext.iterate(items, function(item) {
				if (item.menu) {
					if (!Ext.isDefined(item.destroyMenu)) item.destroyMenu = true;
					me.setItemMenu(item, item.menu, /* destroyMenu */ false, true);
					item.handler = function(view, ridx, cidx, itm, e, rec) {
						if (itm.menu.isMenu) {
							Sonicle.Utils.showContextMenu(e, itm.menu, {view: view, ridx: ridx, cidx: cidx, rec: rec}, {alignTo: e.getTarget()});
						}
					};
				}
			});
		}
		//me.on('move', me.onColumnMove, me);
	},
	
	doDestroy: function() {
		var me = this;
		Ext.iterate(me.items, function(item) {
			if (item.menu) me.setItemMenu(item, null, true);
		});
		me.callParent();
	},
	
	defaultRenderer: function(v, cellValues, record, rowIdx, colIdx, store, view) {
		
		var hideOnThisRecord = this.hideDataIndex && record.get(this.hideDataIndex);
		
		if (hideOnThisRecord) {
			cellValues.tdCls += ' ' + 'so-' + 'actioncolumn-col-cell-hidden';
		} else {
			if (this.showOnSelection === true || (Ext.isFunction(this.showOnSelection) && this.showOnSelection(record)) ) {
				cellValues.tdCls += ' ' + 'so-' + 'actioncolumn-col-cell-visible-onselection';
			}
			if (this.showOnOver === true || (Ext.isFunction(this.showOnOver) && this.showOnOver(record)) ) {
				cellValues.tdCls += ' ' + 'so-' + 'actioncolumn-col-cell-visible-onover';
			}
		}
		return this.callParent(arguments);
	},
	
	privates: {
		setItemMenu: function(item, menu, destroyMenu, initial) {
			var me = this,
				oldMenu = item.menu,
				instanced;

			if (oldMenu && !initial) {
				if (destroyMenu !== false && item.destroyMenu) {
					oldMenu.destroy();
				}
				oldMenu.ownerCmp = null;
			}

			if (menu) {
				instanced = menu.isMenu;
				menu = Ext.menu.Manager.get(menu, {
					ownerCmp: me
				});
				menu.setOwnerCmp(me, instanced);
				menu.menuClickBuffer = 250;
				item.menu = menu;
			} else {
				item.menu = null;
			}
		},
		
		onColumnMove: function(s, x, y) {
			console.log('onColumnMove');
			console.log('index: '+s.getIndex());
			console.log('last-index: '+s.getRootHeaderCt().getVisibleGridColumns().length-1);
		},
		
		calculateColumnWidth: function(items) {
			var me = this,
				ownGrid = me.getView().grid,
				// Pass any custom componentCls to measuring element in order to make right calculations.
				dummyElCls = ownGrid.componentCls !== ownGrid.baseCls ? ownGrid.componentCls : undefined,
				cmeas = Sonicle.grid.column.Action.measureCell(dummyElCls),
				imeas = me.measureActionItems(),
				count = (me.autoWidth !== true && Ext.isNumber(me.autoWidth)) ? me.autoWidth : items.length;
			return (count * imeas.width) + (count * imeas.midSpacing) + imeas.beforeSpacing + imeas.afterSpacing + cmeas.margin + cmeas.padding;
		},
		
		measureActionItems: function() {
			var me = this,
				view = me.getView(),
				sto = me.getView().getStore(),
				html, width, mid, before, after;
			
			if (sto && me.items) {
				try {
					html = me.defaultRenderer(null, {}, sto.createModel({}), -1, -1, sto, view);
				} catch (e) {}
				
				if (html) {
					var sanitizeHtml = function(html) {
							// Actions are rendered from configured items, if first action is hidden 
							// programmatically, wrong measures are returned on the dummy element.
							// Make sure to disarm here any visibility modification in order to get real measures.
							if (html.indexOf('style') === -1) {
								return html.replace('></', ' style="display:inline-block !important;"></');
							} else {
								return html.replace('style="', 'style="display:inline-block !important;');
							}
						},
						getElWidth = function(el) {
							return el ? el.getWidth(true) : 0;
						},
						getElMargin = function(el, side) {
							return el ? el.getMargin(side) : 0;
						},
						ctxId = Ext.id(null, 'so-actioncolumn-dummyitems-'),
						ctxEl = Ext.getBody().appendChild({
							id: ctxId,
							tag: 'div',
							style: 'visibility:hidden;pointer-events:none;border:none;',
							html: sanitizeHtml(html)
						}),
						act0El, actNEl;
					
					if (me.items.length === 1) {
						act0El = ctxEl.down('.x-action-col-0');
						width = getElWidth(act0El);
						mid = 0;
						before = getElMargin(act0El, 'l');
						after = getElMargin(act0El, 'r');
					} else if (me.items.length > 1) {
						act0El = ctxEl.down('.x-action-col-0');
						actNEl = ctxEl.down('.x-action-col-' + (me.items.length-1));
						width = Math.max(getElWidth(act0El), getElWidth(actNEl));
						mid = getElMargin(act0El, 'r') + getElMargin(actNEl, 'l');
						before = getElMargin(act0El, 'l');
						after = getElMargin(actNEl, 'r');
					}
					
					Ext.defer(function() {
						Ext.fly(ctxId).destroy();
					}, 10);
				}
			}
			return {width: width || 16, midSpacing: mid || 0, beforeSpacing: before || 0, afterSpacing: after || 0};
		}
	},
	
	statics: {
		measureCell: function(dummyElCls) {
			var ctxId = Ext.id(null, 'so-actioncolumn-dummycell-'),
				ctxEl = Ext.getBody().appendChild({
					id: ctxId,
					tag: 'div',
					cls: dummyElCls,
					style: 'visibility:hidden;pointer-events:none;border:none;',
					html: '<div class="x-grid-cell-inner x-grid-cell-inner-action-col"></div>'
				}),
				cellEl = ctxEl.down('.x-grid-cell-inner-action-col'),
				margin, padding;
			
			margin = cellEl.getMargin('lr');
			padding = cellEl.getPadding('lr');
			
			Ext.defer(function() {
				Ext.fly(ctxId).destroy();
			}, 10);
			
			return {margin: margin || 0, padding: padding || 0};
		}
	}
});
