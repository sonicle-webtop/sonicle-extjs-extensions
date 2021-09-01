/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.tree.plugin.ExpandStateRestore', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.so-treeexpandstaterestore',
	
	/**
	 * @readonly
	 * @property {Ext.tree.Panel} tree
	 */
	
	/**
	 * @private
	 * @property {Object} expandedNodes
	 */
	
	expandPending: 0,
	
	init: function(tree) {
		var me = this;
		me.tree = tree;
		me.expandedNodes = {};
		
		tree.on({
			afteritemexpand: me.onAfterItemExpand,
			afteritemcollapse: me.onAfterItemCollapse,
			load: me.onStoreLoad,
			scope: me
		});
	},
	
	destroy: function() {
		var me = this,
				tree = me.tree;
		if (tree) {
			tree.un('afteritemexpand', me.onAfterItemExpand, me);
			tree.un('afteritemcollapse', me.onAfterItemCollapse, me);
			tree.un('load', me.onStoreLoad, me);
		}
		delete me.expandedNodes;
		delete me.tree;
	},
	
	privates: {
		onAfterItemExpand: function(node, indx, itm) {
			if (this.expandPending === 0) {
				this.expandedNodes[node.getId()] = node.getPath();
			}
		},

		onAfterItemCollapse: function(node, indx, itm) {
			var me = this,
					nPath = node.getPath();
			// Remove collapsed node
			delete me.expandedNodes[node.getId()];
			// Clears any saved node under the collapsed one
			Ext.iterate(me.expandedNodes, function(id, path) {
				if (Sonicle.String.startsWith(path, nPath)) delete me.expandedNodes[id];
			});
		},
		
		onStoreLoad: function(sto, recs, success, op, node) {
			var me = this;
			//console.log('Loaded '+node.getId()+' ['+node.getPath()+']');
			if (success && me.wasExpanded(node) && me.expandPending === 0) {
				me.expandPending++;
				Ext.iterate(me.collectPathsToRestore(node), function(path) {	
					//console.log('Expanding '+path);
					me.expandPending++;
					me.tree.expandPath(path, {
						callback: function() {
							me.expandPending--;
						}
					});
				});
				me.expandPending--;
			}
		},
		
		wasExpanded: function(node) {
			return Ext.isDefined(this.expandedNodes[node.getId()]);
		},
		
		collectPathsToRestore: function(node) {
			var nId = node.getId(),
					nPath = node.getPath(),
					isAncestorPath = function(paths, index) {
						var path = paths[index], i;
						for (i = index+1; i < paths.length; i++) {
							if (Sonicle.String.startsWith(paths[i], path)) return true;
						}
						return false;
					},
					paths = [],
					ret = [];
			
			// Collect candidates paths
			Ext.iterate(this.expandedNodes, function(id, path) {
				if (id === nId) return;
				if (Sonicle.String.startsWith(path, nPath)) paths.push(path);
			});
			
			// Exclude paths contained in each others
			Ext.iterate(paths, function(path, indx) {
				if (!isAncestorPath(paths, indx)) ret.push(path);
			});
			
			return ret;
		}
	}
});
