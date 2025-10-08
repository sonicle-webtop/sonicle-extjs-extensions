/**
 * Override original {@link Ext}
 * - Set a value for Sonicle.baseCSSPrefix: this file is the first being included 
 *   in output file, so let's use it to provide customizations at early stage.
 */
Ext.define('Sonicle.overrides.Ext', {
	override: 'Ext'
});
Ext.ns('Sonicle');
Sonicle.baseCSSPrefix = 'so-';