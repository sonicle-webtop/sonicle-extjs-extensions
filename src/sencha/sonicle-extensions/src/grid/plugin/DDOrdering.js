/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Sonicle.grid.plugin.DDOrdering', {
	extend: 'Ext.grid.plugin.DragDrop',
	alias: 'plugin.sogridviewddordering',
	
	orderField: null,
	
	init: function(view) {
		var me = this,
				gp = view.grid;
		me.callParent(arguments);
		gp.on('drop', me.onGripDrop, me);
	},
	
	destroy: function() {
		var me = this,
				gp = me.getCmp().grid;
		gp.un('drop', me.onGripDrop, me);
		me.callParent(arguments);
	},
	
	privates: {
		onGripDrop: function() {
			var me = this,
					gp = me.getCmp().grid,
					sto = gp.getStore(),
					of = me.orderField;

			if (sto && of) {
				sto.beginUpdate();
				sto.each(function(rec, indx) {
					rec.set(of, indx+1);
				});
				sto.endUpdate();
			}
		}
	}
});
