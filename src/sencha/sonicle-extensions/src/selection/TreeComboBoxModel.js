/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Provide a workaround for implementation of treefield. 
Ext.define('Sonicle.selection.TreeComboBoxModel', {
    extend: 'Ext.selection.TreeModel',
	alias: 'selection.sotreecomboboxmodel',
		
    onSelectChange: function (record, isSelected, suppressEvent, commitFn) {
        var me = this,
            views = me.views || [
                me.view
            ],
            viewsLn = views.length,
            recordIndex = me.store.indexOf(record),
            eventName = isSelected ? 'select' : 'deselect',
            i, view;
        if (!suppressEvent && me.eventsSuppressed) {
            suppressEvent = true; 
        }
        if ((suppressEvent || me.fireEvent('before' + eventName, me, record, recordIndex)) !== false && commitFn() !== false) {
            for (i = 0; i < viewsLn; i++) {
                view = views[i];
                if (view) {
                    recordIndex = view.indexOf(record);
                    if (view.indexOf(record) !== -1) {
                        if (isSelected) {
                            view.onRowSelect(recordIndex, suppressEvent);
                        } else {
                            view.onRowDeselect(recordIndex, suppressEvent);
                        }
                    }
                }
            }
            if (!suppressEvent) {
                me.fireEvent(eventName, me, record, recordIndex);
            }
        }
    }
});
    
