/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.tree.Panel', {
	extend: 'Ext.tree.Panel',
	alias: ['widget.sotreepanel'],
	
	/**
	 * @cfg {Boolean} [statefulExpansion]
	 * Set to `true` to perform node expansion based on saved state.
	 * Note that {@link #stateful} config must be enabled to use this feature.
	 */
	statefulExpansion: false,
	
	/**
	 * @cfg {Object} [defaultExpandedNodesState]
	 * The default state object to use for expansion state initialization: it 
	 * must contain a key/value pair where the key is the ID and the value 
	 * is the path of the node to be expanded by default.
	 * Note that {@link #statefulExpansion} config must be enabled to use this.
	 */
	
	/**
	 * @cfg {Boolean} [expandAllOnLoad]
	 * Set to `true` to expand all nodes on first load.
	 */
	expandAllOnLoad: false,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		if (me.statefulExpansion === true) {
			me.expandedNodes = {};
			me.addStateEvents(['expandnode', 'collapsenode']);
			me.on({
				scope: me,
				beforeitemexpand: me.beforeStatefulItemExpand,
				beforeitemcollapse: me.beforeStatefulItemCollapse
			});
		}
	},
	
	afterRender: function() {
		var me = this,
			sto = me.store,
			doFn = function() {
				if (me.expandAllOnLoad) {
					me.expandAll();
				} else if (me.statefulExpansion === true) {
					me.restoreExpansionState();
				}
			};
		
		me.callParent(arguments);
		if (sto) {
			if (sto.isLoaded()) {
				doFn();
			} else {
				sto.on('load', function() {
					doFn();
				}, me, {single: true});
			}
		}
	},
	
	getState: function() {
		var me = this,
			state = me.callParent();
		if (me.statefulExpansion === true) {
			if (Ext.isObject(me.defaultExpandedNodesState)) {
				if (!state || (state && !Ext.isDefined(state.expandedNodes))) Ext.apply(me.expandedNodes, me.defaultExpandedNodesState);
			}
			Ext.apply(state || {}, {
				expandedNodes: me.expandedNodes
			});
		}
		return state;
	},
	
	privates: {
		
		beforeStatefulItemExpand: function(node) {
			var me = this,
				id = node.id;
			if (!me.restoringExpansionState && !Ext.isEmpty(id)) {
				me.expandedNodes[id] = node.getPath();
				me.saveState();
			}
		},
		
		beforeStatefulItemCollapse: function(node) {
			var me = this,
				id = node.id;
			if (!Ext.isEmpty(id)) {
				delete me.expandedNodes[id];
				node.cascade(function(child) {
					if (!Ext.isEmpty(child.id)) {
						delete me.expandedNodes[child.id];
					}
				});
				me.saveState();
			}
		},
		
		restoreExpansionState: function() {
			var me = this,
				state = Ext.state.Manager.get(me.stateId);
			
			if (state && state.expandedNodes) {
				me.expandedNodes = state.expandedNodes;
				me.expandNodes(Ext.Array.sort(Ext.Object.getAllKeys(state.expandedNodes)), function() {
					me.fireEvent('expansionstaterestored', me, state.expandedNodes);
				});
			} else {
				me.fireEvent('expansionstaterestored', me, null);
			}
		},
		
		expandNodes: function(ids, callback, idx) {
			if (idx === undefined) idx = 0;
			var me = this, node;
			if (idx < ids.length) {
				me.restoringExpansionState = true;
				node = me.store.getById(ids[idx]);
				if (node) {
					me.expandNode(node, false, function() {
						me.expandNodes(ids, callback, idx+1);
					});
				} else {
					me.expandNodes(ids, callback, idx+1);
				}
			} else {
				me.restoringExpansionState = false;
				Ext.callback(callback, me);
			}
		}
	}
});