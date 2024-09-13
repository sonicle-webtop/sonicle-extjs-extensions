/**
 * Override default {@link Ext.app.ViewModel}
 * - Add support to onRecordCreateWithId before record load
 */
Ext.define('Sonicle.overrides.app.ViewModel', {
	override: 'Ext.app.ViewModel',
	
	/**
	 * @cfg {Function/String} onRecordCreateWithId
	 * A custom function to hook into record creation process. This is useful
	 * for eg. injecting some extra-params before leaving a Model load itself
	 * using its proxy.
	 * @param {Ext.data.Model} model The model being loaded
	 * @param {Object} id Model's ID value
	 */
	onRecordCreateWithId: null,
	
	privates: {
		getRecord: function(type, id) {
			var me = this,
					session = me.getSession(),
					Model = type,
					hasId = id !== undefined,
					record;

			if (session) {
				if (hasId) {
					record = session.getRecord(type, id);
				} else {
					record = session.createRecord(type);
				}
			} else {
				if (!Model.$isClass) {
					Model = me.getSchema().getEntity(Model);
				}
				if (hasId) {
					record = Model.createWithId(id);
					Ext.callback(me.onRecordCreateWithId, me, [record, id]); // Add call to hook method
					record.load();
				} else {
					record = new Model();
				}
			}
			return record;
		}
	}
});

