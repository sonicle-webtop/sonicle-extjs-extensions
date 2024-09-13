/**
 * Override original {@link Ext.layout.container.Box}
 * - Add new Visible overflow in requirements
 */
Ext.define('Sonicle.overrides.layout.container.Box', {
	override: 'Ext.layout.container.Box',
	requires: [
		'Sonicle.layout.container.boxOverflow.Visible'
	]
});
