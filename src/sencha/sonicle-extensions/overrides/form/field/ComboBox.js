/**
 * Override default Ext.form.field.ComboBox
 * - Fix value NOT published when blurring-out quickly (remote + forceSelection false + value and display field set)	 WT-789
 * - (Ext 6.2 - seems the fix is not working anymore)
 *   Fix binding not updated (value remains outdated) under some circumstances 
 *   when forceSelection is `false` and queryMode is `local`:
 *     1) typing value and blurring out quickly from the field
 *     2) whole value is cleared out using Backspace or Canc when store is NOT loaded yet
 */
Ext.define('Sonicle.overrides.form.field.ComboBox', {
	override: 'Ext.form.field.ComboBox',
	
	doQueryTaskCount: 0,
	lastDoQueryTaskCount: 0,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.doQueryTask = new Ext.util.DelayedTask(Ext.Function.createInterceptor(me.doRawQuery, function() {
			me.doQueryTaskCount++;
		}), me);
		Ext.Function.interceptBefore(me.doQueryTask, 'delay', function() {
			me.lastDoQueryTaskCount = me.doQueryTaskCount;
		});
	},
	
	onBlur: function(e) {
		var me = this,
				inputEl = me.inputEl.dom;
		if (!me.forceSelection && me.queryMode === 'remote' && me.hasBindingValue && inputEl) {
			// When remote queries are enabled (remote queryMode) and the user can 
			// type in the field, if blur occurs too quickly after typing some text, 
			// not letting doQuery run (blur occurs before queryDelay value elapsed), 
			// the published value may NOT be updated. See WT-789 for more info!
			if (me.doQueryTaskCount === me.lastDoQueryTaskCount) {
				me.publishValue();
			}
		}
		me.callParent(arguments);
	}
	
	//Ext 7.4 - removing fix that may not work anymore
	/*onBlur: function() {
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
	}*/
});
