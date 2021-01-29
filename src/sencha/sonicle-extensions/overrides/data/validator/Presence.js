/**
 * Override default Ext.data.validator.Presence
 * - Add support to conditional validation
 */
Ext.define('Sonicle.overrides.data.validator.Presence', {
	override: 'Ext.data.validator.Presence',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	validate: function(v, rec) {
		return this.shouldValidate(v, rec) ? this.callParent(arguments) : true;
	}
});
