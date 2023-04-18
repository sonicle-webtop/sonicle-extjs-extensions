/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.AnnouncementBar', {
	extend: 'Ext.Component',
	alias: 'widget.soannouncementbar',
	requires: [
		'Sonicle.String',
		'Sonicle.Utils'
	],
	
	config: {
		type: undefined,
		message: undefined,
		link: undefined,
		buttons: undefined,
		callback: undefined,
		scope: undefined,
		encodeMessage: true,
		encodeLink: true,
		encodeTexts: true
	},
	
	clickEvent: 'click',
	
	hidden: true,
	
	/**
	 * @property {String} buttonText
	 * An object containing the default button text strings that can be overriden for localization support.
	 * Supported properties are: yes and no. Defaults to {@link Ext.MessageBox#buttonText} values.
	 */
	
	baseCls: 'so-' + 'announcementbar',
	
	renderTpl: [
		'<div id="{id}-barEl" data-ref="barEl" class="{baseCls}-wrap {baseCls}-wrap-{type}" role="presentation">',
			'<div class="{baseCls}-msgwrap">',
				'<div id="{id}-msgEl" data-ref="msgEl" class="{baseCls}-msg">{message}</div>',
				'<div id="{id}-yesEl" data-ref="yesEl" class="{baseCls}-yes" style="display: none">{yesText}</div>',
				'<div id="{id}-noEl" data-ref="noEl" class="{baseCls}-no" style="display: none">{noText}</div>',
			'</div>',
			'<div id="{id}-linkEl" data-ref="linkEl" class="{baseCls}-link">{link}</div>',
		'</div>'
	],
	childEls: ['barEl', 'msgEl', 'yesEl', 'noEl', 'linkEl'],
	
	constructor: function(cfg) {
		var me = this,
			icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, [
				{buttonText: true}
			]);
		if (!icfg.buttonText) {
			cfg.buttonText = {
				yes: Ext.MessageBox.buttonText.yes,
				no: Ext.MessageBox.buttonText.no
			};
		}
		me.callParent([cfg]);
	},
	
	initRenderData: function() {
		var me = this,
			SoS = Sonicle.String;
		
		return Ext.apply(me.callParent(), {
			type: me.type || 'info',
			message: me.encodeMessage ? SoS.htmlEncode(me.message) : me.message,
			link: me.encodeLink ? SoS.htmlEncode(me.link) : me.link,
			yesText: me.encodeTexts ? SoS.htmlEncode(me.buttonText.yes) : me.buttonText.yes,
			noText: me.encodeTexts ? SoS.htmlEncode(me.buttonText.no) : me.buttonText.no
		});
	},
	
	onRender: function() {
		var me = this,
			ME = me.self,
			buttons = Ext.isNumber(me.buttons) ? me.buttons : 0,
			clickEvent = me.clickEvent;
		
		me.callParent(arguments);
		
		if ((buttons & ME.YES) === ME.YES) {
			me.yesEl.setDisplayed('block');
		}
		if ((buttons & ME.NO) === ME.NO) {
			me.noEl.setDisplayed('block');
		}
		me.mon(me.el, clickEvent, me.onElClick, me);
	},
	
	applyType: function(type) {
		return Sonicle.String.isIn(type, ['alert', 'warning', 'info', 'success']) ? type : 'info';
	},
	
	updateType: function(v, ov) {
		var me = this,
			baseCls = me.baseCls;
		if (me.rendered) {
			me.barEl.removeCls(baseCls + '-wrap-' + ov);
			me.barEl.addCls(baseCls + '-wrap-' + v);
		}
	},
	
	updateMessage: function(v) {
		this.msgEl && this.msgEl.update(v);
	},
	
	applyButtons: function(buttons) {
		if (buttons === false || (!Ext.isNumber(buttons) || buttons < 0)) return 0;
		if (buttons === true) return this.self.YESNO;
		return buttons;
	},
	
	updateButtons: function(v) {
		var me = this,
			ME = me.self;
		if (me.rendered) {
			me.yesEl.setDisplayed((v & ME.YES) === ME.YES ? 'block' : false);
			me.noEl.setDisplayed((v & ME.NO) === ME.NO ? 'block' : false);
		}
	},
	
	close: function() {
		delete this.currentCfg;
		this.destroy();
	},
	
	/**
	 * @param {Object} cfg The following config options are supported:
	 * @param {Number} [cfg.buttons=false] A bitwise button specifier consisting of the sum of any of the following constants: YES, NO, YESNO
	 * @param {String} [cfg.message] 
	 * @param {Function} [cfg.callback] A callback function which is called when the dialog is dismissed either by clicking on the configured buttons, or on the dialog close button.
	 * Parameters passed: 
	 * @param {String} cfg.fn.buttonId The ID of the button pressed, one of: yes, no, link (link/close button)
	 * @param {Object} [cfg.buttonText] An object containing string properties which override the system-supplied button text values just for this invocation.
	 * @param {Object} [cfg.scope] The scope (`this` reference) in which the function will be executed.
	 * @param {Boolean} [cfg.encodeMessage] If `true` apply HTML encoding on message value, `false` otherwise.
	 * @param {Boolean} [cfg.encodeLink] If `true` apply HTML encoding on link value, `false` otherwise.
	 * @param {Boolean} [cfg.encodeTexts] If `true` apply HTML encoding on texts, `false` otherwise.
	 */
	setAnnouncement: function(cfg) {
		cfg = cfg || {};
		var me = this;
		
		// If called during global layout suspension, make the call after layout resumption
		if (Ext.Component.layoutSuspendCount) {
			Ext.on({
				resumelayouts: function() {
					me.showAnnouncement(cfg);
				},
				single: true	
			});
		}
		
		me.reconfigure(cfg);
		me.currentCfg = cfg;
		me.show();
		
		return me;
	},
	
	currentAnnouncement: function() {
		return this.currentCfg;
	},
	
	privates: {
		reconfigure: function(cfg) {
			var me = this,
				SoO = Sonicle.Object,
				oldButtonText = me.buttonText,
				oldEncodeMessage = me.encodeMessage,
				oldEncodeLink = me.encodeLink,
				oldEncodeTexts = me.encodeTexts;
			
			me.buttonText = Ext.apply({}, cfg.buttonText, me.buttonText);
			me.setEncodeMessage(SoO.booleanValue(cfg.encodeMessage, true));
			me.setEncodeLink(SoO.booleanValue(cfg.encodeLink, true));
			me.setEncodeTexts(SoO.booleanValue(cfg.encodeTexts, true));
			me.setCallback(cfg.fn || cfg.callback);
			me.setScope(cfg.scope);
			
			Ext.suspendLayouts();
			me.updateButtonTexts();
			me.setType(cfg.type);
			me.setMessage(cfg.message);
			me.setButtons(cfg.buttons);
			Ext.resumeLayouts(true);
			
			// Restore: next run of reconfigure will restore to prototype's values!
			me.buttonText = oldButtonText;
			me.encodeMessage = oldEncodeMessage;
			me.encodeLink = oldEncodeLink;
			me.encodeTexts = oldEncodeTexts;
		},
		
		updateButtonTexts: function() {
			var me = this,
				SoS = Sonicle.String;
			if (me.rendered) {
				me.yesEl.update(me.encodeTexts ? SoS.htmlEncode(me.buttonText.yes) : me.buttonText.yes);
				me.noEl.update(me.encodeTexts ? SoS.htmlEncode(me.buttonText.no) : me.buttonText.no);
			}
		},
		
		onElClick: function(e) {
			var me = this,
				targetPrefix = '.' + me.baseCls + '-';
			
			e.stopEvent();
			if (e.getTarget(targetPrefix + 'yes', 2)) {
				me.handleClick('yes');
			} else if (e.getTarget(targetPrefix + 'no', 2)) {
				me.handleClick('no');
			} else if (e.getTarget(targetPrefix + 'link', 2)) {
				me.handleClick('link');
			}
		},
		
		handleClick: function(bid) {
			var me = this;
			Ext.callback(me.getCallback(), me.getScope() || me, [bid]);
			me.hide();
		}
	},
	
	inheritableStatics: {
		ALERT: 'alert',
		WARNING: 'warning',
		INFO: 'info',
		SUCCESS: 'success',
		
		YES: 1,
		NO: 2,
		YESNO: 3
	}
});