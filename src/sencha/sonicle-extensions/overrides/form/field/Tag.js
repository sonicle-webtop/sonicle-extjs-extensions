/**
 * Override original {@link Ext.form.field.Tag}
 * - Add support to getValueMode in order to customize getValue return type
 */
Ext.define('Sonicle.overrides.form.field.Tag', {
	override: 'Ext.form.field.Tag',
	
	/**
	 * @cfg {array|string} getValueMode
	 */
	getValueMode: 'array',
	
	getValue: function() {
		var me = this,
			value = me.callParent();
		if ('string' === me.getValueMode) {
			return value ? Sonicle.String.join(',', value) : value;
		} else {
			return value;
		}
	}
});
