/**
 * Override original {@link Ext.form.trigger.Trigger}
 * - Add support to CSS class for left-handed positioning
 */
Ext.define('Sonicle.overrides.form.trigger.Trigger', {
	override: 'Ext.form.trigger.Trigger',
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link #renderTpl}
	 * - Added function to compute CSS Class dependent to trigger position
	 */
	renderTpl: [
		'<div id="{triggerId}" class="{baseCls} {baseCls}-{ui} {cls} {cls}-{ui} {extraCls} ',
				'{[this.positionCls(values)]} ', // <-- added
				'{childElCls}"<tpl if="triggerStyle"> style="{triggerStyle}"</tpl>',
				'<tpl if="ariaRole"> role="{ariaRole}"<tpl else> role="presentation"</tpl>',
			'>',
			'{[values.$trigger.renderBody(values)]}',
		'</div>',
		// <-- added
		{
			positionCls: function(values) {
				var cmp = values.$trigger;
				return values.baseCls + '-' + (cmp.position === 'left' ? 'left' : 'right');
			}
		}
	]
});