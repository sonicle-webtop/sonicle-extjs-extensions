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
		'Sonicle.Utils'
	],
	
	mixins: [
		'Sonicle.mixin.Avatar'
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
			SoU = Sonicle.Utils;
		return me.buildAvatarHtml({
					pictureUrl: SoU.rendererEvalValue(value, rec, me.pictureUrlField, me.getPictureUrl, null),
					iconCls: SoU.rendererEvalValue(value, rec, null, me.getIconCls, null),
					name: SoU.rendererEvalValue(value, rec, me.nameField, me.getName, null)
				}, {
					wrapElType: 'div',
					pictureCls: me.avatarPictureCls,
					initialsCls: me.avatarInitialsCls,
					wrapCls: me.avatarWrapCls,
					size: me.avatarSize,
					forceWrapSize: true
			});
	}
});
