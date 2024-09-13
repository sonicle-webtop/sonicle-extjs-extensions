/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.button.Avatar', {
	extend: 'Ext.button.Button',
	alias: ['widget.soavatarbutton'],
	
	mixins: [
		'Sonicle.mixin.ThemeBranded',
		'Sonicle.mixin.Avatar'
	],
	
	config: {
		
		/*
		 * @cfg {String} pictureUrl
		 */
		pictureUrl: undefined,
		
		/*
		 * @cfg {String} fullName
		 */
		fullName: undefined
	},
	
	componentCls: 'so-btn-avatar',
	avatarSwatchCls: 'so-btn-avatar-swatch',
	avatarPictureCls: 'so-btn-avatar-picture',
	avatarInitialsCls: 'so-btn-avatar-initials',
	
	setScale: function(scale) {
		var me = this,
			oldScale = me.scale;
		if (me.rendered) {
			me.el.removeCls(me.componentCls+'-'+oldScale);
			me.el.addCls(me.componentCls+'-'+scale);
		}
		me.scale = scale;
	},
	
	updatePictureUrl: function(nv, ov) {
		var me = this;
		if (me.rendered && (nv !== ov)) {
			me.btnIconEl.setHtml(me.generateInnerHtml());
		}
	},
	
	updateFullName: function(nv, ov) {
		var me = this;
		if (me.rendered && (nv !== ov)) {
			me.btnIconEl.setHtml(me.generateInnerHtml());
		}
	},
	
	onRender: function(parentNode, containerIdx) {
		var me = this;
		me.callParent(arguments);
		me.el.addCls(me.componentCls+'-'+me.scale);
	},
	
	renderIcon: function(values) {
		// Replaces icon's expanded template with avatar markup
		//return this.generateInnerHtml();
		// Nest avatar markup into icon's expanded template!
		var endSpan = '</span>';
		return this.callParent(arguments).replace(endSpan, this.generateInnerHtml() + endSpan);
	},
	
	getTemplateArgs: function() {
		var me = this,
			iconAlign = me.getIconAlign(),
			hasIconCls = me._hasIconCls;
		
		// Restore same CSS Classes of the original button: this will mimic icon presence
		return Ext.apply(me.callParent(arguments), {
			hasIconCls: hasIconCls,
			iconAlignCls: hasIconCls + '-' + iconAlign
		});
	},
	
	privates: {
		generateInnerHtml: function() {
			var me = this,
				baseIconCls = me._baseIconCls;
			return me.buildAvatarHtml({
					pictureUrl: me.pictureUrl,
					iconCls: me.iconCls,
					name: me.fullName
				}, {
					//dataRef: 'btnIconEl',
					pictureCls: me.avatarPictureCls,
					initialsCls: me.avatarInitialsCls,
					swatchCls: me.avatarSwatchCls,
					//swatchCls: baseIconCls + ' ' + (baseIconCls + '-' + me.ui) + ' ' + me.avatarSwatchCls,
					size: me.avatarSize(),
					forceWrapSize: false
			});
		},
		
		avatarSize: function() {
			var scale = this.scale;
			if (scale === 'large') return 32;
			if (scale === 'medium') return 24;
			return 16;
		}
	}
});
