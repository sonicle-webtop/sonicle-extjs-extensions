/**
 * Override original {@link Ext.data.TreeStore}
 * - Support bulk-loading, filling childNodes if record is marked as loaded
 *   https://stackoverflow.com/questions/60411619/extjs-6-7-treelist-load-data-infinite-from-remote-store
 */
Ext.define('Sonicle.overrides.data.TreeStore', {
	override: 'Ext.data.TreeStore',
	
	/**
	 * @cfg {Boolean} [hierarchyBulkLoad=false]
	 * Set to `true` to automatically fill inner childNodes if node itself 
	 * is marked as loaded.
	 */
	hierarchyBulkLoad: false,
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.data.TreeStore#onProxyLoad}
	 * - Added fillLoadedNodes call
	 */
	onProxyLoad: function(operation) {
		var me = this,
			options = operation.initialConfig,
			successful = operation.wasSuccessful(),
			records = operation.getRecords(),
			node = options.node,
			isRootLoad = options.isRootLoad,
			scope = operation.getScope() || me,
			args = [records, operation, successful];

		if (me.destroyed) {
			return;
		}

		me.loading = false;
		node.set('loading', false);

		if (successful) {
			++me.loadCount;

			if (!me.getClearOnLoad()) {
				records = me.cleanRecords(node, records);
			}

			// Nodes are in linear form, linked to the parent using a parentId property
			if (me.getParentIdProperty()) {
				records = me.treeify(node, records);
			}

			if (isRootLoad) {
				me.suspendEvent('add', 'update');
			}

			records = me.fillNode(node, records);
			if (isRootLoad && me.hierarchyBulkLoad === true) { // <-- added
				me.fillLoadedNodes(node, records);
			}
		}
 
        // The load event has an extra node parameter
        // (differing from the load event described in AbstractStore)
        /**
         * @event load
         * Fires whenever the store reads data from a remote data source.
         * @param {Ext.data.TreeStore} this 
         * @param {Ext.data.TreeModel[]} records An array of records.
         * @param {Boolean} successful True if the operation was successful.
         * @param {Ext.data.operation.Operation} operation The operation that triggered this load.
         * @param {Ext.data.NodeInterface} node The node that was loaded.
         */
 
		Ext.callback(options.onChildNodesAvailable, scope, args);

		if (isRootLoad) {
			me.resumeEvent('add', 'update');
			me.callObservers('BeforePopulate');
			me.fireEvent('datachanged', me);
			me.fireEvent('refresh', me);
			me.callObservers('AfterPopulate');
		}

        me.fireEvent('load', me, records, successful, operation, node);
    },
	
	privates: {
		fillLoadedNodes: function(node, records) {
			var me = this;
			if (++me.bulkUpdate === 1) {
				me.suspendEvent('datachanged');
			}
			me.fillLoadedNodesRecursive(node, records);
			if (!--me.bulkUpdate) {
				me.resumeEvent('datachanged');
			}
		},

		fillLoadedNodesRecursive: function(node, records) {
			var me = this;
			Ext.iterate(node.childNodes, function(childNode) {
				if (childNode.isLoaded()) {
					var newNodes = childNode.get('children');
					if (Ext.isArray(newNodes)) {
						childNode.appendChild(newNodes, undefined, true);
						me.fillLoadedNodesRecursive(childNode, newNodes);
					}
				}
			});
		}
	}
});