/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.tree.Utils', {
    singleton: true,
	
	/**
	 * Traverse node hierarchy upward calling specified function for each node 
	 * having a parent defined.
	 * @param {Ext.data.NodeInterface} node The node where to start traversing.
	 * @param {Ext.Function} fn The function to call for each traversed node.
	 * @param {Object} [scope] (optional) The scope (<code>this</code> reference) in which the function is executed.
	 */
	upTraverseEach: function(node, fn, scope) {
		var cnode = node;
		while (true) {
			if (!cnode) break;
			fn.call(scope || this, cnode, cnode.getId());
			cnode = cnode.parentNode;
		}
	},
	
	/*
	upTraverseHierarchyBy: function(node, fn, scope) {
		var cnode = node,
			hierarchy = [];
		while (true) {
			if (!cnode) break;
			if (fn.call(scope || this, cnode, cnode.getId()) === true) {
				hierarchy.push(cnode);
			}
			cnode = cnode.parentNode;
		}
		return hierarchy;
	},
	*/
	
	/**
	 * Find the index of the first matching Record in this Store by a function 
	 * regardless of visibility due to collapsed states; all nodes present in 
	 * the tree structure are searched.
	 * @param {Ext.tree.Panel} tree The Tree component on which operate.
	 * @param {Function} fn The function to be called. It will be passed the following parameters:
	 * @param {Ext.data.Model} fn.record The record to test for filtering. Access field values
	 * @param {Object} fn.id The ID of the Record passed.
	 * @param {Object} [scope] The scope (this reference) in which the function is executed. Defaults to the Store.
	 * @return {Ext.data.NodeInterface} The matched node or null
	 */
	findNodeBy: function(tree, fn, scope) {
		var sto = tree.getStore(),
			result;
		Ext.Object.eachValue(sto.byIdMap, function(node) {
			if (fn.call(scope || sto, node, node.getId()) === true) {
				result = node;
				return false;
			}
		});
		return result;
	}
});
