/**
 * Override default Ext.data.Model
 * - Add support to associations: set associated data and check dirty status
 */
Ext.define('Sonicle.overrides.data.Model', {
	override: 'Ext.data.Model',
	
	setAssociated: function(data) {
		var me = this, 
				asso, sto, assoData;
		
		Ext.iterate(me.associations, function(name) {
			asso = me.associations[name];
			sto = me[asso.getterName]();
			if (sto) {
				assoData = data[asso.role];
				if (assoData) sto.add(assoData);
			}
		});
	},
	
	/**
	 * Evaluates model's dirty status taking into account associations.
	 * @returns {Boolean}
	 */
	isDirty: function() {
		var me = this, 
				dirty = me.dirty, asso, sto;
		
		if (dirty) return true; // If already dirty, return true directly...
		// Otherwise evaluate associations (if present)
		Ext.iterate(me.associations, function(name) {
			asso = me.associations[name];
			sto = me[asso.getterName]();
			if (sto && sto.needsSync) {
				dirty = true;
				return;
			}
		});
		return dirty;
	}
});
