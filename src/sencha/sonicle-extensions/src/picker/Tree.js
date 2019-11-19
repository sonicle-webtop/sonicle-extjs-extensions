/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.picker.Tree', {
	extend: 'Ext.ux.TreePicker',
	alias: 'widget.sotreepicker',
	
	/**
	 * @cfg {Object} pickerConfig
	 * An optional set of configuration properties that will be merged and passed to the {@link Ext.tree.Panel}'s constructor.
	 * 
	 *	pickerConfig: {
	 *		useArrows: true,
	 * 		rootVisible: false,
	 * 		listeners: {
	 *			// block click on certain nodes
	 * 			beforeitemclick: function(s, rec, itm, idx, e) {
	 * 				if (!rec.isFolder()) {
	 * 					e.stopEvent();
	 * 					return false;
	 * 				}
	 * 			},
	 * 			// avoid selection of certain nodes
	 * 			beforeselect: function(s, rec, indx) {
	 * 				if (!rec.isFolder()) return false;
	 * 			}
	 * 		}
	 * 	}
	 */
	
	/**
	 * Overrides default implementation in order to apply pickerConfig merge.
	 */
	createPicker: function() {
        var me = this,
				picker = new Ext.tree.Panel(Ext.merge(me.pickerConfig || {}, {
					baseCls: Ext.baseCSSPrefix + 'boundlist',
					shrinkWrapDock: 2,
					store: me.store,
					floating: true,
					displayField: me.displayField,
					columns: me.columns,
					minHeight: me.minPickerHeight,
					maxHeight: me.maxPickerHeight,
					manageHeight: false,
					shadow: false,
					listeners: {
						scope: me,
						itemclick: me.onItemClick,
						itemkeydown: me.onPickerKeyDown
					}
				})),
				view = picker.getView();

		if (Ext.isIE9 && Ext.isStrict) {
			// In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
			// Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
			view.on({
				scope: me,
				highlightitem: me.repaintPickerView,
				unhighlightitem: me.repaintPickerView,
				afteritemexpand: me.repaintPickerView,
				afteritemcollapse: me.repaintPickerView
			});
		}
		return picker;	
	}
});
