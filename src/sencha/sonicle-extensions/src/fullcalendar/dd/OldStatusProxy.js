/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.dd.OldStatusProxy', {
    extend: 'Ext.dd.StatusProxy',
	
	animRepair: true,
	
	/**
	 * @cfg {String} dropAllowedCopy
	 * The CSS class to apply to the status element when drop is allowed (copy mode).
	 */
	dropAllowedCopy: Ext.baseCSSPrefix + 'tree-drop-ok-append',
	
	childEls: ['ghost', 'message'],
	renderTpl: [
		'<div class="' + Ext.baseCSSPrefix + 'dd-drop-icon" role="presentation"></div>' +
		'<div class="ext-dd-ghost-ct">' +
			'<div id="{id}-ghost" data-ref="ghost" class="' + Ext.baseCSSPrefix + 'dd-drag-ghost"></div>' +
			'<div id="{id}-message" data-ref="message" class="' + Ext.baseCSSPrefix + 'dd-msg"></div>' +
		'</div>'
	],
	
	update: function(html) {
		this.callParent(arguments);
		var el = this.ghost.dom.firstChild;
		if (el) {
			// If the ghost contains an event clone (from dragging an existing event)
			// set it to auto height to ensure visual consistency
			Ext.fly(el).setHeight('auto');
		}
	},
	
	/**
	 * Update the calendar-specific drag status message without altering the ghost element.
	 * @param {String} msg The new status message
	 */
	updateMsg: function(msg) {
		this.message.update(msg);
	},
	
	getDropAllowedCls: function(copy) {
		return copy ? this.dropAllowedCopy : this.dropAllowed;
	}
});
