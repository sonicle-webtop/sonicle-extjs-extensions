/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.dd.StatusProxy', {
    extend: 'Ext.dd.StatusProxy',
	
	/**
	 * @cfg {String} dropAllowedCopy
	 * The CSS class to apply to the status element when drop (for copy operation) is allowed.
	 */
	dropAllowedCopy: Ext.baseCSSPrefix + 'tree-drop-ok-append',
	
	/**
	 * @cfg {Sonicle.fullcalendar.FullCalendar} calendar
	 */
	calendar: undefined,
	
	dragTextAdd: 'New: {0}',
	dragTextMove: 'Move: {0}',
	dragTextCopy: 'Copy: {0}',
	dragTextResize: '{0}',
	
	/**
	 * Returns the CSS Class (allowed status) accorting to the current drag operation.
	 * See {@link DragZone#dragOperation} for more info.
	 * @param {resize|copy|move} op The drag operation
	 * @return {String} The CSS Class.
	 */
	getDropAllowedCls: function(op) {
		return (op === 'copy' || op === true) ? this.dropAllowedCopy : this.dropAllowed;
	},
	
	/**
	 * Sets specified message into this proxy.
	 * @param {String} text
	 */
	setMessage: function(text) {
		this.update('<span>' + (!Ext.isEmpty(text) ? Sonicle.String.htmlEncode(text) : '') + '</span>');
	},
	
	/**
	 * Updates proxy's message generating right text according to passed parameters.
	 * @param {resize|copy|move} op Specifies the type of dragging operation in progress.
	 * @param {Date} start The start boundary.
	 * @param {Date} [end] The end boundary. Can be null.
	 * @param {Boolean} [allDay] If boundaries are all-day: no time references will be displayed in generated message.
	 */
	updateMessage: function(op, start, end, allDay) {
		this.setMessage(this.buildDragText(op, start, end, allDay));
	},
	
	privates: {
		buildDragText: function(op, start, end, allDay) {
			allDay = !!allDay;
			var me = this,
				SoD = Sonicle.Date,
				cal = me.calendar,
				fmts = {
					resize: me.dragTextResize,
					move: me.dragTextMove,
					copy: me.dragTextCopy,
					add: me.dragTextAdd
				},
				adjEnd = (Ext.isDate(end) && allDay) ? SoD.add(end, {days: -1}, true) : end,
				s = '';
			
			if (!Ext.isDate(start)) return s;
			if (!Ext.isDate(adjEnd)) {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'});
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(start, {hour: 'numeric', minute: '2-digit'});
				}
				
			} else if (SoD.diffDays(start, adjEnd) === 0) {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'});
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(start, {hour: 'numeric', minute: '2-digit'});
					s += ' - ';
					s += cal.formatDate(adjEnd, {hour: 'numeric', minute: '2-digit'});
				}
			} else {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'});
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(start, {hour: 'numeric', minute: '2-digit'});
				}
				s += ' - ';
				s += cal.formatDate(adjEnd, {month: 'short', day: '2-digit'});
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(adjEnd, {hour: 'numeric', minute: '2-digit'});
				}
			}
			return Ext.String.format(fmts[Ext.isBoolean(op) ? (op ? 'copy' : 'move') : op], s);
		}
	}
	
	
	
	/*
    --black: #000000;
    --blackTranslucent50: rgba(0,0,0,.5);
    --blackTranslucent40: rgba(0,0,0,.4);
    --blackTranslucent20: rgba(0,0,0,.2);
    --blackTranslucent10: rgba(0,0,0,.1);
    --white: #FFFFFF;
    --whiteTranslucent40: rgba(255,255,255,.4);
    --whiteTranslucent90: rgba(255,255,255,.9);
    --neutralDark: #242424;
    --neutralPrimary: #424242;
    --neutralPrimaryAlt: #616161;
    --neutralPrimarySurface: #FFFFFF;
    --neutralSecondary: #808080;
    --neutralSecondarySurface: #FAFAFA;
    --neutralTertiary: #D1D1D1;
    --neutralTertiaryAlt: #E0E0E0;
    --neutralTertiarySurface: #F0F0F0;
    --neutralQuaternary: #E5E5E5;
    --neutralQuaternaryAlt: #EBEBEB;
    --neutralLight: #F0F0F0;
    --neutralLighter: #F5F5F5;
    --neutralLighterAlt: #FAFAFA;
    --redDark: #A4262C;
    --green20: #498205;
    --purple: #881798;
    --suiteuxNeutralLight: #E1DFDD;
    --suiteuxNeutralSecondary: #484644;
    --flaggedMessage: #fffdd9;
    --richUserContentBackground: #fff;
    --composeNeutralBackground: #fff;
    --composeNeutralLighterBackground: #F5F5F5;
    --readingPaneCardBorder: #EBEBEB;
    --readingPaneCardFocusBorder: #D1D1D1;
    --oobeWhite: #ffffff;
    --oobePrimary: #0078d4;
    --oobeDarkAlt: #106EBE;
    --oobeThemeLighter: #DEECF9;
    --cardStyleWhite: #ffffff;
    --freeBusyAwayColor: #B4009E;
    --messageWebWarning: #fff4ce;
    --messageMobileWarningPrimary: #ffd335;
    --messageMobileWarningShade20: #c2a129;
    --messageMobileWarningShade30: #8f761e;
    --messageMobileWarningTint30: #fff2c3;
    --messageMobileWarningTint40: #fff8df;
    --communicationBlueWebPrimary: #0078d4;
    --messageMobileDangerPrimary: #d92c2c;
    --messageMobileDangerShade20: #a52121;
    --messageMobileDangerTint30: #f4b9b9;
    --messageMobileDangerTint40: #f9d9d9;
    --messageMobileSuccessPrimary: #13a10e;
    --presenceDoNotDisturb: #c50f1f;
    --addisonComponentButtonGradientStart: #f7f0ff;
    --addisonComponentButtonGradientEnd: #e9dfff;
    --storageCritialStateColor: #9F282B;
    --storageCritialStateHoverColor: #751D1F;
    --storageNearingStateColor: #835B00;
    --storageNearingStateHoverColor: #463100;
    --storageUsageBarBorder: #ffffff;
    --bizBarRed: #FDE7E9;
    --msqOneDrive: #3483FA;
    --msqTeams: #9A44FC;
    --msqOutlook: #C48600;
    --msqWindows: #D64400;
    --msqEdge: #1BA756;
    --placesLightBlueSolidColor: #28DFF8;
    --placesNavyBlueSolidColor: #209DF5;
    --placesBackgroundColorPink: rgba(255,116,243,.2);
    --placesBackgroundColorPurple: rgba(205,112,255,.2);
    --placesBackgroundColorLightBlue: rgba(39,213,248,.2);
    --placesBackgroundColorNavy: rgba(9,99,121,.2);
    --placesBluePrimary: #0078d4;
    --placesBlueTint40: #a9d3f2;
    --placesLightBackground3: #f5f5f5;
    --placesNeutralGrey92: #ebebeb;
    --colorBrandBackgroundInvertedSelected: #cfe4fa;
    --colorBrandBackgroundInvertedHover: #ebf3fc;
    --colorPaletteCornflowerBackground2: #2C3C85;
    --placesBlueGradient1: #2A4FFE;
    --placesBlueGradient2: #4D30FC;
    --placesBlueBackground1: #E1E6FC;
    --placesBlueForeground1: #637CEF;
    --placesBlueBorder1: #2510BC;
    --placesCornflowerForeground1: #F7F9FE;
    --placesRemote1: #CDEDF4;
    --placesRemoteBorder1: #0099BC;
    --neutralBackground6: #E6E6E6;
    --lilacBackground2: #E6BFED;
    --neutralForeground4: #707070;
    --neutralBackground2Pressed: #DBDBDB;
    --sharedCornflowerTint20: #778DF1;
    --sharedCornflowerTint30: #93A4F4;
    --sharedCornflowerTint50: #E1E6FC;
    --sharedCornflowerTint60: #F7F9FE;
    --sharedCornFlowerShade20: #3C51B4;
    --placesPurpleOOFBackground1: #F5DAF2;
    --placesPurpleOOFForeground1: #AF33A1;
    --placesPurpleGradient1: #6A11CB;
    --boxShadowPrimary: rgba(0, 0, 0, 0.14);
    --boxShadowSecondary: rgba(0, 0, 0, 0.12);
    --copilotGradientStart: #BA6DF1;
    --copilotGradientEnd: #4B9DF5;
    --themeDarker: #0C3B5E;
    --themeDark: #0F548C;
    --themeDarkAlt: #115EA3;
    --themePrimary: #0F6CBD;
    --themeSecondary: #2B88D8;
    --themeSecondarySurfaceSelected: #CFE4FA;
    --themeTertiary: #62ABF5;
    --themeLight: #B4D6FA;
    --themeLighter: #CFE4FA;
    --themeLighterAlt: #EBF3FC;
    --headerBackground: #0F6CBD;
    --headerBackgroundSearch: #0F6CBD;
    --headerBrandText: #FFFFFF;
    --headerTextIcons: #FFFFFF;
    --headerSearchBoxBackground: rgba(255,255,255,.7);
    --headerSearchBoxIcon: #0C3B5E;
    --headerSearchPlaceholderText: #0C3B5E;
    --headerSearchButtonBackground: #0F6CBD;
    --headerSearchButtonBackgroundHover: #0C3B5E;
    --headerSearchButtonIcon: #FFFFFF;
    --headerSearchFilters: #0F6CBD;
    --headerSearchFiltersHover: #0C3B5E;
    --headerButtonsBackground: #0F6CBD;
    --headerButtonsBackgroundHover: #0C3B5E;
    --headerButtonsBackgroundSearch: #0F6CBD;
    --headerButtonsBackgroundSearchHover: #0C3B5E;
    --headerBadgeBackground: #0C3B5E;
    --headerBadgeText: #FFFFFF;
    --headerSearchIcon: #FFFFFF;
    --searchBoxBackground: rgba(255,255,255,.7);
    --fallback-black: #000000;
    --fallback-blackTranslucent50: rgba(0,0,0,.5);
    --fallback-blackTranslucent40: rgba(0,0,0,.4);
    --fallback-blackTranslucent20: rgba(0,0,0,.2);
    --fallback-blackTranslucent10: rgba(0,0,0,.1);
    --fallback-white: #FFFFFF;
    --fallback-whiteTranslucent40: rgba(255,255,255,.4);
    --fallback-whiteTranslucent90: rgba(255,255,255,.9);
    --fallback-neutralDark: #242424;
    --fallback-neutralPrimary: #424242;
    --fallback-neutralPrimaryAlt: #616161;
    --fallback-neutralPrimarySurface: #FFFFFF;
    --fallback-neutralSecondary: #808080;
    --fallback-neutralSecondarySurface: #FAFAFA;
    --fallback-neutralTertiary: #D1D1D1;
    --fallback-neutralTertiaryAlt: #E0E0E0;
    --fallback-neutralTertiarySurface: #F0F0F0;
    --fallback-neutralQuaternary: #E5E5E5;
    --fallback-neutralQuaternaryAlt: #EBEBEB;
    --fallback-neutralLight: #F0F0F0;
    --fallback-neutralLighter: #F5F5F5;
    --fallback-neutralLighterAlt: #FAFAFA;
    --fallback-redDark: #A4262C;
    --fallback-green20: #498205;
    --fallback-purple: #881798;
    --fallback-suiteuxNeutralLight: #E1DFDD;
    --fallback-suiteuxNeutralSecondary: #484644;
    --fallback-flaggedMessage: #fffdd9;
    --fallback-richUserContentBackground: #fff;
    --fallback-composeNeutralBackground: #fff;
    --fallback-composeNeutralLighterBackground: #F5F5F5;
    --fallback-readingPaneCardBorder: #EBEBEB;
    --fallback-readingPaneCardFocusBorder: #D1D1D1;
    --fallback-oobeWhite: #ffffff;
    --fallback-oobePrimary: #0078d4;
    --fallback-oobeDarkAlt: #106EBE;
    --fallback-oobeThemeLighter: #DEECF9;
    --fallback-cardStyleWhite: #ffffff;
    --fallback-freeBusyAwayColor: #B4009E;
    --fallback-messageWebWarning: #fff4ce;
    --fallback-messageMobileWarningPrimary: #ffd335;
    --fallback-messageMobileWarningShade20: #c2a129;
    --fallback-messageMobileWarningShade30: #8f761e;
    --fallback-messageMobileWarningTint30: #fff2c3;
    --fallback-messageMobileWarningTint40: #fff8df;
    --fallback-communicationBlueWebPrimary: #0078d4;
    --fallback-messageMobileDangerPrimary: #d92c2c;
    --fallback-messageMobileDangerShade20: #a52121;
    --fallback-messageMobileDangerTint30: #f4b9b9;
    --fallback-messageMobileDangerTint40: #f9d9d9;
    --fallback-messageMobileSuccessPrimary: #13a10e;
    --fallback-presenceDoNotDisturb: #c50f1f;
    --fallback-addisonComponentButtonGradientStart: #f7f0ff;
    --fallback-addisonComponentButtonGradientEnd: #e9dfff;
    --fallback-storageCritialStateColor: #9F282B;
    --fallback-storageCritialStateHoverColor: #751D1F;
    --fallback-storageNearingStateColor: #835B00;
    --fallback-storageNearingStateHoverColor: #463100;
    --fallback-storageUsageBarBorder: #ffffff;
    --fallback-bizBarRed: #FDE7E9;
    --fallback-msqOneDrive: #3483FA;
    --fallback-msqTeams: #9A44FC;
    --fallback-msqOutlook: #C48600;
    --fallback-msqWindows: #D64400;
    --fallback-msqEdge: #1BA756;
    --fallback-placesLightBlueSolidColor: #28DFF8;
    --fallback-placesNavyBlueSolidColor: #209DF5;
    --fallback-placesBackgroundColorPink: rgba(255,116,243,.2);
    --fallback-placesBackgroundColorPurple: rgba(205,112,255,.2);
    --fallback-placesBackgroundColorLightBlue: rgba(39,213,248,.2);
    --fallback-placesBackgroundColorNavy: rgba(9,99,121,.2);
    --fallback-placesBluePrimary: #0078d4;
    --fallback-placesBlueTint40: #a9d3f2;
    --fallback-placesLightBackground3: #f5f5f5;
    --fallback-placesNeutralGrey92: #ebebeb;
    --fallback-colorBrandBackgroundInvertedSelected: #cfe4fa;
    --fallback-colorBrandBackgroundInvertedHover: #ebf3fc;
    --fallback-colorPaletteCornflowerBackground2: #2C3C85;
    --fallback-placesBlueGradient1: #2A4FFE;
    --fallback-placesBlueGradient2: #4D30FC;
    --fallback-placesBlueBackground1: #E1E6FC;
    --fallback-placesBlueForeground1: #637CEF;
    --fallback-placesBlueBorder1: #2510BC;
    --fallback-placesCornflowerForeground1: #F7F9FE;
    --fallback-placesRemote1: #CDEDF4;
    --fallback-placesRemoteBorder1: #0099BC;
    --fallback-neutralBackground6: #E6E6E6;
    --fallback-lilacBackground2: #E6BFED;
    --fallback-neutralForeground4: #707070;
    --fallback-neutralBackground2Pressed: #DBDBDB;
    --fallback-sharedCornflowerTint20: #778DF1;
    --fallback-sharedCornflowerTint30: #93A4F4;
    --fallback-sharedCornflowerTint50: #E1E6FC;
    --fallback-sharedCornflowerTint60: #F7F9FE;
    --fallback-sharedCornFlowerShade20: #3C51B4;
    --fallback-placesPurpleOOFBackground1: #F5DAF2;
    --fallback-placesPurpleOOFForeground1: #AF33A1;
    --fallback-placesPurpleGradient1: #6A11CB;
    --fallback-boxShadowPrimary: rgba(0, 0, 0, 0.14);
    --fallback-boxShadowSecondary: rgba(0, 0, 0, 0.12);
    --fallback-copilotGradientStart: #BA6DF1;
    --fallback-copilotGradientEnd: #4B9DF5;
    --fallback-themeDarker: #0C3B5E;
    --fallback-themeDark: #0F548C;
    --fallback-themeDarkAlt: #115EA3;
    --fallback-themePrimary: #0F6CBD;
    --fallback-themeSecondary: #2B88D8;
    --fallback-themeSecondarySurfaceSelected: #CFE4FA;
    --fallback-themeTertiary: #62ABF5;
    --fallback-themeLight: #B4D6FA;
    --fallback-themeLighter: #CFE4FA;
    --fallback-themeLighterAlt: #EBF3FC;
    --fallback-headerBackground: #0F6CBD;
    --fallback-headerBackgroundSearch: #0F6CBD;
    --fallback-headerBrandText: #FFFFFF;
    --fallback-headerTextIcons: #FFFFFF;
    --fallback-headerSearchBoxBackground: rgba(255,255,255,.7);
    --fallback-headerSearchBoxIcon: #0C3B5E;
    --fallback-headerSearchPlaceholderText: #0C3B5E;
    --fallback-headerSearchButtonBackground: #0F6CBD;
    --fallback-headerSearchButtonBackgroundHover: #0C3B5E;
    --fallback-headerSearchButtonIcon: #FFFFFF;
    --fallback-headerSearchFilters: #0F6CBD;
    --fallback-headerSearchFiltersHover: #0C3B5E;
    --fallback-headerButtonsBackground: #0F6CBD;
    --fallback-headerButtonsBackgroundHover: #0C3B5E;
    --fallback-headerButtonsBackgroundSearch: #0F6CBD;
    --fallback-headerButtonsBackgroundSearchHover: #0C3B5E;
    --fallback-headerBadgeBackground: #0C3B5E;
    --fallback-headerBadgeText: #FFFFFF;
    --fallback-headerSearchIcon: #FFFFFF;
    --fallback-searchBoxBackground: rgba(255,255,255,.7);
	*/
});