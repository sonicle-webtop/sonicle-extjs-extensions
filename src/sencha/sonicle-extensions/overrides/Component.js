/**
 * Override default Component for extending Ext.mixin.Bindable behaviour
 * - restore setReference availability: starting from Ext 6.5, reference NOT uses config system anymore
 */
Ext.define('Sonicle.overrides.Component', {
	override: 'Ext.Component',
	
	setReference: function(reference) {
		var me = this,
				validIdRe = me.validRefRe || Ext.validIdRe;
		if (reference && !validIdRe.test(reference)) {
			Ext.raise('Invalid reference "' + reference + '" for ' + me.getId() + ' - not a valid identifier');
		} else {
			me.reference = reference;
		}
	}
});
