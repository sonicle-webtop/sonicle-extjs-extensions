/**
 * Override default Ext.grid.column.Check
 * - Fix broken rendering: in ExtJS 7.5 if text containing HTML with attributes, 
 *   the rendered markup is broken (EXTJS-29315)
 */
Ext.define('Sonicle.overrides.grid.column.Check', {
	override: 'Ext.grid.column.Check',
	
	defaultRenderer: function(value, cellValues) {
		var me = this,
			cls = me.checkboxCls,
			tip = '';
		
		if (me.invert) {
			value = !value;
		}
		
		if (me.disabled) {
			cellValues.tdCls += ' ' + me.disabledCls;
		}
		
		if (value) {
			cls += ' ' + me.checkboxCheckedCls;
			tip = me.checkedTooltip;
		} else {
			tip = me.tooltip;
		}
 
		if (tip) {
			cellValues.tdAttr += ' data-qtip="' + Ext.htmlEncode(tip) + '"';
		}
		
		if (me.useAriaElements) {
            cellValues.tdAttr += ' aria-describedby="' + me.id + '-cell-description' + (!value ? '-not' : '') + '-selected"';
		}
		
		// This will update the header state on the next animation frame
		// after all rows have been rendered.
		me.updateHeaderState();
		
		return '<span class="' + cls + '" role="' + me.checkboxAriaRole +
				'" aria-label="' + Ext.htmlEncode(me.text) + '"' + // Added encoding
				(!me.ariaStaticRoles[me.checkboxAriaRole] ? ' tabIndex="0"' : '') +
				'></span>';
	}
});
