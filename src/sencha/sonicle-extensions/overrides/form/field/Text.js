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
   
   /*
	* On 6.2 this code was to keep caret position on focus
	* instead of always going to the end
	*/
   /*onFocus: function(e) {
        var me = this,
            len;
 
		//avoid parent code
        me.callSuper([e]);
        
        // This handler may be called when the focus has already shifted to another element;
        // calling inputEl.select() will forcibly focus again it which in turn might set up
        // a nasty circular race condition if focusEl !== inputEl.
        Ext.asap(function() {
            // This ensures the carret will be at the end of the input element
            // while tabbing between editors.
            if (!me.destroyed && document.activeElement === me.inputEl.dom) {
                len = me.inputEl.dom.value.length;
				//ext 6.2 : this is the modified code
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
    },*/
	
	/**
	 * Gets the current inputEl cursor position.
	 * @returns {Integer} The cursor position.
	 */
	getCaretPosition: function() {
		var el = this.inputEl, rng, ii = -1;
		if (el && typeof el.dom.selectionStart === 'number') {
			ii = el.dom.selectionStart;
		} else if (el && document.selection && el.dom.createTextRange) {
			rng = document.selection.createRange();
			rng.collapse(true);
			rng.moveStart('character', -el.value.length);
			ii = rng.text.length;
		}
		return ii;
	},
	
	/**
	 * Sets the inputEl cursor position.
	 * @param {Integer} pos The desired cursor position.
	 */
	setCaretPosition: function(pos) {
		var el = this.inputEl, rng;
		if (el && typeof el.dom.selectionStart === 'number') {
			el.dom.selectionStart = el.dom.selectionEnd = pos;
		} else if (el && document.selection && el.dom.createTextRange) {
			rng = document.selection.createRange();
			rng.move('character', pos);
			rng.select();
		}
	},
	
	/**
	 * Computes some metrics about text selection.
	 * @returns {Object} An object with `selStart`, `selEnd`, `beforeText`, `text` and `afterText` properties.
	 */
	getTextSelection: function() {
		var me = this,
				el = me.inputEl;
		
		if (el && el.dom) {
			var dom = el.dom;
			if (typeof dom.selectionStart === 'number' && typeof dom.selectionEnd === 'number') {
				if (dom.selectionEnd > dom.selectionStart) {
					return {
						selStart: dom.selectionStart,
						selEnd: dom.selectionEnd,
						beforeText: dom.value.substr(0, dom.selectionStart),
						text: dom.value.substr(dom.selectionStart, dom.selectionEnd-dom.selectionStart),
						afterText: dom.value.substr(dom.selectionEnd)
					};
				}
			} else {
				var rng = document.selection.createRange(), trng, startRng, endRng;
				if (rng && (rng.parentElement() === dom)) {
						trng = dom.createTextRange();
						trng.moveToBookmark(rng.getBookmark());

						startRng = dom.createTextRange();
						startRng.collapse(true);
						startRng.setEndPoint("EndToStart", trng);
						endRng = dom.createTextRange();
						endRng.setEndPoint("StartToEnd", trng);

						return {
							selStart: startRng.text.length,
							selEnd: startRng.text.length + trng.text.length,
							beforeText: startRng.text,
							text: trng.text,
							afterText: endRng.text
						};
					}
			}
		}
		return undefined;
	}
});
