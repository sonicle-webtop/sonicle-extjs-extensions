/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.EmojiPalette', {
	extend: 'Ext.Component',
	requires: 'Ext.XTemplate',
	alias: 'widget.soemojipalette',
	
	focusable: true,
	scrollable: true,
	
	componentCls : 'so-'+'emoji-palette',
	
	selectedCls: 'so-'+'emoji-palette-selected',
	
	itemCls: 'so-'+'emoji-palette-item',
	
	/**
	 * @cfg {String} clickEvent
	 * The DOM event that will cause a color to be selected. This can be any valid event name (dblclick, contextmenu).
	 */
	clickEvent: 'click',
	
	emojis: [],
	
	renderTpl: [
		'<tpl for="emojis">',
			'<a href="#" role="button" class="{parent.itemCls}" hidefocus="on">',
				'<span class="{parent.itemCls}-inner">{[this.toEmoji(values)]}</span>',
			'</a>',
		'</tpl>',
		{
			toEmoji: function(unif) {
				if (unif.indexOf('|') !== -1) {
					var tokens = unif.split('|'), s = '';
					for(var i=0; i<tokens.length; i++) {
						s += this.evalUnified(tokens[i]);
					}
					return s;
				} else {
					return this.evalUnified(unif);
				}
			},
			
			evalUnified: function(unif) {
				return eval('"' + '\\u{'+unif+'}' + '"');
			}
		}
	],
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		if (me.handler) me.on('select', me.handler, me.scope, true);
	},
	
	initRenderData: function() {
		var me = this;
		return Ext.apply(me.callParent(), {
			itemCls: me.itemCls,
			emojis: me.emojis
		});
	},
	
	onRender: function() {
		var me = this,
				clickEvent = me.clickEvent;
		me.callParent(arguments);
		me.mon(me.el, clickEvent, me.handleClick, me, {delegate: 'a'});
		// always stop following the anchors
		if (clickEvent !== 'click') {
			me.mon(me.el, 'click', Ext.emptyFn, me, {delegate: 'a', stopEvent: true});
		}
	},
	
	privates: {
		handleClick: function(evt) {
			var me = this, dom;
			evt.stopEvent();
			if (!me.disabled) {
				dom = evt.getTarget('span', 2, false);
				if (dom) me.fireEvent('select', me, dom.innerHTML);
			}
		}
	}
});
