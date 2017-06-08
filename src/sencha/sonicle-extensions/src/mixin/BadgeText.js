/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.mixin.BadgeText', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'badgetext',
		after: {
			onRender: 'afterOnRender'
		}
	},
	
	config: {
		/**
		 * @cfg {String} badgeText
		 * Optional badge text. Badges appear as small numbers, letters, or icons that sit on top of your button.
		 * For instance, a small red number indicating how many updates are available.
		 */
		badgeText: null,
		
		/**
		 * @cfg {tl|tr|cl|cr|bl|br} badgeAlign
		 */
		badgeAlign: 'tr',
		
		/**
		 * @cfg {Number} badgeAlignOffset
		 */
		badgeAlignOffset: 0,
		
		/**
		 * @cfg {square|circle} badgeStyle
		 */
		badgeStyle: 'square'
	},
	
	hasBadgeCls: 'so-has-badge',
	
	afterOnRender: function() {
		var me = this;
		if (!me.badgeEl) me.createBadgeEl();
		if (me.badgeText) me.updateBadgeText(me.badgeText);
	},
	
	createBadgeEl: function() {
		var me = this,
				scaleCls = 'so-badge-' + me.scale,
				styles = {};
		
		me.setStyle({overflow: 'visible'});
		me.badgeEl = Ext.DomHelper.append(me.el, {
			tag: 'div',
			cls: 'so-badge-el ' + scaleCls + ' x-unselectable'
		}, true);
		if (me.getBadgeStyle() === 'circle') {
			styles = Ext.apply(styles, {
				width: me.badgeEl.getHeight(),
				borderRadius: '50%'
			});
		}
		styles = Ext.apply(styles, me.calculateAnchors(me.getBadgeAlign(), me.getBadgeAlignOffset(), me.getHeight(), me.badgeEl.getHeight()));
		me.badgeEl.setStyle(styles);
	},
	
	updateBadgeText: function(badgeText) {
		var me = this,
				el = me.el,
				badgeEl = me.badgeEl,
				hasBadgeCls = me.hasBadgeCls;
		
		if (el && badgeEl) {
			if (!Ext.isEmpty(badgeText)) {
				badgeEl.setText(badgeText);
				el.addCls(hasBadgeCls);
			} else {
				el.removeCls(hasBadgeCls);
			}
		}
	},
	
	calculateAnchors: function(align, offset, buttonHeight, badgeHeight) {
		switch (align) {
			case 'tl':
				return {'top': (0+offset)+'px', 'left': (0+offset)+'px'};
			case 'tr':
				return {'top': (0+offset)+'px', 'right': (0+offset)+'px'};
			case 'cl':
				return {'top': (Math.round((buttonHeight-badgeHeight)/2)-1)+'px', 'left': (0+offset)+'px'};
			case 'cr':
				return {'top': (Math.round((buttonHeight-badgeHeight)/2)-1)+'px', 'right': (0+offset)+'px'};
			case 'bl':
				return {'bottom': (0+offset)+'px', 'left': (0+offset)+'px'};
			case 'br':
				return {'bottom': (0+offset)+'px', 'right': (0+offset)+'px'};
		}
	}
});
