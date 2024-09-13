/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.ButtonAutoMenu', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.so-buttonautomenu',
	
	/**
	 * @cfg {Number} showDelay
	 * Delay in milliseconds before the menu displays after the mouse enters the target element.
	 */
	showDelay: 500,
	
	init: function(button) {
		var me = this;
		me.button = button;
		
		button.on({
			scope: me,
			mouseover: me.onMouseOver,
			mouseout: me.onMouseOut
		});
	},
	
	destroy: function() {
		var me = this,
			button = me.button;
		
		me.resetShowTimeout();
		button.un({
			scope: me,
			mouseover: me.onMouseOver,
			mouseout: me.onMouseOut
		});
		delete me.button;
		me.callParent();
	},
	
	privates: {
		onMouseOver: function(s, e) {
			var me = this,
				button = me.button;
			
			me.tmShow = setTimeout(function() {
				if (button.fireEvent('beforeautoshowmenu', button, button.menu) !== false) {
					button.maybeShowMenu(e);
				}
			}, me.showDelay);
		},

		onMouseOut: function(s, e) {
			this.resetShowTimeout();
		},
		
		resetShowTimeout: function() {
			clearTimeout(this.tmShow);
			delete this.tmShow;
		}
	}	
});