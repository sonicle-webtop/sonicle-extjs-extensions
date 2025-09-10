/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.DisplayAvatar', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.soavatardisplayfield'],
	
	mixins: [
		'Sonicle.mixin.Avatar'
	],
	
	fieldCls: 'so-' + 'form-avatardisplay-field',
	fieldBodyCls: 'so-' + 'form-avatardisplay-field-body',
	
	/**
	 * @cfg {Number} [avatarSize=100]
	 * The pixel size of avatar.
	 */
	avatarSize: 100,
	
	setValue: function(value) {
		var me = this,
			ret = me.callParent(arguments);
		
		if (me.rendered) {
			me.inputEl.applyStyles({
				backgroundColor: me.randomColor(value, me.colorPalette()) || me.emptyColor
			});
		}
		return ret;
	},
	
	onRender: function() {
		var me = this,
			size = me.avatarSize;
		me.callParent();
		if (me.inputEl) {
			me.inputEl.applyStyles({
				width: size + 'px',
				height: size + 'px',
				lineHeight: size + 'px',
				borderRadius: me.wrapRadius()
			});
		}
	},
	
	/**
	 * Overrides default getDisplayValue to customize rendering
	 */
	getDisplayValue: function() {
		var me = this,
			SoS = Sonicle.String,
			display = me.callParent(),
			spanStyles;
		
		if (me.renderer) {
			return display;
		} else {
			var bgColor = me.randomColor(display, me.colorPalette()),
				spanStyles = me.initialsStyles(bgColor, me.avatarSize);
			
			return '<span style="' + Ext.dom.Helper.generateStyles(spanStyles) + '">'
				+ SoS.htmlEncode(SoS.deflt(Sonicle.mixin.Avatar.calcInitials(display, 2), '')) 
				+ '</span>';
		}
	}
});