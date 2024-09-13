/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.mixin.Avatar', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'so-avatar',
		before: {
			initComponent: 'avatarBeforeInitComponent'
		}
	},
	
	/**
	 * @cfg {circular|rounded|squared} [avatarStyle=circular]
	 */
	avatarStyle: 'circular',
	
	/**
	 * @deprecated use {@link #avatarStyle} instead
	 * @cfg {circle|square} [geometry]
	 * Changes avatar's geomerty.
	 */
	
	/**
	 * @cfg {Number} [lighten=80]
	 * The amount value used to lighten the initial text color (-255 to 255).
	 */
	//lighten: 80,
	
	/**
	 * @cfg {Number} [luminanceThreshold=0.64]
	 * The relative-luminance threshold (0-1) used to distinguish between a dark/light color.
	 * Colors with a computed relative-luminance below the threshold are considered dark, light otherwise.
	 */
	luminanceThreshold: 0.64,
	
	/**
	 * @cfg {Number/Number[]} [foreColorShade=0.4]
	 * The percentage increment (0-1) applied when calculating the (lighter/darker) foreground color shade.
	 */
	foreColorShade: 0.4,
	
	/**
	 * @cfg {String} [emptyColor=#F1F3F4]
	 * A 7-chars color hex code to be applied when initials cannot be computed.
	 */
	emptyColor: '#F1F3F4',
	
	/**
	 * @cfg {String} [pictureBgColor=#F1F3F4]
	 * A 7-chars color hex code to be applied as background color for picture.
	 */
	pictureBgColor: '#F1F3F4',
	
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
	
	/**
	 * @private
	 */
	seed: 0,
	
	avatarBeforeInitComponent: function() {
		var me = this;
		if ('circle' === me.geometry) me.avatarStyle = 'circular';
		if ('square' === me.geometry) me.avatarStyle = 'squared';
	},
	
	privates: {
		
		buildAvatarHtml: function(data, opts) {
			data = data || {};
			opts = opts || {};
			var me = this,
				SoS = Sonicle.String,
				dataRef = Ext.isString(opts.dataRef) ? ('data-ref="' + SoS.htmlAttributeEncode(opts.dataRef) + '"') : '',
				swatchCls = opts.swatchCls || '',
				pictureCls = opts.pictureCls || '',
				initialsCls = opts.initialsCls || '',
				size = Ext.isNumber(opts.size) ? opts.size : 32,
				swatchStyles = {
					borderRadius: me.swatchRadius()
				},
				render = (!Ext.isEmpty(data.pictureUrl) || !Ext.isEmpty(data.iconCls)) ? 1 : (!Ext.isEmpty(data.name) ? 2 : 0),
				html = '',
				spanStyles;
			
			if (opts.forceWrapSize !== false) {
				Ext.apply(swatchStyles, {
					width: size + 'px',
					height: size + 'px'
				});
			}
			
			if (render === 1) {
				if (!Ext.isEmpty(data.iconCls)) {
					swatchCls += (' '+Ext.String.trim(data.iconCls));
				} else {
					swatchCls += (' '+pictureCls);
					Ext.apply(swatchStyles, {
						backgroundColor: me.pictureBgColor,
						backgroundImage: !Ext.isEmpty(data.pictureUrl) ? 'url(' + data.pictureUrl + ')' : null
					});
				}
				
			} else if (render === 2) {
				var bgColor = me.randomColor(data.name.length, me.colors);
				swatchCls += (' '+initialsCls);
				swatchStyles.backgroundColor = bgColor;
				spanStyles = me.initialsStyles(bgColor, size);
				
			} else {
				swatchStyles.backgroundColor = me.emptyColor;
			}
			
			html += '<span ' + dataRef + ' class="' + swatchCls + '" style="' + Ext.dom.Helper.generateStyles(swatchStyles) + '">';
			if (render === 2) {
				html += '<span style="' + Ext.dom.Helper.generateStyles(spanStyles) + '">';
				html += Sonicle.mixin.Avatar.calcInitials(data.name, 2);
				html += '</span>';
			}
			html += '</span>';
			return html;
		},
		
		randomColor: function(seed, colors) {
			return colors[(seed+3) % (colors.length)];
		},
		
		swatchRadius: function() {
			var style = this.avatarStyle;
			if ('circular' === style) return '50%';
			else if ('rounded' === style) return '15%';
			return null;
		},
		
		initialsStyles: function(bgColor, avatarSize) {
			var SoC = Sonicle.ColorUtils,
				thres = this.luminanceThreshold,
				shade = this.foreColorShade,
				lum = SoC.luminance(bgColor);
			return {
				color: SoC.shade(bgColor, (lum > thres) ? (shade * -1) : shade),
				//color: Sonicle.mixin.Avatar.lightenDarken(bgColor, this.lighten),
				fontSize: Math.floor(avatarSize/2) + 'px'
			};
		}
	},
	
	statics: {
		/**
		 * Compute initials of a name
		 * These rule will be followed:
		 *  - divide the username on space and hyphen
		 *  - use the first letter of each parts ignoring any text inside brackets
		 *  - never use more than three letters as initials
		 *  - if the username is divided in more than three parts and has part 
		 *    starting with an uppercase, skip parts starting with a lowercase
		 * @param {String} name The name to analyze.
		 * @param {2|3} [max] Maximum chars to returs, defaults to 3.
		 * @returns {String} The name's initials.
		 */
		calcInitials: function(name, max) {
			if (max === undefined) max = 3;
			if (Ext.isEmpty(name)) return null;
			var parts = name.split(/[ -]/),
				sntz = function(s) {
					// Skip any text inside brackets
					s = s.replace(/\(.*\)|\[.*\]|{.*}/, '');
					// Returns the first letter or digit.
					var match = s.match(/[a-zA-Z0-9]/);
					return (match !== null) ? match[0] : '';
				},
				ini = '', i;
			
			for (i=0; i<parts.length; i++) {
				ini += sntz(parts[i]);
			}
			if (ini.length > max) {
				ini = ini[0] + ini[ini.length-1];
			}
			if (ini.length > 3 && ini.search(/[A-Z]/) !== -1) {
				ini = ini.replace(/[a-z]+/g, '');
			}
			return ini.substr(0, 3).toUpperCase();
		}
		
		/*
		lightenDarken: function(color, amount) {
			var co = Ext.util.Color.create(color);
			co.setRGB(co.r + amount, co.g + amount, co.b + amount);
			return co.toHex();
		}
		*/
	}
});
