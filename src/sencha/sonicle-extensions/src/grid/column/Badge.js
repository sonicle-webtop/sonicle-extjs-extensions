/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Badge', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.sobadgecolumn',
	
	align: 'right',
	
	/**
	 * @cfg {Number|Boolean} moreTextThreshold
	 * Set to a number greater of zero to display a static 'more-text' instead 
	 * of the real value; this behaviour is applied when value is greater to 
	 * the specified threshold.
	 */
	moreTextThreshold: false,
	
	/**
	 * Specifies the more-text to use instead of building automatically using 
	 * the following pattern: concatenatenation of threshold with '+' 
	 * char (eg. 99+).
	 */
	moreText: undefined,
	
	tpl: [
		'<tpl if="count &gt; 0"><span class="{wrapCls}" <tpl if="tooltipAttrs">{tooltipAttrs}</tpl>>{text}</span></tpl>'
	],
	
	wrapCls: 'so-badge-column-wrap',
	
	defaultRenderer: function(val, meta, rec, ridx, cidx, sto) {
		return this.tpl.apply(this.prepareTplData(val, rec));
	},
	
	updater: function(cell, val, rec) {
		cell.firstChild.innerHTML = this.tpl.apply(this.prepareTplData(val, rec));
	},
	
	prepareTplData: function(val, rec) {
		var me = this,
			threshold = me.moreTextThreshold,
			moreText = me.moreText,
			count = 0, text, tooltipAttrs;
		
		if (Ext.isNumber(val)) {
			count = val;
			if (Ext.isNumber(threshold) && (threshold > 0) && (val > threshold)) {
				text = !Ext.isEmpty(moreText) ? moreText : (threshold + '+');
				tooltipAttrs = Sonicle.Utils.generateTooltipAttrs(count+'');
			} else {
				text = val;
			}
		}
		
		return {
			count: count,
			text: text,
			tooltipAttrs: tooltipAttrs,
			wrapCls: me.wrapCls
		};
	}
});