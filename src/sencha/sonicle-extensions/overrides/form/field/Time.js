/**
 * Override default Ext.form.field.Time
 * - Add support to parse the time value in Hi format
 */

Ext.define('Sonicle.overrides.form.field.Time', {
	override: 'Ext.form.field.Time',

    initComponent: function() {
		var me = this;
		
		me.altFormats += '|Hi';
		me.callParent();
	}
});
