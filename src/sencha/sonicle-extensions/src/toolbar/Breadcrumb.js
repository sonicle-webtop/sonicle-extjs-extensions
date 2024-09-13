/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.toolbar.Breadcrumb', {
	extend: 'Ext.toolbar.Breadcrumb',
	alias: 'widget.sobreadcrumb',
	
	//buttonUI: 'extjs-breadcrumb-ui',
	
	config: {
		/**
		 * @cfg {Number} [minDepth=0]
		 * Minimum node depth at which begin to display nodes.
		 * Nodes with depth below this value will be hidden.
		 */
		minDepth: 0,
		
		/**
		 * @cfg {Boolean} [showOnlySelectedNode=false]
		 * Set to `true` to show only sected node.
		 * This will override any value set to {@link #minDepth}.
		 */
		showOnlySelectedNode: false,
		
		/**
		 * @cfg {Boolean} [disableButtonMenu=false]
		 * Set to `true` to disable completely dropdown menu on bottons, also in
		 * case of child items.
		 */
		disableButtonMenu: false,
		
		/**
		 * @cfg {Boolean|Number} [shortenDisplay=30]
		 * Display value will be shortened to specified number of chars.
		 * Set to `false` to disable this behaviour.
		 */
		shortenDisplay: 30
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
	 * Override original {@link Ext.toolbar.Breadcrumb#updateSelection}:
	 *  - hide items below a minimum depth value (see minDepth)
	 *  - hide all items except the selected one (see showOnlySelectedNode)
	 *  - display field ellipsis
	 */
	updateSelection: function(node, prevNode) {
		var me = this,
			buttons = me._buttons,
			items = [],
			itemCount = Ext.ComponentQuery.query('[isCrumb]', me.getRefItems()).length,
			needsSync = me._needsSync,
			displayField = me.getDisplayField(),
			minDepth = me.getMinDepth(), // --> Added
			showSelectedOnly = me.getShowOnlySelectedNode(), // --> Added
			shortenDisplay = me.getShortenDisplay(), // --> Added
			hidden, // --> Added
			showIcons, glyph, iconCls, icon, newItemCount, currentNode, text, button, id, depth, i;

		Ext.suspendLayouts();

		if (node) {
			currentNode = node;
			depth = node.get('depth');
			newItemCount = depth + 1;
			i = depth;
			if (showSelectedOnly === true) minDepth = depth; // --> Added

			while (currentNode) {
				id = currentNode.getId();
				hidden = i < minDepth; // --> Added to hide items according to configs

				button = buttons[i];
				if (button) {
					button.setHidden(hidden); // --> Added to control item display
				}
				
				if (!needsSync && button && button._breadcrumbNodeId === id) {
					// reached a level in the hierarchy where we are already in sync.
					break;
				}

				text = currentNode.get(displayField);
				if (Ext.isNumber(shortenDisplay)) text = Ext.String.ellipsis(text, shortenDisplay);
				
				if (button) {
					// If we already have a button for this depth in the button cache reuse it
					button.setText(text);
				} else {
					// no button in the cache - make one and add it to the cache
					button = buttons[i] = Ext.create({
						isCrumb: true,
						xtype: me.getUseSplitButtons() ? 'splitbutton' : 'button',
						ui: me.getButtonUI(),
						componentCls: me._btnCls + ' ' + me._btnCls + '-' + me.ui,
						separateArrowStyling: false,
						text: text,
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
						scope: me,
						hidden: hidden // --> Added to control item display
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
				
				button.setArrowVisible(this.disableButtonMenu === true ? false : currentNode.hasChildNodes()); // --> Modified to control arrow display
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
					me.remove(buttons[i], false);
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
		 * Fires when the selected node changes. At render time, this event will fire
		 * indicating that the configured {@link #selection} has been selected.
		 * @param {Ext.toolbar.Breadcrumb} this 
		 * @param {Ext.data.TreeModel} node The selected node.
		 * @param {Ext.data.TreeModel} prevNode The previously selected node.
		 */
		me.fireEvent('selectionchange', me, node, prevNode);

		if (me._shouldFireChangeEvent) {
			/**
			 * @event change
			 * Fires when the user changes the selected record. In contrast to the
			 * {@link #selectionchange} event, this does *not* fire at render time,
			 * only in response to user activity.
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
		},
		
		_onMenuBeforeShow: function(menu) {
			return this.disableButtonMenu === true ? false : this.callParent(arguments);
		}
	}
});
