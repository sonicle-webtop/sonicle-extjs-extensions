/**
 * Override default Ext.data.validator.Format
 * - Add support to conditional validation
 */
Ext.define('Sonicle.overrides.data.validator.Format', {
	override: 'Ext.data.validator.Format',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	validate: function(v, rec) {
		return this.shouldValidate(v, rec) ? this.callParent(arguments) : true;
	}
});
