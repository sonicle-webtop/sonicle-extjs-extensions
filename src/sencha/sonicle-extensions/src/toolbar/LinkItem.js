/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.toolbar.LinkItem', {
	extend: 'Ext.toolbar.TextItem',
	alias: 'widget.so-tblink',
	
	/**
	 * @cfg {Boolean} useLinkSyntax
	 * Set to `false` to not parse link value using link syntax: "[text](url)".
	 */
	useLinkSyntax: true,
	
	/**
	 * @cfg {Boolean} disableNavigation
	 * Set to `true` to disable URL navigation on link click.
	 */
	disableNavigation: false,
	
	/**
	 * @param {String/Object} tooltip
	 * The tooltip for the button - can be a string to be used as innerHTML (html tags are accepted) or QuickTips config object.
	 */
	
	link: '',
	
	syntaxRe: /^\[(.*)\]\((.*)\)$/,
	
	/**
	 * @cfg {Function/String} handler
	 * A function called when the link is clicked.
	 * @cfg {String} link The current link value.
	 * @cfg {String} parsed.url The current link URL value.
	 * @cfg {String} parsed.text The current link text value.
	 */
	
	/**
	 * @cfg {Object} scope
	 * The scope (`this` reference) in which the `{@link #handler}`
	 * functions are executed.
	 * Defaults to this Column.
	 */
	
	constructor: function(cfg) {
		var me = this;
		me.origScope = cfg.scope || me.scope;
		me.scope = cfg.scope = null;
		me.callParent([cfg]);
	},
	
	beforeRender : function() {
		var me = this;
		me.callParent();
		me.html = me.buildHtml();
	},
	
	onRender: function() {
		var me = this;
		me.callParent(arguments);
		me.mon(me.el, 'click', me.handleClick, me, {delegate: 'a'});
	},
	
	setLink: function(link) {
		var me = this;
		me.link = link;
		me.update(me.buildHtml());
	},
	
	privates: {
		handleClick: function(e) {
			var me = this;
			e.stopEvent();
			if (!me.disabled) {
				Ext.callback(me.handler, me.origScope, [me.link, me.parseLink(me.link), e], undefined, me);
				me.fireEvent('click', me);
			}
		},
		
		buildHtml: function() {
			var me = this,
				link = me.link,
				value = Ext.isDefined(link) ? link + '' : link,
				parse = me.parseLink(value);
			return (me.preHtml || '') + me.self.genHtmlLink(me.disableNavigation ? null : parse.url, parse.text || parse.url, me.tooltip, {cls: me.cls}) + (me.postHtml || '');
		},
		
		parseLink: function(s) {
			var me = this,
					match, url, text;
			if (me.useLinkSyntax) {
				match = me.syntaxRe.exec(s);
				if (match && match.length === 3) {
					url = match[2];
					text = match[1];
				}
			} else {
				url = text = s;
			}
			return {url: url, text: text};
		}
	},
	
	statics: {
		genLinkSyntax: function(url, text) {
			return '[' + (text || url) + '](' + url + ')';
		},
		
		genHtmlLink: function(url, text, tooltip, opts) {
			opts = opts || {};
			var SoS = Sonicle.String,
					target = 'self' === opts.target || Ext.isEmpty(url) ? '_self' : '_blank',
					cls = opts.cls || '',
					href = Ext.isString(url) ? SoS.htmlAttributeEncode(url) : 'javascript:Ext.EmptyFn',
					displ = SoS.htmlEncode(text || '');
			return '<a href="' + href + '" target="' + target + '" class="' + cls + '" ' + Sonicle.Utils.generateTooltipAttrs(tooltip) + '>' + displ + '</a>';
		}
	}
});
