/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.toolbar.Breadcrumb', {
	extend: 'Ext.toolbar.Breadcrumb',
	alias: 'widget.sobreadcrumb',
	
	//buttonUI: 'extjs-breadcrumb-ui',
	
	config: {
		/**
		 * @cfg {Number} [minDepth=0]
		 * Minimum depth at which begin to display nodes.
		 * Nodes with depth below this value will be hidden.
		 */
		minDepth: 0,
		
		/**
		 * @cfg {Boolean|Number} [shorten=30]
		 */
		shorten: 30
	},
	
	updateStore: function(store, oldStore) {
		var me = this;
		if (oldStore) oldStore.un('load', me.onStoreLoad, me);
		if (store) store.on('load', me.onStoreLoad, me);
		me.callParent(arguments);
	},
	
	getSelectionParent: function() {
		var node = this.getSelection(),
				pnode = node ? node.parentNode : null;
		if (pnode && pnode.get('depth') >= this.getMinDepth()) {
			return pnode;
		}
		return null;
	},
	
	/**
	 * Overrides default implementation of {@link Ext.toolbar.Breadcrumb#updateSelection} to add support to:
	 *  - hiding items below a minimum depth value (minDepth)
	 *  - text items ellipsis
	 */
	updateSelection: function(node, prevNode) {
		var me = this,
				mdepth = me.getMinDepth(),
				shorten = me.getShorten(),
				shrt = (shorten === false) ? false : true,
				shrtLen = (shrt && Ext.isNumber(shorten)) ? shorten : 30,
				buttons = me._buttons,
				items = [],
				itemCount = Ext.ComponentQuery.query('[isCrumb]', me.getRefItems()).length,
				needsSync = me._needsSync,
				displayField = me.getDisplayField(),
				showIcons, glyph, iconCls, icon, newItemCount, currentNode, text, button, id, depth, i;

		Ext.suspendLayouts();

		if (node) {
			currentNode = node;
			depth = node.get('depth');
			newItemCount = depth + 1;
			i = depth;

			while (currentNode) {
				id = currentNode.getId();

				button = buttons[i];

				if (!needsSync && button && button._breadcrumbNodeId === id) {
					// reached a level in the hierarchy where we are already in sync. 
					break;
				}

				text = currentNode.get(displayField);

				if (button) {
					// If we already have a button for this depth in the button cache reuse it
					button.setText(shrt ? Ext.String.ellipsis(text, shrtLen) : text);
				} else {
					// no button in the cache - make one and add it to the cache 
					button = buttons[i] = Ext.create({
						isCrumb: true,
						hidden: i < mdepth,
						xtype: me.getUseSplitButtons() ? 'splitbutton' : 'button',
						ui: me.getButtonUI(),
						componentCls: me._btnCls + ' ' + me._btnCls + '-' + me.ui,
						separateArrowStyling: false,
						text: shrt ? Ext.String.ellipsis(text, shrtLen) : text,
						showEmptyMenu: true,
						// begin with an empty menu - items are populated on beforeshow
						menu: {
							listeners: {
								click: '_onMenuClick',
								beforeshow: '_onMenuBeforeShow',
								scope: this
							}
						},
						handler: '_onButtonClick',
						scope: me
					});
				}

				showIcons = this.getShowIcons();

				if (showIcons !== false) {
					glyph = currentNode.get('glyph');
					icon = currentNode.get('icon');
					iconCls = currentNode.get('iconCls');

					if (glyph) {
						button.setGlyph(glyph);
						button.setIcon(null);
						button.setIconCls(iconCls); // may need css to get glyph 
					} else if (icon) {
						button.setGlyph(null);
						button.setIconCls(null);
						button.setIcon(icon);
					} else if (iconCls) {
						button.setGlyph(null);
						button.setIcon(null);
						button.setIconCls(iconCls);
					} else if (showIcons) {
						// only show default icons if showIcons === true 
						button.setGlyph(null);
						button.setIcon(null);
						button.setIconCls(
							(currentNode.isLeaf() ? me._leafIconCls : me._folderIconCls) +
							'-' + me.ui
						);
					} else {
						// if showIcons is null do not show default icons 
						button.setGlyph(null);
						button.setIcon(null);
						button.setIconCls(null);
					}
				}

				button.setArrowVisible(currentNode.hasChildNodes());
				button._breadcrumbNodeId = currentNode.getId();
				
				currentNode = currentNode.parentNode;
				i--;
			}

			if (newItemCount > itemCount) {
				// new selection has more buttons than existing selection, add the new buttons 
				items = buttons.slice(itemCount, depth + 1);
				me.add(items);
			} else {
				// new selection has fewer buttons, remove the extra ones from the items, but 
				// do not destroy them, as they are returned to the cache and recycled. 
				for (i = itemCount - 1; i >= newItemCount; i--) {
					me.remove(me.items.items[i], false);
				}
			}

		} else {
			// null selection 
			for (i = 0; i < buttons.length; i++) {	
				me.remove(buttons[i], false);
			}
		}

		Ext.resumeLayouts(true);

		/**
		 * @event selectionchange
		 * Fires when the selected node changes
		 * @param {Ext.toolbar.Breadcrumb} this
		 * @param {Ext.data.TreeModel} node The selected node (or null if there is no selection)
		 * @param {Ext.data.TreeModel} prevNode The previously selected node.
		 */
		me.fireEvent('selectionchange', me, node, prevNode);
		
		if (me._shouldFireChangeEvent) {
			/**
			 * @event change
			 * Fires when the user changes the selected record. In contrast to the {@link #selectionchange} event, this does
			 * *not* fire at render time, only in response to user activity.
			 * @param {Ext.toolbar.Breadcrumb} this
			 * @param {Ext.data.TreeModel} node The selected node.
			 * @param {Ext.data.TreeModel} prevNode The previously selected node.
			 */
			me.fireEvent('change', me, node, prevNode);
		}
		me._shouldFireChangeEvent = true;

		me._needsSync = false;
	},
	
	privates: {
		onStoreLoad: function(s, recs, success, op, node) {
			var me = this,
					buttons = me._buttons,
					depth = node.get('depth'),
					button = buttons[depth];
			
			if (button && button._breadcrumbNodeId === node.getId()) {
				button.setArrowVisible(node.hasChildNodes());
			}
		}
	}
});
