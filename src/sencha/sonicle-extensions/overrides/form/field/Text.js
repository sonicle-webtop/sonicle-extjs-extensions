/**
 * Override default Ext.form.field.Text
 * - Add support to position (left|right) config in triggers
 */
Ext.define('Sonicle.overrides.form.field.Text', {
	override: 'Ext.form.field.Text',
	
	preSubTpl: [
		'<div id="{cmpId}-triggerWrap" data-ref="triggerWrap"',
				'<tpl if="ariaEl == \'triggerWrap\'">',
					'<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
				'<tpl else>',
					' role="presentation"',
				'</tpl>',
				' class="{triggerWrapCls} {triggerWrapCls}-{ui}">',
			'<tpl for="triggers">{[this.renderTrigger("left", values, parent)]}</tpl>',
			'<div id={cmpId}-inputWrap data-ref="inputWrap"',
				' role="presentation" class="{inputWrapCls} {inputWrapCls}-{ui}">',
		{
			renderTrigger: function(position, values, parent) {
				return (position === values.position) ? values.renderTrigger(parent) : '';
			}
		}
    ],
	
	postSubTpl: [
			'<tpl if="!Ext.supports.Placeholder">',
			'<label id="{cmpId}-placeholderLabel" data-ref="placeholderLabel" for="{id}" class="{placeholderCoverCls} {placeholderCoverCls}-{ui}">{placeholder}</label>',
			'</tpl>',
			'</div>', // end inputWrap
			'<tpl for="triggers">{[this.renderTrigger("right", values, parent)]}</tpl>',
		'</div>', // end triggerWrap
		{
			renderTrigger: function(position, values, parent) {
				return (Ext.isEmpty(values.position) || (position === values.position)) ? values.renderTrigger(parent) : '';
			}
		}
    ]
});
