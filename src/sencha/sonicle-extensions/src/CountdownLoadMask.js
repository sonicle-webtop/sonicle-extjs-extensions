/**
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.CountdownLoadMask', {
	extend: 'Sonicle.LoadMask',
	alias: ['widget.socountdownloadmask'],
	
	/**
	 * @cfg {Number} [countdownStart=10]
	 * The countdown start value, default to 10.
	 */
	countdownStart: 10,
	
	/**
	 * @cfg {Number} [countdownInterval=1000]
	 * The interval between each countdown tick (in milliseconds). Defaults to 1 second.
	 */
	countdownInterval: 1000,
	
	/**
	 * @cfg {Function/String} countdownCancelCallback
	 * A function to execute when countdown is cancelled.
	 * The callback is passed the following params:
	 * @param {Ext.LoadMask} mask The owning LoadMask instance.
	 */
	
	/**
	 * @cfg {Function/String} countdownEndCallback
	 * A function to execute when countdown is elapsed.
	 * The callback is passed the following params:
	 * @param {Ext.LoadMask} mask The owning LoadMask instance.
	 */

	/**
	 * @cfg {String} [countdownRemainingText]
	 * The text to display in countdown mode.
	 */
	countdownRemainingText: '{0} seconds remaining',
	
	useButton: true,
	
	doDestroy: function() {
		var me = this;
		if (me._countdownTask) {
			me._countdownTask = Ext.TaskManager.stop(me._countdownTask, true);
		}
		me.callParent(arguments);
	},
	
	show: function() {
		var me = this,
			SoS = Sonicle.String;
		
		if (!me._countdownTask) {
			me._countdown = me.countdownStart;
			me._countdownTask = Ext.TaskManager.start({
				run: function() {
					var msg = SoS.join(' ', me.msg, Ext.String.format(me.countdownRemainingText, --me._countdown));
					me.setMessage(me.encodeText ? SoS.htmlEncode(msg) : msg);
					if (me._countdown <= 0) {
						Ext.callback(me.countdownEndCallback, me, [me]);
						me.hide();
					}
				},
				interval: me.countdownInterval
			});
		}
		me.callParent(arguments);
	},
	
	hide: function() {
		var me = this;
		if (me._countdownTask) {
			me._countdownTask = Ext.TaskManager.stop(me._countdownTask, true);
		}
		me.callParent(arguments);
	},
	
	privates: {
		onButtonElClick: function(e) {
			var me = this;
			me.callParent(arguments);
			Ext.callback(me.countdownCancelCallback, me, [me]);
			me.hide();
		}
	}
});