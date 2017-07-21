/*
 * WebTop Services is a Web Application framework developed by Sonicle S.r.l.
 * Copyright (C) 2014 Sonicle S.r.l.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by
 * the Free Software Foundation with the addition of the following permission
 * added to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED
 * WORK IN WHICH THE COPYRIGHT IS OWNED BY SONICLE, SONICLE DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, see http://www.gnu.org/licenses or write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA.
 *
 * You can contact Sonicle S.r.l. at email address sonicle@sonicle.com
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * Sonicle logo and Sonicle copyright notice. If the display of the logo is not
 * reasonably feasible for technical reasons, the Appropriate Legal Notices must
 * display the words "Copyright (C) 2014 Sonicle S.r.l.".
 */
Ext.define('Sonicle.picker.Emoji', {
	extend: 'Ext.tab.Panel',
	alias: ['widget.soemojipicker'],
	requires: [
		'Sonicle.Emojis',
		'Sonicle.EmojiPalette'
	],
	
	recentsText: 'Frequently used',
	peopleText: 'Smileys & People',
	natureText: 'Animals & Nature',
	foodsText: 'Food & Drink',
	activityText: 'Activity',
	placesText: 'Travel & Places',
	objectsText: 'Objects',
	symbolsText: 'Symbols',
	flagsText: 'Flags',
	
	border: false,
	
	initComponent: function() {
		var me = this, cmps;
		me.callParent(arguments);
		cmps = me.add({
			xtype: 'soemojipalette',
			tooltip: me.peopleText,
			glyph: 'xf118@FontAwesome',
			emojis: Sonicle.Emojis.lib.people
		}, {
			xtype: 'soemojipalette',
			tooltip: me.natureText,
			glyph: 'xf06c@FontAwesome',
			emojis: Sonicle.Emojis.lib.nature
		}, {
			xtype: 'soemojipalette',
			tooltip: me.foodsText,
			glyph: 'xf0f5@FontAwesome',
			emojis: Sonicle.Emojis.lib.foods
		}, {
			xtype: 'soemojipalette',
			tooltip: me.activityText,
			glyph: 'xf1e3@FontAwesome',
			emojis: Sonicle.Emojis.lib.activity
		}, {
			xtype: 'soemojipalette',
			tooltip: me.placesText,
			glyph: 'xf1b9@FontAwesome',
			emojis: Sonicle.Emojis.lib.places
		}, {
			xtype: 'soemojipalette',
			tooltip: me.peopleText,
			glyph: 'xf0eb@FontAwesome',
			emojis: Sonicle.Emojis.lib.objects
		}, {
			xtype: 'soemojipalette',
			tooltip: me.symbolsText,
			glyph: 'xf292@FontAwesome',
			emojis: Sonicle.Emojis.lib.symbols
		});
		
		Ext.iterate(cmps, function(cmp) {
			me.relayEvents(cmp, ['select']);
		});
	}
});
