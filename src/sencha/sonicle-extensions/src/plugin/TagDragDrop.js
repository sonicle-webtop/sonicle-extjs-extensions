/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 * Inspired by https://fiddle.sencha.com/#fiddle/i65&view/editor
 */
Ext.define('Sonicle.plugin.TagDragDrop', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sotagdnd',
	uses: [
		'Sonicle.Utils'
	],
	
	/**
	 * @cfg {Boolean} [enableDrop]
	 * `false` to disallow the Tag from accepting drop gestures.
	 */
	enableDrop: true,
	
	/**
	 * @cfg {Boolean} [enableDrag]
	 * `false` to disallow dragging items from the Tag.
	 */
	enableDrag: true,
	
	/**
	 * @cfg {Boolean} [enableReorder]
	 * `false` to disallow reordering Tag items while dragging.
	 */
	enableReorder: true,
	
	/**
	 * @cfg {Object} [dragZone]
	 * A config object to apply to the creation of the {@link #property-dragZone DragZone}
	 * which handles for drag start gestures.
	 * 
	 * Template methods of the DragZone may be overridden using this config.
	 */
	
	/**
	 * @cfg {Object} [dropZone]
	 * A config object to apply to the creation of the {@link #property-dropZone DropZone}
	 * which handles mouseover and drop gestures.
	 * 
	 * Template methods of the DropZone may be overridden using this config.
	 */
	
	/**
	 * @property {Ext.view.DragZone} dragZone
	 * An {@link Ext.view.DragZone DragZone} which handles mousedown and dragging of items from field.
	 */
	
	/**
	 * @property {Ext.grid.DropZone} dropZone
	 * An {@link Ext.grid.DropZone DropZone} which handles mouseover and dropping
	 * @return {undefined}
	 */
	
	dropItemHighlightCls: 'so-'+'tagdnd-itemhighlight',
	dropInputHighlightCls: 'so-'+'tagdnd-inputhighlight',
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		if (!field.isXType('tagfield')) {
			Ext.raise('Bound component MUST be a `tagfield`');
			return;
		}
		field.on('afterrender', me.onCmpAfterRender, me, { single: true });
	},
	
	doDestroy: function() {
		var me = this;
		me.dragZone = me.dropZone = Ext.destroy(me.dragZone, me.dropZone);
		me.setCmp(null);
	},
	
	enable: function() {
		var me = this;
		if (me.dragZone) me.dragZone.unlock();
		if (me.dropZone) me.dropZone.unlock();
		me.callParent();
	},
	
	disable: function() {
		var me = this;
		if (me.dragZone) me.dragZone.lock();
		if (me.dropZone) me.dropZone.lock();
		me.callParent();
	},
	
	privates: {
		onCmpAfterRender: function(s) {
			var me = this;
			if (me.enableDrag) {
				me.dragZone = new Ext.dd.DragZone(s.itemList, Ext.apply({
					field: s,
					ddGroup: me.dragGroup || me.ddGroup,
					dragText: me.dragText,
					getDragData: function(e) {
						var field = this.field,
							sourceEl = e.getTarget(field.tagItemSelector, 10),
							ddel;
						if (sourceEl) {
							ddel = sourceEl.cloneNode(true);
							ddel.id = Ext.id();
							return {
								ddel: ddel,
								sourceEl: sourceEl,
								sourceStore: field.store,
								sourceRecord: field.getRecordByListItemNode(sourceEl),
								repairXY: Ext.fly(sourceEl).getXY()
							};
						}
					},
					getRepairXY: function() {
						return this.dragData.repairXY;
					}
				}, me.dragZone || {}));
			}
			if (me.enableDrop) {
				me.dropZone = new Ext.dd.DropZone(s.itemList, Ext.apply({
					field: s,
					ddGroup: me.dropGroup || me.ddGroup,
					getTargetFromEvent: function(e) {
						var field = this.field, el;
						// Handle dragging over tag-items
						if (me.enableReorder !== false) {
							el = e.getTarget(field.tagItemSelector, 3, true);
							if (el) {
								var middleX = el.getX() + (el.getRight() - el.getLeft()) / 2;
								return {itemEl: el, after: e.getX() > middleX};
							}
						}
						// Handle dragging over input area, right after tag-item list (if any)
						el = e.getTarget('.x-tagfield-input', 2, true);
						if (el) {
							if (me.enableReorder === false) {
								//FIXME: find a way to retrive source field here, in order to check if field (target one) is the same of retrieved source!
								//var cmp = me.lookupTagComponent(Ext.fly(e.target));
								//if (cmp && field.getId() === cmp.getId()) return;
							}
							return {inputCtEl: el};
						}
					},
					onNodeEnter: function(node, source, e, data) {
						if (node.itemEl) {
							var dropCls1 = me.dropItemHighlightCls,
								dropCls2 = dropCls1 + (node.after ? '-after' : '-before');
							Ext.fly(node.itemEl).addCls(dropCls1 + ' ' + dropCls2);
						} else if (node.inputCtEl) {
							Ext.fly(node.inputCtEl).addCls(me.dropInputHighlightCls);
						}
					},
					onNodeOut: function(node, source, e, data) {
						if (node.itemEl) {
							Ext.fly(node.itemEl).removeCls(Sonicle.String.join(' ', me.dropItemHighlightCls, me.dropItemHighlightCls+'-before', me.dropItemHighlightCls+'-after'));
						} else if (node.inputCtEl) {
							Ext.fly(node.inputCtEl).removeCls(me.dropInputHighlightCls);
						}
					},
					onNodeOver: function(node, source, e, data) {
						return Ext.dd.DropZone.prototype.dropAllowed;
					},
					onNodeDrop: function(node, source, e, data) {
						var sourceField = source.field,
							sourceIdx = me.readItemIndex(Ext.fly(data.sourceEl)),
							targetField = this.field,
							targetIdx;
						
						if (node.itemEl) {
							targetIdx = me.readItemIndex(node.itemEl);
							if (node.after) targetIdx++;
						}
						
						if (Ext.isFunction(me.onDrop)) {
							return Ext.callback(me.onDrop, me.scope | me, [sourceField, sourceIdx, targetField, targetIdx]);
						} else {
							return false;
						}
					}
				}, me.dropZone || {}));
			}
		},
		
		readItemIndex: function(el) {
			return parseInt(el.getAttribute('data-selectionindex'));
		},
		
		lookupTagComponent: function(el) {
			var cmpEl = el.up('.x-field'), cmp;
			if (cmpEl) {
				cmp = Ext.ComponentManager.get(cmpEl.getId());
				return cmp && cmp.isXType('tagfield') ? cmp : undefined;
			}
		}
	}
});