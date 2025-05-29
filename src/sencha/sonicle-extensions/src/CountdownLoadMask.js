/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by: https://github.com/enovision/ext-markdown-panel
 */
Ext.define('Sonicle.CountdownLoadMask', {
	extend: 'Ext.LoadMask',
	alias: ['widget.socountdownloadmask'],
	
	countdown: 10,
	countdownInterval: 1000,
	countdownEndFn: null,
	countdownCancelFn: null,
	cancelText: 'Cancel',
	secondsRemainingText: 'seconds remaining',
	encodeText: false,
	
	//privates
	cancelLinkTextCls: 'so-'+'mask-cancelLinkText',	
	countdownTask: null,

	childEls: [
        'msgWrapEl',
        'msgEl',
        'msgTextEl',
		'cancelLinkEl'
    ],
	
	/* eslint-disable indent, max-len */
    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',
            '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
                Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
                '<span id="{id}-msgTextEl" data-ref="msgTextEl" class="',
                    Ext.baseCSSPrefix, 'mask-msg-text',
                    '{childElCls}" role="presentation">{msg}',
				'</span>&nbsp;&nbsp;&nbsp;',
				'<a id="{id}-cancelLinkEl" data-ref="cancelLinkEl" class="{[values.$comp.cancelLinkTextCls]}" href="javascript:Ext.emptyFn()">',
					'{cancelText}',
				'</a>',
            '</div>',
        '</div>'
	],
	
    /* eslint-enable indent, max-len */
	
    initRenderData: function() {
        var me = this,
			SoS = Sonicle.String,
			result = me.callParent(arguments);
 
        result.cancelText = me.cancelText || '';
		if (me.encodeText) result.cancelText = SoS.htmlEncode(result.cancelText);
 
        return result;
    },	
	
	onRender: function() {
		var me=this;
		
        me.callParent(arguments);
		
		me.cancelLinkEl.on('click', function() {
			
			if (me.countdownTask) Ext.TaskManager.stop(me.countdownTask);
			
			me.hide();
			
			if (me.countdownCancelFn) me.countdownCancelFn.apply(this);
		});
    },

	doDestroy: function() {
		var me=this;
		if (me.countdownTask) Ext.TaskManager.stop(me.countdownTask);
        me.callParent(arguments);
	},
			
	setMessage: function(msg) {
		this.msgTextEl.setHtml(msg);
	},
	
	start: function() {
		var me=this;
		
		me.show();
		me.countdownTask = Ext.TaskManager.start({
			run: function () {
				var SoS = Sonicle.String,
					text = me.msg + ' ' + (--me.countdown) + ' ' + me.secondsRemainingText;
				if (me.encodeText) text = SoS.htmlEncode(text);
				me.setMessage(text);

				if (me.countdown <= 0) {
					Ext.TaskManager.stop(me.countdownTask);
					me.hide();
					if (me.countdownEndFn) me.countdownEndFn.apply(this);
				}
			},
			interval: me.countdownInterval
		});				
	}
	
});
