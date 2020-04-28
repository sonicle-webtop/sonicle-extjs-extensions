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
    ],
	
	/*
	.x-form-trigger-wrap > .x-form-trigger:first-child {
	border-left: 1px solid #b5b8c8;
}
	*/
   
   onFocus: function(e) {
        var me = this,
            len;
 
        me.callSuper([e]);
        
        // This handler may be called when the focus has already shifted to another element;
        // calling inputEl.select() will forcibly focus again it which in turn might set up
        // a nasty circular race condition if focusEl !== inputEl.
        Ext.asap(function() {
            // This ensures the carret will be at the end of the input element
            // while tabbing between editors.
            if (!me.destroyed && document.activeElement === me.inputEl.dom) {
                len = me.inputEl.dom.value.length;
                if (me.selectOnFocus) me.selectText(0, len);
            }
        });
 
        if (me.emptyText) {
            me.autoSize();
        }
 
        me.addCls(me.fieldFocusCls);
        me.triggerWrap.addCls(me.triggerWrapFocusCls);
        me.inputWrap.addCls(me.inputWrapFocusCls);
        me.invokeTriggers('onFieldFocus', [e]);
    }
   
});
