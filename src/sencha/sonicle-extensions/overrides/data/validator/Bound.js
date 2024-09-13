/**
 * Override original {@link Ext.data.validator.Bound}
 * - Add support to conditional validation
 */
Ext.define('Sonicle.overrides.data.validator.Bound', {
	override: 'Ext.data.validator.Bound',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	validate: function(v, rec) {
		return this.shouldValidate(v, rec) ? this.callParent(arguments) : true;
	}
});
