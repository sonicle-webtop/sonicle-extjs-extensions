/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.Labelable', {
	extend: 'Ext.Mixin',

	config: {
		
		/**
		 * @cfg {String} [labelTextAlign=left]
		 * The text alignment for this label (left, right, center).
		 */
		labelTextAlign: 'left'
	},
	
	updateLabelTextAlign: function(align, oldAlign) {
		var me = this,
			labelTextCls = me.labelTextCls,
			labelTextEl = me.labelTextEl;
		
		if (me.rendered && labelTextEl) {
			labelTextEl.removeCls(labelTextCls + '-' + oldAlign);
			labelTextEl.addCls(labelTextCls + '-' + align);
		}
	},
	
	privates: {
		overrideLabelableRenderData: function(data) {
			data.labelTextCls = data.labelTextCls + ' ' + this.labelTextCls + '-' + this.getLabelTextAlign();
			return data;
		}
	}
});