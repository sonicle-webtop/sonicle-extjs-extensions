/**
 * Override original {@link Ext.form.field.TextArea}
 * - Add support to smartResize
 * - Add scrollToBottom method
 */
Ext.define('Sonicle.overrides.form.field.TextArea', {
	override: 'Ext.form.field.TextArea',
	
	/**
	 * @cfg {Boolean} [smartResize=false]
	 * Specifies weather to apply a resize in a `smart` way: vertical direction 
	 * only, handle only in sw corner and initial height is preserved.
	 */
	smartResize: false,
	
	smartResizeCls: Ext.baseCSSPrefix + 'form-textarea-resizable-smart',
	
	getSubTplData: function(fieldData) {
		var me = this,
			ret = ret = me.callParent(arguments);
		if (me.resizable && me.smartResize === true) {
			ret.fixCls = (ret.fixCls || '') + ' ' + me.smartResizeCls;
		}
		return ret;
	},
	
	scrollToBottom: function() {
		var el = this.inputEl;
		if (el) el.setScrollTop(el.dom.scrollHeight);
	},
	
	privates: {
		initResizable: function(resizable) {
			var me = this;
			// If resizable is simply enabled with boolean flag, customize 
			// default config using some common options:
			//  - transparent handles
			//  - only vertical direction allowed
			if (me.smartResize === true) {
				if (resizable === true) resizable = {};
				Ext.apply(resizable || {}, {
					transparent: true,
					//FIXME: dynamic is unuseful when resizing horizontally the textarea
					dynamic: true, // Make sure handle wrapper will track textarea movements
					handles: 's se',
					minHeight: me.getHeight()
				});
			}
			me.callParent(arguments);
		}
	}
});