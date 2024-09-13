/**
 * Override original {@link Ext.data.validator.Format}
 * - Add support to conditional validation (through ConditionalValidator mixin)
 * - Supports many matchers (as array) to perform an OR validation.
 */
Ext.define('Sonicle.overrides.data.validator.Format', {
	override: 'Ext.data.validator.Format',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	validate: function(v, rec) {
		var me = this,
			matchers = Ext.Array.from(me.getMatcher()),
			i = 0;
		if (!me.shouldValidate(v, rec)) return true;
		for (; i<matchers.length; i++) {
			if (matchers[i] && matchers[i].test(v)) return true;
		}
		// We reach this only when validation fails!
		return me.getMessage();
	}
});
