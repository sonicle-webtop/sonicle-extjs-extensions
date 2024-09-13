/**
 * Override original {@link Ext.grid.plugin.RowWidget}
 * - Default implementation tracks expanded rows using their internal ID; 
 *   this NOT guarantee the correct expansion of the row after reloading the 
 *   source Store: we replaced record.internalId with record.getId()
 *   This logic is wrapped into toRecordKey() function, see below!
 */
Ext.define('Sonicle.overrides.grid.plugin.RowWidget', {
	override: 'Ext.grid.plugin.RowWidget',
	
	useRecordIdAsKey: true,
	
	addCollapsedCls: {
		fn: function (out, values, parent) {
			var me = this.rowExpander;

			if (!me.recordsExpanded[me.toRecordKey(values.record)]) {
				values.itemClasses.push(me.rowCollapsedCls);
			}

			this.nextTpl.applyOut(values, out, parent);
		},

		// We need a high priority to get in ahead of the outerRowTpl
		// so we can setup row data
		priority: 20000
	},
	
	setupRowData: function (record, rowIndex, rowValues) {
		var me = this.rowExpander;

		me.rowBodyFeature = this;
		rowValues.rowBodyCls = me.recordsExpanded[me.toRecordKey(record)] ? '' : me.rowBodyHiddenCls;
	},
	
	privates: {
		onItemAdd: function (newRecords, startIndex, newItems, view) {
			var me = this,
					len = newItems.length,
					i,
					record,
					ownerLockable = me.grid.lockable;

			// May be multiple widgets being layed out here
			Ext.suspendLayouts();

			for (i = 0; i < len; i++) {
				record = newRecords[i];

				if (!record.isNonData && me.recordsExpanded[me.toRecordKey(record)]) {
					// If any added items are expanded, we will need a syncRowHeights
					// call on next layout
					if (ownerLockable) {
						me.grid.syncRowHeightOnNextLayout = true;
					}

					me.addWidget(view, record);
				}
			}

			Ext.resumeLayouts(true);
		},
		
		onViewRefresh: function(view, records) {
            var me = this,
                rows = view.all,
                itemIndex, recordIndex;
 
            Ext.suspendLayouts();
 
            // eslint-disable-next-line max-len
            for (itemIndex = rows.startIndex, recordIndex = 0; itemIndex <= rows.endIndex; itemIndex++, recordIndex++) {
                if (me.recordsExpanded[me.toRecordKey(records[recordIndex])]) {
                    me.addWidget(view, records[recordIndex]);
                }
            }
 
            Ext.resumeLayouts(true);
        },
		
		addWidget: function(view, record) {
            var me = this,
                target,
                width,
                widget,
                hasAttach = !!me.onWidgetAttach,
                isFixedSize = me.isFixedSize,
                el;
 
            // If the record is non data (placeholder), or not expanded, return
            if (record.isNonData || !me.recordsExpanded[me.toRecordKey(record)]) {
                return;
            }
 
            target = Ext.fly(view.getNode(record).querySelector(me.rowBodyFeature.innerSelector));
            width = target.getWidth(true) - target.getPadding('lr');
            widget = me.getWidget(view, record);
 
            // Might be no widget if we are handling a lockable grid
            // and only one side has a widget definition.
            if (widget) {
                if (hasAttach) {
                    Ext.callback(me.onWidgetAttach, me.scope, [me, widget, record], 0, me);
                }
 
                el = widget.el || widget.element;
 
                if (el) {
                    target.dom.appendChild(el.dom);
 
                    if (!isFixedSize && widget.width !== width) {
                        widget.setWidth(width);
                    }
                    else {
                        widget.updateLayout();
                    }
 
                    widget.reattachToBody();
                }
                else {
                    if (!isFixedSize) {
                        widget.width = width;
                    }
 
                    widget.render(target);
                }
 
                widget.updateLayout();
            }
 
            return widget;
        },
		
		toggleRow: function(rowIdx, record) {
            var me = this,
                // If we are handling a lockable assembly,
                // handle the normal view first
                view = me.normalView || me.view,
                rowNode = view.getNode(rowIdx),
                normalRow = Ext.fly(rowNode),
                lockedRow,
                nextBd = normalRow.down(me.rowBodyTrSelector, true),
                wasCollapsed = normalRow.hasCls(me.rowCollapsedCls),
                addOrRemoveCls = wasCollapsed ? 'removeCls' : 'addCls',
                ownerLockable = me.grid.lockable && me.grid,
                widget, vm;
 
            normalRow[addOrRemoveCls](me.rowCollapsedCls);
            Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
 
            // All layouts must be coalesced.
            // Particularly important for locking assemblies which need
            // to sync row height on the next layout.
            Ext.suspendLayouts();
 
            // We're expanding
            if (wasCollapsed) {
                me.recordsExpanded[me.toRecordKey(record)] = true;
                widget = me.addWidget(view, record);
                vm = widget.lookupViewModel();
            }
            else {
                delete me.recordsExpanded[me.toRecordKey(record)];
                widget = me.getWidget(view, record);
            }
 
            // Sync the collapsed/hidden classes on the locked side
            if (ownerLockable) {
 
                // Only attempt to toggle lockable side if it is visible.
                if (ownerLockable.lockedGrid.isVisible()) {
 
                    view = me.lockedView;
 
                    // Process the locked side.
                    lockedRow = Ext.fly(view.getNode(rowIdx));
 
                    // Just because the grid is locked, doesn't mean we'll necessarily
                    // have a locked row.
                    if (lockedRow) {
                        lockedRow[addOrRemoveCls](me.rowCollapsedCls);
 
                        // If there is a template for expander content in the locked side,
                        // toggle that side too
                        nextBd = lockedRow.down(me.rowBodyTrSelector, true);
                        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
 
                        // Pass an array if we're in a lockable assembly.
                        if (wasCollapsed && me.lockedWidget) {
                            widget = [widget, me.addWidget(view, record)];
                        }
                        else {
                            widget = [widget, me.getWidget(view, record)];
                        }
 
                    }
 
                    // We're going to need a layout run to synchronize row heights
                    ownerLockable.syncRowHeightOnNextLayout = true;
                }
            }
 
            me.view.fireEvent(wasCollapsed ? 'expandbody' : 'collapsebody', rowNode, record,
                              nextBd, widget);
 
            view.updateLayout();
 
            // Before layouts are resumed, if we have *expanded* the widget row,
            // then ensure bound data is flushed into the widget so that it assumes its final size.
            if (vm) {
                vm.notify();
            }
 
            Ext.resumeLayouts(true);
 
            if (me.scrollIntoViewOnExpand && wasCollapsed) {
                me.grid.ensureVisible(rowIdx);
            }
        },
		
		toRecordKey: function(record) {
			return this.useRecordIdAsKey === true ? record.getId() : record.internalId;
		}
	}
});
