/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by: https://github.com/enovision/ext-markdown-panel
 */
Ext.define('Sonicle.panel.Markdown', {
	extend: 'Ext.panel.Panel',
	alias: ['widget.somarkdownpanel', 'widget.somarkdownpanel'],
	requires: [
		'Sonicle.Crypto'
	],
	
	layout: 'fit',
	autoScroll: true,
	html: '', // otherwise no 'body' element
	bodyPadding: '0 5 5 5',
	
	config: {
		/**
		 * @cfg {Object} converterOptions
		 * Options passed to the ShowDown converter. This can only be specified 
		 * at time of creation and cannot be set later.
		 */
		converterOptions: {
			$value: {
				openLinksInNewWindow: true,
				simpleLineBreaks: true,
				strikethrough: true,
				tables: true,
				tasklists: true
			},
			lazy: true,
			merge: function(newValue, oldValue, target, mixinClass) {
				return this.mergeNew(newValue, oldValue, target, mixinClass);
			}
		}
	},
	
	/**
	 * @cfg {regular|max1024|max1200|max1650|unlimited} contentWidth
	 */
	contentWidth: 'regular',
	
	cls: 'markdown-body', // don't change this !!!
	
	/**
	 * @readonly
	 * @property {Remarkable} md
	 */
	md: null,
	
	/**
	 * @readonly
	 * @property {String} markdownHash
	 */
	
	initComponent: function() {
		var me = this;
		me.md = new showdown.Converter(Ext.apply({}, me.getConverterOptions() || {}));
		
		/*
		me.md = new Remarkable('full', me.options);
		me.md.core.ruler.enable([
			'abbr'
		]);
		
		me.md.renderer.rules.image = (function() {
			var orig = me.md.renderer.rules.image;
			return function(tokens, idx) {
				var src = tokens[idx]['src'],
						srcSplit = src.split(/[&|?]/),
						imgOutput, outputSplit, newTag, ix;
				
				if (srcSplit.length > 0) {
					tokens[idx]['src'] = srcSplit[0];
				}
				srcSplit.slice(1).map(function(val, ix) {
					srcSplit[ix + 1] = decodeURI(val).replace('+', ' '); // because it is sliced at 1 !!!
				});
				
				ix = srcSplit.indexOf('bordered');
				if (ix >= 0) {
					srcSplit[ix] = 'class="bordered"';
				}
				imgOutput = orig.apply(this, arguments);
				outputSplit = imgOutput.split(' ');
				newTag = outputSplit.slice(0, 2).concat(srcSplit.slice(1), outputSplit.slice(2));
				return newTag.join(' ');
			};
		})();
		*/
		me.callParent(arguments);
	},
	
	afterRender: function() {
		var me = this;
		me.callParent();
		if (me.markdown) me.setMarkdown(me.markdown);
	},
	
	setMarkdown: function(markdown) {
		var me = this,
				mdHash = me.markdownHash,
				hash;
		if (markdown) {
			hash = Sonicle.Crypto.md5Hex(markdown);
			if (!mdHash || hash !== mdHash) {
				me.renderPage(markdown);
				me.markdownHash = hash;
			}
		}
	},
	
	compileMD: function(mdString) {
		var me = this;
		// repair relative paths first
		// that is: any './xxx' will be replaced with /rootfolder/xxx
		// and any: '$/xxx will be replaced with /rootPath/xxx
		//mdString = me.replaceAll(mdString, '$/', me.getRootFolder() + '/');
		//mdString = me.replaceAll(mdString, './', me.getRootBook() + '/');
		//return me.md.render(mdString);
		return me.md.makeHtml(mdString);
	},
	
	scrollToAnchor: function(anchor) {
		var bodyEl = this.getEl(),
				el = Ext.getElementById(anchor);
		el.scrollIntoView(bodyEl, false, true);
	},
	
	renderPage: function(mdString) {
		var me = this,
				html = me.compileMD(mdString);
		
		me.update('<div class="so-markdownpanel-body-wrapper ' + me.contentWidth  +'">' + html + '</div>');
		// scroll to top
		me.scrollTo(0, 0);
		/** Highlight.js */
		//me.highlightAll();
	}
});
