/**
 * Override original {@link Ext.form.field.Picker}
 * - Add explicit CSS class (x-form-field-picker) to help distinguishing pickers from base textfields
 */
Ext.define('Sonicle.overrides.form.field.Picker', {
	override: 'Ext.form.field.Picker',
	
	initComponent: function() {
		var me = this;
		me.addCls(me.fieldCls + '-picker');
		me.callParent(arguments);
	}
});