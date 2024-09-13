/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by:
 *  - https://eliep.github.io/vue-avatar/
 *  - https://flatuicolors.com/
 *  - https://github.com/google/palette.js/tree/master
 */
Ext.define('Sonicle.grid.column.Avatar', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.soavatarcolumn',
	uses: [
		'Sonicle.form.field.InitialsAvatar',
		'Sonicle.ColorUtils'
	],
	
	/**
	 * @cfg {String} nameField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as name.
	 */
	nameField: null,
	
	/**
	 * @cfg {String} pictureUrlField
	 * The underlying {@link Ext.data.Field#name data field name} to bind picture URL.
	 */
	pictureUrlField: null,
	
	/**
	 * @cfg {Number} [avatarSize=32]
	 * The pixel size of avatar.
	 */
	avatarSize: 32,
	
	/**
	 * @cfg {circle|square} [geometry=circle]
	 * Changes avatar's geomerty.
	 */
	geometry: 'circle',
	
	/**
	 * @cfg {Number} [lighten=80]
	 * The amount value used to lighten the initial text color (-255 to 255).
	 */
	lighten: 80,
	
	/**
	 * @cfg {Function} getName
	 * A function which returns a computed name.
	 */
	
	/**
	 * @cfg {Function} getPictureUrl
	 * A function which returns a computed picture URL.
	 */
	
	/**
	 * @cfg {Function} getIconCls
	 * A function which returns a computed icon class to be applied.
	 */
	
	/**
	 * @cfg {String} [emptyColor=#F1F3F4]
	 * A 7-chars color hex code to be applied when initials cannot be computed.
	 */
	emptyColor: '#F1F3F4',
	
	picBgColor: '#F1F3F4',
	
	/**
	 * @property {String[]} colors
	 * An array of 7-chars color hex code strings (with leading # symbol).
	 * This array can contain any number of colors, and each hex code should be unique.
	 */
	colors: [
		'#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
		'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
		'#8BC34A', '#CDDC39', /*'#FFEB3B',*/ '#FFC107', '#FF9800',
		'#FF5722', '#795548', '#9E9E9E', '#607D8B'
	],
	
	tdCls: 'so-' + 'avatarcolumn',
	avatarWrapCls: 'so-' + 'avatar-wrap',
	avatarPictureCls: 'so-' + 'avatar-picture',
	avatarInitialsCls: 'so-' + 'avatar-initials',
	
	defaultRenderer: function(value, cellValues) {
		return this.buildHtml(value, cellValues ? cellValues.record : null);
	},
	
	updater: function(cell, value, rec) {
		//TODO: evaluate partial update method
		cell.firstChild.innerHTML = this.buildHtml(value, rec);
	},
	
	buildHtml: function(value, rec) {
		var me = this,
			SoU = Sonicle.Utils,
				//xxx = (Math.floor(Math.random() * 10)>=5) ? null : 'https:/'+'/www.w3schools.com/howto/img_avatar2.png',
				picUrl = SoU.rendererEvalValue(value, rec, me.pictureUrlField, me.getPictureUrl, null),
				iconCls = SoU.rendererEvalValue(value, rec, null, me.getIconCls, null),
				useImg = !Ext.isEmpty(picUrl) || !Ext.isEmpty(iconCls),
				useIni = false,
				divCls = me.avatarWrapCls,
				size = me.avatarSize,
				divStyles = {
					width: size + 'px',
					height: size + 'px',
					lineHeight: size + 'px',
					borderRadius: me.buildRadius()
				},
				html = '',
				name, ini, bgColor;
		
		if (!useImg) {
			name = SoU.rendererEvalValue(value, rec, me.nameField, me.getName, null);
			ini = Sonicle.form.field.InitialsAvatar.calcInitials(name, 2);
			useIni = !Ext.isEmpty(ini);
		}
		
		if (useImg) {
			if (!Ext.isEmpty(iconCls)) {
				divCls += (' '+Ext.String.trim(iconCls));
			} else {
				divCls += (' '+me.avatarPictureCls);
				divStyles.backgroundColor = me.picBgColor;
				divStyles.backgroundImage = 'url(' + picUrl + ')';
			}
		} else if (useIni) {
			divCls += (' '+me.avatarInitialsCls);
			bgColor = me.randomColor(name.length, me.colors);
			divStyles.backgroundColor = bgColor;
		} else {
			divStyles.backgroundColor = me.emptyColor;
		}
		html += '<div class="' + divCls + '" style="' + Ext.dom.Helper.generateStyles(divStyles) + '">';
		if (useIni) {
			html += '<span style="' + Ext.dom.Helper.generateStyles(me._getSpanStyles(bgColor)) + '">' + ini + '</span>';
		}
		html += '</div>';
		return html;
	},
	
	_getSpanStyles: function(bgColor) {
		return {
			color: Sonicle.form.field.InitialsAvatar.lightenDarken(bgColor, this.lighten),
			fontSize: Math.floor(this.avatarSize/2) + 'px'
		};
	},
	
	privates: {
		randomColor: function(seed, colors) {
			return colors[(seed+3) % (colors.length)];
		},
		
		buildRadius: function() {
			return (this.geometry === 'circle') ? '50%' : null;
		}
	}
});
