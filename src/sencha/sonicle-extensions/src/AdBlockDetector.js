/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.AdBlockDetector', {
	singleton: true,
	
	injectAd: function() {
		var div, img;
		div = document.createElement('div');
		div.className = 'ads';
		
		img = document.createElement('img');
		img.setAttribute("src", "images/ads.jpg");
		//img.setAttribute("width", "1");
		//img.setAttribute("height", "1");
		div.appendChild(img);
		
		document.body.appendChild(div);
		return div;
	},
	
	cleanupAd: function(div) {
		document.body.removeChild(div);
	},
	
	check: function(fn, scope) {
		var me = this,
				el = me.injectAd(), result;
		Ext.defer(function() {
			result = (el.firstChild.style['display'] === "none");
			me.cleanupAd(el);
			Ext.callback(fn, scope || me, [result]);
		}, 100);
	},
	
	injectAd2: function() {
		var el = document.createElement('div');
		el.innerHTML = '&nbsp;';
		el.className = 'adsbox';
		document.body.appendChild(el);
		return el;
	},
	
	check2: function(fn, scope) {
		var me = this,
				el = me.injectAd(), result;
		Ext.defer(function() {
			result = (el.offsetHeight === 0);
			el.remove();
			Ext.callback(fn, scope || me, [result]);
		}, 100);
	},
	
	createAds: function(id) {
		var el = document.createElement('div');
		el.id = id;
		el.style.display = 'none';
		document.body.appendChild(el);
	}
	
});
