/**
 * Override default Ext.form.field.Tag
 * - Add support to returnValueMode in order to customize getValue return type
 */
Ext.define('Sonicle.overrides.form.field.Tag', {
	override: 'Ext.form.field.Tag',
	
	/**
	 * @cfg {array|string} returnValueMode
	 */
	returnValueMode: 'array',
	
	getValue: function() {
		var me = this,
			value = me.callParent();
		if ('string' === me.returnValueMode) {
			return value ? Sonicle.String.join(',', value) : value;
		} else {
			return value;
		}
	}
});
