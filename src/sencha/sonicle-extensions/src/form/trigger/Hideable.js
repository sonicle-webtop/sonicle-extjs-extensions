/*
 * Sonicle ExtJs UX
 * Copyright (C) 2014 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.trigger.Hideable', {
	extend: 'Ext.form.trigger.Trigger',
	alias: 'trigger.sohideable',
	
	mixins: {
		observable: 'Ext.util.Observable'
	},
	
	/**
	 * @cfg {Boolean/String} hideOn
	 * Hides the clear trigger depending on value:
	 * - 'empty' when the field is empty (has no value)
	 * - 'value' when the field has a value
	 * Disabled by default using 'false'.
	 */
	hideOn: false,
	
	/**
	 * @cfg {Boolean} hideWhenMouseOut
	 * Hides the clear trigger until the mouse hovers over the field. Default to false.
	 */
	hideWhenMouseOut: false,
	
	onDestroy: function() {
		this.clearListeners();
		this.callParent();
	},
	
	initEvents: function() {
		var me = this, cmp, bodyEl;
		me.updateTriggerVisibility();
		me.callParent();
		cmp = me.field;
		
		if (me.hideOn) {
			me.addManagedListener(cmp, 'change', this.updateTriggerVisibility, this);
		}
		
		if (me.hideWhenMouseOut) {
			bodyEl = cmp.bodyEl;
			
			me.addManagedListener(bodyEl, 'mouseover', function() {
				me.mouseover = true;
				me.updateTriggerVisibility();
			}, me);
			me.addManagedListener(bodyEl, 'mouseout', function() {
				me.mouseover = false;
				me.updateTriggerVisibility();
			}, me);
		}
	},
	
	updateTriggerVisibility: function() {
		var me = this;
		if (me.isTriggerNeeded()) {
			if (!me.isVisible()) {
				me.show();
			}
		} else {
			if (me.isVisible()) {
				me.hide();
			}
		}
	},
	
	isTriggerNeeded: function() {
		var me = this;
		if (!me.field || !me.rendered || me.isDestroyed) {
			return false;
		}
		if (me.hideOn && (me.hideOn === 'empty') && Ext.isEmpty(me.field.getValue())) {
			return false;
		} else if (me.hideOn && (me.hideOn === 'value') && !Ext.isEmpty(me.field.getValue())) {
			return false;
		}
		if (me.hideWhenMouseOut && !me.mouseover) {
			return false;
		}
		return true;
	},
	
	/**
	 * @override Ext.form.trigger.Trigger#hide
	 * This allows subsequent call to setVisible.
	 */
	hide: function() {
		var me = this,
			el = me.el;
		me.callParent();
		if (el) {
			// NB: using !important (thanks to specific override in Ext.dom.Element)
			el.setVisible('none !important', false);
		}
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.form.trigger.Trigger#renderTrigger}:
	 * - Customize initial style (see !important).
	 */
	renderTrigger: function(fieldData) {
		var me = this,
			width = me.width,
			triggerStyle = me.hidden ? 'display:none !important;' : ''; // <- modified
		
		if (width) {
			triggerStyle += 'width:' + width;
		}
		
		return Ext.XTemplate.getTpl(me, 'renderTpl').apply({
			$trigger: me,
			fieldData: fieldData,
			ui: fieldData.ui,
			childElCls: fieldData.childElCls,
			triggerId: me.domId = me.field.id + '-trigger-' + me.id,
			cls: me.cls,
			triggerStyle: triggerStyle,
			extraCls: me.extraCls,
			baseCls: me.baseCls,
			ariaRole: me.ariaRole
		});
	}
});
