/**
 * Override original {@link Ext.button.Button}
 * - Add defaultUI config according to {@link Ext.button.Button#ui} in order to track what default value is
 */
Ext.define('Sonicle.overrides.button.Button', {
	override: 'Ext.button.Button',
	
	defaultUI: 'default'
});
