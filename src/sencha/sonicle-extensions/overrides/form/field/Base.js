/**
 * Override original {@link Ext.form.field.Base}
 * - ensure binded model being updated: the original implementation do not 
 *  publish the  value if there are any validation errors (see {@link Ext.form.field.Field#getErrors getErrors}).
 *  You can check this by adding a presence validator on binded field, if you 
 *  select all text of a textarea and then press CANC or BACKSPACE, you will see 
 *  that field become red with no value but model's field raw value remain as it 
 *  was with an outdated value.
 */
Ext.define('Sonicle.overrides.form.field.Base', {
	override: 'Ext.form.field.Base',
	mixins: ['Sonicle.form.Labelable'],
	
	publishValue: function() {
		var me = this;
		if (me.rendered && me.getValidationField()) {
			me.publishState('value', me.getValue());
		} else {
			me.callParent();
		}
	},
	
	/**
	 * Override original {@link Ext.form.FieldContainer#getLabelableRenderData}
	 *  - Modify retured data (thus is not possible using a override direct in {@link Ext.form.Labelable} mixin)
	 */
	getLabelableRenderData: function() {
		return this.overrideLabelableRenderData(this.callParent(arguments));
	}
});
