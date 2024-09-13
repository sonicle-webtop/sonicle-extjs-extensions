/**
 * Override original {@link Ext.form.FieldContainer}
 * - Add support to focusing first valid field when container's label, 
 *   if any, is clicked. This is the common behaviour whed the label is 
 *   specified directly into the field.
 */
Ext.define('Sonicle.overrides.form.FieldContainer', {
	override: 'Ext.form.FieldContainer',
	
	/**
	 * @cfg {Boolean} [labelIsForFirstField=true]
	 * Specifies weather the label needs to be bound dinamically to the first 
	 * field found in items, focusing it when clicking over the label.
	 */
	labelIsForFirstField: true,
	
	getInputId: function() {
		var me = this,
			inputId = '';
		if (!Ext.isEmpty(me.getFieldLabel()) && me.labelIsForFirstField === true) {
			// Returns a valid itemId if found: this forces the application of `for` attibute. 
			me.items.each(function(item) {
				if (item.isXType('field') && !Ext.isEmpty(item.inputId)) {
					inputId = item.inputId;
					return false;
				}
			});
		}
		return inputId;
	}
});