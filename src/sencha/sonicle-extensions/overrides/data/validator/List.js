/**
 * Override original {@link Ext.data.validator.Bound}
 * - Add support to conditional validation
 */
Ext.define('Sonicle.overrides.data.validator.List', {
	override: 'Ext.data.validator.List',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	validate: function(v, rec) {
		return this.shouldValidate(v, rec) ? this.callParent(arguments) : true;
	}
});
