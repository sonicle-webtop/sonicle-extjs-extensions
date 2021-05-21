/**
 * Override default Ext.form.field.ComboBox
 * - Fix binding not updated (value remains outdated) under some circumstances 
 *   when forceSelection is `false` and queryMode is `local`:
 *     1) typing value and blurring out quickly from the field
 *     2) whole value is cleared out using Backspace or Canc when store is NOT loaded yet
 */
Ext.define('Sonicle.overrides.form.field.ComboBox', {
	override: 'Ext.form.field.ComboBox',
	
	onBlur: function() {
		var me = this,
				sto = me.getStore();
		if (!me.destroying && sto) {
			if (!me.forceSelection && me.queryMode !== 'local') {
				if (Ext.isEmpty(me.getValue()) && !sto.isLoaded()) { // case 2
					me.publishValue();
				} else { // case 1
					me.checkChange();
				}
			}
		}
		me.callParent(arguments);
	}
});
