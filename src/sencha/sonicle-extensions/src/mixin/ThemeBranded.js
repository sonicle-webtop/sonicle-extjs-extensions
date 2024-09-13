/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.mixin.ThemeBranded', {
	extend: 'Ext.Mixin',
	requires: [
		'Sonicle.String',
		'Sonicle.ThemeMgr'
	],
	
	mixinConfig: {
		id: 'so-themebranded',
		after: {
			onRender: 'themeBrandedAfterOnRender'
		}
	},
	
	privates: {
		themeBrandedAfterOnRender: function() {
			var me = this,
				SoS = Sonicle.String,
				SoTM = Sonicle.ThemeMgr,
				el = me.el,
				compCls = Ext.Array.from(Ext.String.splitWords(me.componentCls))[0],
				name = SoS.lower(SoTM.getName()),
				parentName = SoS.lower(SoTM.getParentName()),
				rootName = SoS.lower(SoTM.getRootName());
			
			if (el && !Ext.isEmpty(compCls)) {
				if (!Ext.isEmpty(rootName)) el.addCls(compCls+'-theme0-'+rootName);
				if (!Ext.isEmpty(parentName)) el.addCls(compCls+'-theme-1-'+parentName);
				if (!Ext.isEmpty(name)) el.addCls(compCls+'-theme-'+name);
			}
		}
	}
});
