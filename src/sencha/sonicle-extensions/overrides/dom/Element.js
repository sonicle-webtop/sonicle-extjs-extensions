/**
 * Override original {@link Ext.dom.Element}
 * - Add support to !important keyword in setDisplayed: orig impl. seems strip !important in value, so use dom.style
 */
Ext.define('Sonicle.overrides.dom.Element', {
	override: 'Ext.dom.Element',
	
	setDisplayed: function(value) {
		var me = this, iof;
		
		// Orig impl. strips !important keyword in value, so use setProperty of dom.style here!
		if (Ext.isString(value)) {
			iof = value.indexOf('!important');
			if (iof !== -1) {
				value = Ext.String.trim(value.substring(0, iof));
				var ret = me.callParent([value]);
				me.dom.style.setProperty('display', value, 'important');
				return ret;
			}
		}	
		return me.callParent(arguments);
	}
});