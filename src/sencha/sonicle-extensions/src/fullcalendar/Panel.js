/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.Panel', {
	extend: 'Ext.panel.Panel',
	alias: ['widget.sofullcalendarpanel'],
	requires: [
		'Sonicle.Object',
		'Sonicle.String',
		'Sonicle.Utils',
		'Sonicle.fullcalendar.FullCalendar',
		'Sonicle.fullcalendar.api.DropZone',
		'Sonicle.fullcalendar.api.EventDataMixin',
		'Sonicle.fullcalendar.api.EventWithResourceDataMixin'
	],
	mixins: [
		'Ext.util.StoreHolder'
	],
	
	layout: 'fit',
	ariaRole: 'presentation',
	defaultBindProperty: 'store',
	componentCls: 'so-'+'fullcalendar-panel',
	
	config: {
		
		/**
		 * @cfg {String} [locale]
		 */
		locale: 'en',
		
		/**
		 * @cfg {Boolean} [editable]
		 * Determines whether the events on the calendar can be modified.
		 */
		editable: true,
		
		/**
		 * @cfg {Boolean} [selectable]
		 * Allows a user to highlight multiple days or timeslots by clicking and dragging.
		 */
		selectable: true,
		
		/**
		 * @cfg {Boolean} [selectForAdd]
		 * A selection represents a new event being created. To disable this behaviour set this to `false`.
		 */
		selectForAdd: true,
		
		/**
		 * @cfg {Boolean} [eventAllowAllDayMutation]
		 * Set to `false` to disable dragging from a timed section to an all-day section and vice versa.
		 */
		eventAllowAllDayMutation: true,
		
		/**
		 * @cfg {Boolean} [eventResizableFromStart]
		 * Whether the user can resize an event from its starting edge.
		 */
		eventResizableFromStart: true,
		
		/**
		 * @cfg {Boolean} [showNowIndicator]
		 * Whether or not to display a marker indicating the current time.
		 */
		showNowIndicator: true,
		
		/**
		 * @cfg {Boolean} [showWeekNumbers]
		 * Determines if week numbers should be displayed on the calendar.
		 */
		showWeekNumbers: false,
		
		/**
		 * @cfg {Ext.data.Store} tagsStore
		 * The Store that this column should use as its data source
		 */
		tagsStore: null
	},
	
	/**
	 * @cfg {String} tagNameField
	 * The underlying {@link Ext.data.Field#name data field name} of {@link #tagsStore} to bind as name.
	 */
	tagNameField: 'name',
	
	/**
	 * @cfg {String} tagColorField
	 * The underlying {@link Ext.data.Field#name data field name} of {@link #tagsStore} to bind as color.
	 */
	tagColorField: 'color',
	
	/**
	 * @cfg {Boolean} [showToolbar]
	 * Specifies whether to show top-toolbar.
	 */
	showToolbar: true,
	
	/**
	 * @cfg {Boolean} [toolbarBorder]
	 * Specifies whether to show top-toolbar border.
	 */
	toolbarBorder: false,
	
	/**
	 * @cfg {String[]} [toolbarLayout]
	 * An array indicating the configuration layout of top-toolbar.
	 * You can omit some items or alter the order to customize the resulting layot.
	 * Allowed items are the following:
	 *  - 'headerText': the header item displaying a sort of view title
	 *  - 'controlButtons': section for control buttons (previous, today, next)
	 *  - 'viewButtons': section for view selection buttons
	 *  - 'extraItems': section that groups any specified extra-item
	 *  
	 * Plus the following items to control spacing ad alignment:
	 *  - '->': begin using the right-justified container
	 *  - ' ': add horizontal space between elements
	 *  - '-': add a vertical separator bar between toolbar items
	 */
	toolbarLayout: ['controlButtons', '->', 'headerText', '->', 'viewButtons'],
	
	/**
	 * @cfg {Object/Object[]} [toolbarExtraItems]
	 * A single extra item, or an array of extra child items to be added to the toolbar.
	 */
	toolbarExtraItems: undefined,
	
	/**
	 * @cfg {Number} [headerTextMinWidth]
	 * The minimum value in pixels which header text will set its width to.
	 */
	headerTextMinWidth: undefined,
	
	/**
	 * @cfg {Function/String} headerTextRenderer
	 * A renderer is an 'interceptor' method which can be used to transform data (value,
	 * appearance, etc.) before it is rendered.
	 * @param {Object} value The data value for the current cell
	 */
	headerTextRenderer: false,	
	
	/**
	 * @cfg {Boolean/Object} [reloadButton]
	 * Set to `false` to hide reload-button in top-toolbar.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The icon Class to set.
	 */
	reloadButton: true,
	
	/**
	 * @cfg {Boolean/Object} [todayButton]
	 * Set to `false` to hide today-button in top-toolbar.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The icon Class to set.
	 */
	todayButton: true,
	
	/**
	 * @cfg {Boolean/Object} [previousButton]
	 * Set to `false` to hide previous-button in top-toolbar.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The icon Class to set.
	 */
	previousButton: true,
	
	/**
	 * @cfg {Boolean/Object} [nextButton]
	 * Set to `false` to hide next-button in top-toolbar.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The icon Class to set.
	 */
	nextButton: true,
	
	/**
	 * @cfg {String|Date} [initialDate]
	 * An ISO date String (in `Y-m-d` format) or a Date object to set as starting point.
	 */
	initialDate: undefined,
	
	/**
	 * @cfg {String} [initialView]
	 * The initial view to apply, one of the follwing: day, week5,
	 * week, biweek, month, daytimeline, weektimeline, monthtimeline
	 */
	initialView: 'day',
	
	/**
	 * @cfg {Boolean/Object} [dayView]
	 * Set to `false` to not show day view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	dayView: true,
	
	/**
	 * @cfg {Boolean/Object} [week5View]
	 * Set to `false` to not show business-week view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	week5View: true,
	
	/**
	 * @cfg {Boolean/Object} [weekView]
	 * Set to `false` to not show week view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	weekView: true,
	
	/**
	 * @cfg {Boolean/Object} [biweekView]
	 * Set to `false` to not show two-weeks view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	biweekView: true,
	
	/**
	 * @cfg {Boolean/Object} [monthView]
	 * Set to `false` to not show month view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	monthView: true,
	
	/**
	 * @cfg {Boolean/Object} [dayTimelineView]
	 * Set to `true` to show day timeline view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	dayTimelineView: false,
	
	/**
	 * @cfg {Boolean/Object} [weekTimelineView]
	 * Set to `true` to show week timeline view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	weekTimelineView: false,
	
	/**
	 * @cfg {Boolean/Object} [monthTimelineView]
	 * Set to `true` to show month timeline view.
	 * An object may be given to customize button configuration:
	 * - `iconCls`: {String} The CSS icon class to use with button.
	 */
	monthTimelineView: false,
	
	/**
	 * @cfg {Object} [extraViewConfig]
	 * Keyed configuration object that allows to customize default internal 
	 * views configuration: use view name as key.
	 */
	extraViewConfig: undefined,
	
	/**
	 * @cfg {Number} [startDay]
	 * Number that represents the day of the week: Sunday=0, Monday=1, Tuesday=2, etc.
	 */
	startDay: 1,
	
	/**
	 * @cfg {Boolean} use24HourTime
	 * Determines whether times should be displayed as 12 hour times with am/pm (default)
	 * or 24 hour / military format.
	 */
	use24HourTime: false,
	
	/**
	 * @cfg {lrt|rtl} [direction]
	 * The direction that elements in the calendar are rendered. Either left-to-right or right-to-left.
	 */
	direction: 'ltr',
	
	/**
	 * @cfg {String} [slotMinTime]
	 * Determines the first time slot that will be displayed for each day.
	 */
	slotMinTime: '00:00',
	
	/**
	 * @cfg {String} [slotMaxTime]
	 * Determines the last time slot that will be displayed for each day.
	 */
	slotMaxTime: '24:00',
	
	/**
	 * @cfg {Number} [slotResolution]
	 * The duration of each time slot.
	 */
	slotResolution: 30,
	
	/**
	 * @cfg {Number} [spanningThreshold]
	 * The threshold (number of days) since the event is considered 'spanning' and so displayed on top in day-views.
	 */
	spanningThreshold: 1,
	
	/**
	 * @cfg {Boolean} [fixedWeekCount]
	 * Determines the number of weeks displayed in a month view.
	 * If `true` the calendar will always be 6 weeks tall, otherwise it will have 4, 5, or 6 weeks, depending on the month.
	 */
	fixedWeekCount: false,
	
	/**
	 * @cfg {Boolean} [showNonCurrentDates]
	 * In month view, whether dates in the previous or next month should be rendered at all.
	 * Set to `false` to disable non-current days and thus no events will be displayed.
	 */
	showNonCurrentDates: true,
	
	/**
	 * @cfg {Boolean} [showResources]
	 * Activates the resources column avaiable when using timeline views.
	 * It also enables {@link #resources} config to instructing how to populate resources data.
	 */
	showResources: false,
	
	/**
	 * @cfg {String} [resourcesOrderBy]
	 * The order-by String to apply in the format: "<field> [ASC|DESC], ..." (e.g. "title, id DESC")
	 * Default to "title".
	 */
	
	/**
	 * @cfg {Object[]|Object|Function} [resources]
	 * Specifies how to retrieve data for resources; value can be:
	 *  - Object[]|Object: defines data statically by passing a single or multiple items
	 *  - Function: defines a loading function that allow any sort of asynchronous
	 *  behaviour to retrieve data.
	 *    function( fetchInfo, successCallback, failureCallback ) { }
	 *  - none (meaning not defined): if {@link #showResources} is enabled, and {@link #store store's}
	 *  model uses {@link Sonicle.fullcalendar.api.EventWithResourceDataMixin} will force to extract 
	 *  resources data directly from main event's Store
	 */
	
	/**
	 * @cfg {Boolean} [reloadResourcesOnNavigate]
	 * Determines whether to reload resources when navigating.
	 */
	reloadResourcesOnNavigate: false,
	
	/**
	 * @cfg {Number|String|auto} [resourceAreaWidth]
	 * The initial width of resourceArea.
	 * A numeric value will be interpreted as the number of pixels; a string 
	 * value will be treated as a CSS value with units. If set to `auto`, 
	 * resources column width will be adjusted to automatically adopt 
	 * the width of the larger label.
	 */
	
	/**
	 * @cfg {Boolean/Object/Object[]} [businessHours]
	 * Emphasizes certain time slots on the calendar: if `true` the default business hours will be emphasized (Monday-Friday, 9am-5pm).
	 * An object may be given to render business hours with fine-grain control over the days/hours.
	 * The object may have any of the following properties:
	 * - `daysOfWeek`: {Number[]} Days of week. an array of zero-based day of week integers (0=Sunday) (eg. [1,2,3,4] Monday - Thursday)
	 * - `startTime`: {String} A start time (eg. '10:00')
	 * - `endTime`: {String} An end time (eg. '18:00')
	 */
	businessHours: false,
	
	/**
	 * @cfg {String} [scrollTime]
	 * Determines how far forward the scroll pane is initially scrolled.
	 */
	scrollTime: '06:00',
	
	/**
	 * @cfg {Boolean} [eventsForceSolidDisplay]
	 * Forces events rendering as solid rectangles in day/time views.
	 */
	eventsForceSolidDisplay: true,
	
	/**
	 * @cfg {String} [storeStartParam]
	 * The parameter name, injected in ant Store's requests, that describes the start of the interval being fetched.
	 */
	storeStartParam: 'startDate',
	
	/**
	 * @cfg {String} [storeEndParam]
	 * The parameter name, injected in ant Store's requests, that describes the end of the interval being fetched.
	 */
	storeEndParam: 'endDate',
	
	/**
	 * @cfg {String} [dateParamFormat]
	 * The date format of the above date params to send to the server.
	 */
	dateParamFormat: 'Y-m-d',
	
	/**
	 * @cfg {Object} [buttonConfigs]
	 * Object with custom configs for toolbar buttons.
	 * Button's name will be the key of each button config.
	 */
	
	/**
	 * @cfg {Object} [buttonTexts]
	 */
	buttonTexts: {
		reload: {
			text: false,
			tooltip: 'Reload'
		},
		today: {
			text: 'Today',
			tooltip: 'Today'
		},
		previous: {
			text: false,
			tooltip: 'Previous'
		},
		next: {
			text: false,
			tooltip: 'Next'
		},
		dayView: {
			text: 'Day',
			tooltip: 'Daily view'
		},
		week5View: {
			text: 'Week (5days)',
			tooltip: 'Weekly view (business week)'
		},
		weekView: {
			text: 'Week',
			tooltip: 'Weekly view'
		},
		biweekView: {
			text: 'Bi-Week',
			tooltip: 'Bi-Weekly view'
		},
		monthView: {
			text: 'Month',
			tooltip: 'Monthly view'
		},
		daytimelineView: {
			text: 'Day',
			tooltip: 'Daily timeline view'
		},
		weektimelineView: {
			text: 'Week',
			tooltip: 'Weekly timeline view'
		},
		monthtimelineView: {
			text: 'Month',
			tooltip: 'Monthly timeline view'
		}
	},
	
	/**
	 * @cfg {Object} [texts]
	 */
	texts: {
		resourcesAreaTitle: 'Resources',
		weekShort: 'W',
		//more: '+{0} more...',
		ddCreate: 'New: {0}',
		ddMove: 'Move: {0}',
		ddCopy: 'Copy: {0}',
		ddResize: 'Resize: {0}'
	},
	
	eventIconsCls: {
		attendees: 'far fa-user',
		broken: 'fas fa-unlink',
		content: 'far fa-comment-dots',
		meeting: 'fas fa-video',
		private: 'fas fa-lock',
		recurring: 'fas fa-sync',
		reminder: 'far fa-bell',
		tag: 'fas fa-tag',
		timezone: 'fas fa-globe',
		
		datetime: 'far fa-clock',
		location: 'fas fa-location-dot',
		organizer: 'fas fa-user-clock',
		calendar: 'fas fa-calendar'
	},
	
	rendererNames: {
		headerText: 'headerTextRenderer',
		eventContent: 'eventContentRenderer',
		eventTooltip: 'eventTooltipRenderer',
		resourceLabelContent: 'resourceLabelContentRenderer'
	},
	
	storeQuerying: false,
	lastResources: null,
	suspendViewButtonToggle: 0,
	
	/**
	 * @event eventclick
	 * Fired when event is clicked.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Model} record
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event eventdblclick
	 * Fired when event is double clicked.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Model} record
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event eventcontextmenu
	 * Fired when event is right clicked.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Model} record
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event dayclick
	 * Fired when day/date is clicked.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Date} date
	 * @param {Boolean} allDay
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event daydblclick
	 * Fired when day/date is double clicked.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Date} date
	 * @param {Boolean} allDay
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event daycontextmenu
	 * Fired when day/date is right clicked.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Date} date
	 * @param {Boolean} allDay
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event selectadd
	 * Fired when a period range is selected for adding.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Date} start The start bound.
	 * @param {Date} end The end bound.
	 * @param {Boolean} allDay If boundaries are all-day.
	 */
	
	/**
	 * @event viewchange
	 * Fired when the calendar switched to a new view.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {String} view
	 * @param {Date} [date]
	 */
	
	/**
	 * @event beforeeventresize
	 * Fired before an event is resized. A handler can return false to cancel the operation.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Date} start The new start bound.
	 * @param {Date} end The new end bound.
	 * @param {Boolean} allDay If boundaries are all-day.
	 */
	
	/**
	 * @event eventresize
	 * Fired after an event was resized.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Record} record The resized (modified) record.
	 */
	
	/**
	 * @event beforeeventmove
	 * Fired before an event is moved. A handler can return false to cancel the operation.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Record} record The record being moved.
	 * @param {Date} start The new start bound.
	 * @param {Date} end The new end bound.
	 * @param {Boolean} allDay If boundaries are all-day.
	 */
	
	/**
	 * @event eventmove
	 * Fired after an event was resized.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Record} record The moved (modified) record.
	 */
	
	/**
	 * @event beforeeventcopy
	 * Fired before an event is copied. A handler can return false to cancel the operation.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Record} record The record being copied.
	 * @param {Date} start The new start bound.
	 * @param {Date} end The new end bound.
	 * @param {Boolean} allDay If boundaries are all-day.
	 */
	
	/**
	 * @event eventcopy
	 * Fired after an event was copied.
	 * @param {Sonicle.fullcalendar.Panel} this
	 * @param {Ext.data.Record} record The newly copied record.
	 */
	
	/**
	 * @event reloadclick
	 * Fired after the reload button was clicked
	 * @param {Sonicle.fullcalendar.Panel} this
	 */
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this,
			items = [];
		me.bindStore(me.store || 'ext-empty-store', true, true);
		
		if (me.showToolbar) items.push(me.createToolbarItemCfg({width: '100%'}));
		me.lastView = me.initialView;
		items.push(me.createCalendarItemCfg({width: '100%', flex: 1}));
		Ext.apply(me, {
			layout: 'vbox',
			items: items
		});
		me.setupRenderer('headerText');
		me.setupRenderer('eventContent');
		me.setupRenderer('eventTooltip');
		me.setupRenderer('resourceLabelContent');
		me.callParent(arguments);
		me.initialized = true;
	},
	
	doDestroy: function() {
		this.setTagsStore(null);
		this.callParent();
	},
	
	updateLocale: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setOption('locale', nv);
	},
	
	updateEditable: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setOption('editable', nv);
	},
	
	updateSelectable: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setOption('selectable', nv);
	},
	
	updateSelectForAdd: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setSelectForAdd(nv);
	},
	
	updateEventAllowAllDayMutation: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setEventAllowAllDayMutation(nv);
	},
	
	updateShowNowIndicator: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setOption('nowIndicator', nv);
	},
	
	updateShowWeekNumbers: function(nv, ov) {
		var cal = this.getCalendar();
		if (cal) cal.setOption('weekNumbers', nv);
	},
	
	applyTagsStore: function(store) {
		if (store) {
			store = Ext.data.StoreManager.lookup(store);
		}
		return store;
	},
	
	/**
	 * Binds a store to this instance.
	 * @param {Ext.data.AbstractStore/String} [store] The store to bind or ID of the store.
	 * When no store given (or when `null` or `undefined` passed), unbinds the existing store.
	 */
	bindStore: function(store, /* private */ initial) {
		var me = this;
		me.mixins.storeholder.bindStore.call(me, store, initial);
		store = me.getStore();
	},
	
	/**
	 * See {@link Ext.util.StoreHolder StoreHolder}.
	 */
	getStoreListeners: function(store) {
		var me = this;
		if (!store.isEmptyStore) {
			return {
				load: me.onStoreLoad,
				add: me.onStoreAdd,
				remove: me.onStoreRemove,
				update: me.onStoreUpdate,
				clear: me.onStoreClear
			};
		}
	},
	
	/**
	 * Returns header toolbar component.
	 * @return {Ext.toolbar.Toolbar}
	 */
	getHeaderBar: function() {
		return this.initialized ? this.getComponent(0) : undefined;
	},
	
	/**
	 * Returns FullCalendar component wrapper.
	 * @return {PanelAnonym$0@call;getComponent}
	 */
	getCalendar: function() {
		return this.initialized ? this.getComponent(1) : undefined;
	},
	
	/**
	 * Moves the calendar to an arbitrary date.
	 * @param {String|Date} date An ISO date String (in `Y-m-d` format) or a Date object.
	 */
	moveTo: function(date) {
		this.getCalendar().moveTo(date);
	},
	
	/**
	 * Moves the calendar on today date.
	 */
	moveToday: function() {
		this.getCalendar().moveToday();
	},
	
	/**
	 * Moves the calendar one step backward (by a month or week for example).
	 */
	movePrevious: function() {
		this.getCalendar().movePrevious();
	},
	
	/**
	 * Moves the calendar one step forward (by a month or week for example).
	 */
	moveNext: function() {
		this.getCalendar().moveNext();
	},
	
	/**
	 * Immediately switches to a different view. Optionally it can navigate to a date.
	 * @param {String} name View's name.
	 * @param {String|Date} [date] An ISO date String (in `Y-m-d` format) or a Date object.
	 */
	changeView: function(name, date) {
		var me = this,
			btn = me.viewButton(name);
		me.suspendViewButtonToggle++;
		me.getCalendar().changeView(name, date);
		if (btn) btn.setPressed(true);
		me.suspendViewButtonToggle--;
	},
	
	/**
	 * Returns an object containing active view's boundary dates.
	 * @returns {Object}
	 */
	getViewBounds: function() {
		return this.getCalendar().getViewBounds();
	},
	
	/**
	 * Programmatically selects a period of time.
	 * @param {String|Date} start An ISO date-time String (in `Y-m-d H:i` format) or a Date object.
	 * @param {String|Date} [end] An ISO date-time String (in `Y-m-d H:i` format) or a Date object.
	 * @param {Boolean} [allDay]
	 */
	select: function(start, end, allDay) {
		this.getCalendar().select(start, end, allDay);
	},
	
	/**
	 * Clears the current selection.
	 */
	clearSelection: function() {
		this.getCalendar().clearSelection();
	},
	
	refreshResources: function() {
		this.getCalendar().reloadResources();
	},
	
	privates: {
		toolbarCls: function() {
			return this.componentCls + '-toolbar';
		},
		
		toolbarHeaderTextCls: function() {
			return this.toolbarCls() + '-hdtext';
		},
		
		// HeaderText: ('headerText', fcViewType, fcViewDate, fcViewStart, fcViewEnd, fcArg, context)
		// EventContent ('eventContent', fcViewType, fcEvent, fcArg, context)
		// EventTooltip: ('eventTooltip', fcViewType, fcEvent, fcArg, context)
		// ResourceLabelContent ('resourceLabelContent, fcViewType, fcResource, fcArg, context)
		
		defaultHeaderTextRenderer: function(fcViewType, fcViewDate, fcViewStart, fcViewEnd, fcArg, context) {
			var SoS = Sonicle.String,
				baseCls = context.toolbarHeaderTextCls(),
				options = {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					separator: ' - ',
					isEndExclusive: true
				},
				html = '';
			
			html += '<span class="'+baseCls+'-deflt">';
			if (SoS.contains(fcViewType, 'week')) Ext.apply(options, {month: 'short'});
			html += Sonicle.String.htmlEncode(this.fcViewFormatRange(fcArg.view, fcViewStart, fcViewEnd, options));
			html += '</span>';
			return html;
		},
		
		defaultEventContentRenderer: function(fcViewType, fcEvent, fcArg, context) {
			// Returning `true` means to use internal default rendering!
			return true;
		},
		
		defaultEventToolipRenderer: function(fcView, fcEvent, fcArg, context) {
			return fcEvent.title;
		},
		
		defaultResourceLabelContentRenderer: function(fcViewType, fcResource, fcArg, context) {
			// Returning `true` means to use internal default rendering!
			return true;
		},
		
		viewButton: function(name) {
			var hb = this.getHeaderBar(),
				segComp, comp;
			if (hb) {
				segComp = hb.getComponent('viewButtons');
				if (segComp) comp = segComp.getComponent(name);
			}
			return comp;
		},
		
		setupRenderer: function(type) {
			var me = this,
				name = me.rendererNames[type],
				renderer = me[name];
			
			if (!renderer) {
				renderer = me[name] = me['default'+Ext.String.capitalize(name)];
			}
		},
		
		createToolbarItemCfg: function(cfg) {
			var me = this,
				SoS = Sonicle.String,
				segButton = function(name, propSuffix, cfg) {
					cfg = cfg || {};
					var texts = me.buttonTexts[name + (propSuffix || '')] || {},
						config = (me.buttonConfigs || {})[name + (propSuffix || '')];
					if (Ext.isString(texts.text)) cfg.text = texts.text;
					if (Ext.isString(texts.tooltip)) cfg.tooltip = texts.tooltip;
					return Ext.apply(config || {}, {
						itemId: name,
						value: name
					}, cfg);
				},
				controlButtons = [],
				viewButtons = [],
				items = [];
			
			// Prepare control buttons
			if (me.previousButton != false) { // NB: keep != operand here
				controlButtons.push(segButton('previous', null, {
					iconCls: 'fas fa-angle-left',
					handler: function() {
						me.movePrevious();
					}
				}));
			}
			if (me.todayButton != false) {
				controlButtons.push(segButton('today', null, {
					handler: function() {
						me.moveToday();
					}
				}));
			}
			if (me.nextButton != false) {
				controlButtons.push(segButton('next', null, {
					iconCls: 'fas fa-angle-right',
					handler: function() {
						me.moveNext();
					}
				}));
			}
			
			// Prepare view buttons
			if (me.dayView != false) { // NB: keep != operand here
				viewButtons.push(segButton('day', 'View'));
			}
			if (me.week5View != false) {
				viewButtons.push(segButton('week5', 'View'));
			}
			if (me.weekView != false) {
				viewButtons.push(segButton('week', 'View'));
			}
			if (me.biweekView != false) {
				viewButtons.push(segButton('biweek', 'View'));
			}
			if (me.monthView != false) {
				viewButtons.push(segButton('month', 'View'));
			}
			if (me.dayTimelineView != false) {
				viewButtons.push(segButton('daytimeline', 'View'));
			}
			if (me.weekTimelineView != false) {
				viewButtons.push(segButton('weektimeline', 'View'));
			}
			if (me.monthTimelineView != false) {
				viewButtons.push(segButton('monthtimeline', 'View'));
			}
			
			/*
			items.push(button('dayListView', null, {
					handler: function() {
						me.changeView('daylist');
					}
				}));
			*/
			
			Ext.iterate(me.toolbarLayout, function(item) {
				if ('headerText' === item) {
					items.push({
						xtype: 'tbtext',
						itemId: 'headerText',
						cls: me.toolbarHeaderTextCls(),
						html: '',
						//html: me.renderHeaderText(me.initialDate, me.initialView),
						minWidth: me.headerTextMinWidth
					});
					
				} else if ('controlButtons' === item) {
					if (!Ext.isEmpty(controlButtons)) {
						items.push({
							xtype: 'segmentedbutton',
							itemId: 'controlButtons',
							allowToggle: false,
							items: controlButtons
						});
					}
					if (me.reloadButton != false) {
						items.push(segButton('reload', null, {
							iconCls: 'fas fa-arrows-rotate',
							handler: function() {
								me.fireEvent('reloadclick', me);
							}
						}));
					}
					
				} else if ('viewButtons' === item) {
					if (!Ext.isEmpty(viewButtons)) {
						items.push({
							xtype: 'segmentedbutton',
							itemId: 'viewButtons',
							items: viewButtons,
							value: me.initialView,
							listeners: {
								toggle: function(s, btn, pressed) {
									if (me.suspendViewButtonToggle === 0 && pressed) {
										me.changeView(btn.getItemId());
									}
								}
							}
						});
					}
					
				} else if ('extraItems' === item && Ext.isDefined(me.toolbarExtraItems)) {
					Ext.iterate(Ext.Array.from(me.toolbarExtraItems), function(extraItem) {
						//TODO: sanitize itemId (reserved names are 'headerText', 'controlButtons', 'viewButtons')
						items.push(extraItem);
					});
					
				} else if (SoS.isIn(item, ['->', ' ', '-'])) {
					// Directly use it as toolbar item...
					items.push(item);
				}
			});
			
			return Ext.apply({
				xtype: 'toolbar',
				cls: me.toolbarCls(),
				border: me.toolbarBorder,
				items: items
			}, cfg || {});
		},
		
		createCalendarItemCfg: function(cfg) {
			var me = this,
				SoS = Sonicle.String,
				SoO = Sonicle.Object,
				showResources = me.showResources,
				viewExtraConfig = SoO.objectValue(me.extraViewConfig, {}),
				viewCfg = function(key, type, extraConfig, defaultConfig) {
					var cfg = Ext.apply({}, SoO.objectValue(extraConfig[key], {}), defaultConfig);
					return Ext.apply(cfg, {
						type: type
					});
				},
				texts = me.texts || {},
				views = {}, sources = [],
				resources,
				iniDate;
			
			if (me.dayView != false) {
				views['day'] = viewCfg('day', 'timeGridDay', viewExtraConfig, {
					dayHeaderFormat: me.fcDayHeaderFmtOptions('timeGrid'),
					slotLabelFormat: me.fcSlotHeaderFmtOptions('timeGrid')
				});
			}
			if (me.week5View != false) {
				views['week5'] = viewCfg('week5', 'timeGridWeek', viewExtraConfig, {
					hiddenDays: [0, 6],
					dayHeaderFormat: me.fcDayHeaderFmtOptions('timeGrid'),
					slotLabelFormat: me.fcSlotHeaderFmtOptions('timeGrid')
				});
			}
			if (me.weekView != false) {
				views['week'] = viewCfg('week', 'timeGridWeek', viewExtraConfig, {
					dayHeaderFormat: me.fcDayHeaderFmtOptions('timeGrid'),
					slotLabelFormat: me.fcSlotHeaderFmtOptions('timeGrid')
				});
			}
			if (me.biweekView != false) {
				views['biweek'] = viewCfg('biweek', 'dayGrid', viewExtraConfig, {
					duration: {weeks: 2},
					dayHeaderFormat: me.fcDayHeaderFmtOptions('dayGrid'),
					slotLabelFormat: me.fcSlotHeaderFmtOptions('timeGrid')
				});
			}
			if (me.monthView != false) {
				views['month'] = viewCfg('month', 'dayGridMonth', viewExtraConfig, {
					dayHeaderFormat: me.fcDayHeaderFmtOptions('dayGrid')
				});
				//https://github.com/fullcalendar/fullcalendar/issues/5762
			}
			if (me.dayTimelineView != false) {
				views['daytimeline'] = viewCfg('daytimeline', showResources ? 'resourceTimelineDay' : 'timelineDay', viewExtraConfig, {
					slotLabelFormat: me.fcSlotHeaderFmtOptions('timeline', {viewType: 'daytimeline'})
				});
			}
			if (me.weekTimelineView != false) {
				views['weektimeline'] = viewCfg('weektimeline', showResources ? 'resourceTimelineWeek' : 'timelineWeek', viewExtraConfig, {
					slotLabelFormat: [
						me.fcSlotHeaderFmtOptions('timeline', {viewType: 'weektimeline', level: 0}),
						me.fcSlotHeaderFmtOptions('timeline', {viewType: 'weektimeline', level: 1})
					]
				});
			}
			if (me.monthTimelineView != false) {
				views['monthtimeline'] = viewCfg('monthtimeline', showResources ? 'resourceTimelineMonth' : 'timelineMonth', viewExtraConfig, {
					slotLabelFormat: me.fcSlotHeaderFmtOptions('timeline', {viewType: 'monthtimeline'})
				});
			}
			
			views['daylist'] = viewCfg('daylist', 'listDay', viewExtraConfig, {
				//dayHeaderFormat: me.fcDayHeaderFmtOptions('month')
			});
			
			// Default source: store's data
			sources.push(me.createDefaultSource());
			
			// Populate resources if necessary
			if (showResources === true) {
				if (Ext.isFunction(me.resources)) {
					resources = me.resources;
				} else if (Ext.isDefined(me.resources)) {
					resources = Ext.Array.from(me.resources);
				}
			}
			
			if (Ext.isDate(me.initialDate)) {
				iniDate = Ext.Date.format(me.initialDate, 'Y-m-d');
			} else if (Ext.isString(me.initialDate)) {
				iniDate = me.initialDate;
			}
			
			return Ext.apply({
				xtype: 'sofullcalendar',
				resourceAreaWidth: me.resourceAreaWidth,
				selectForAdd: SoO.booleanValue(me.selectable, true),
				eventAllowAllDayMutation: SoO.booleanValue(me.eventAllowAllDayMutation, true),
				texts: me.texts,
				calendar: Ext.merge({
					schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
					locale: SoO.stringValue(me.locale, 'en'),
					firstDay: SoO.numberValue(me.startDay, 1),
					direction: SoO.stringValue(me.direction, 'ltr'),
					views: views,
					eventSources: sources,
					initialView: me.initialView,
					initialDate: iniDate,
					editable: SoO.booleanValue(me.editable, true),
					selectable: SoO.booleanValue(me.selectable, true),
					eventResizableFromStart: SoO.booleanValue(me.eventResizableFromStart, true),
					nowIndicator: SoO.booleanValue(me.showNowIndicator, true),
					weekNumbers: SoO.booleanValue(me.showWeekNumbers, false),
					weekText: SoO.stringValue(texts.weekShort, 'W'),
					resources: resources,
					resourceOrder: SoS.deflt(me.toResourceOrder(me.resourcesOrderBy), 'title'),
					refetchResourcesOnNavigate: me.reloadResourcesOnNavigate,
					//resourceAreaWidth: me.resourceAreaInitialWidth,
					resourceAreaHeaderContent: texts.resourcesAreaTitle,
					slotMinTime: SoO.stringValue(me.slotMinTime, '00:00:00'),
					slotMaxTime: SoO.stringValue(me.slotMaxTime, '24:00:00'),
					slotDuration: Sonicle.Date.formatDuration(SoO.numberValue(me.slotResolution, 30) * 60),
					//slotLabelFormat: me.fcTimeFmtOptions({hour: 'numeric', minute: '2-digit'}),
					fixedWeekCount: SoO.booleanValue(me.fixedWeekCount, false),
					showNonCurrentDates: SoO.booleanValue(me.showNonCurrentDates, true),
					businessHours: me.businessHours,
					scrollTime: SoO.stringValue(me.scrollTime, '06:00:00'),
					scrollTimeReset: false, // Disable scroll reset whenever the date range changes,
					dayMaxEvents: true, // Limits the number of event in dayGrid day (this will force day-squares to have same size)
					datesSet: function(info) {
						var hb = me.getHeaderBar(), cmp;
						if (hb) {
							cmp = hb.getComponent('headerText');
							if (cmp) cmp.setHtml(me.callRenderer('headerText', info.view.type, info.view.calendar.getDate(), info.view.currentStart, info.view.currentEnd, info, me));
						}
					},
					eventDataTransform: function(eventData) {
						if (!eventData.allDay) {
							var SoD = Sonicle.Date,
								ext = eventData.extendedProps, end;
							if (SoD.diffDays(ext.startDate, ext.endDate) >= me.spanningThreshold) {
								eventData.allDay = true;
								if (!ext.isAllDay) {
									eventData.end = Ext.Date.format(SoD.add(ext.endDate, {days: 1}, true), 'Y-m-d H:i:s').replace(' ', 'T');
								}
							}
							// https://stackoverflow.com/questions/47507910/fullcalendar-display-multi-days-event-in-allday-event
							// https://fullcalendar.io/docs/allDayMaintainDuration
						}
						return eventData;
					},
					//moreLinkDidMount: function(arg) {
					//	var XS = Ext.String;
					//	Ext.fly(arg.el).setHtml(XS.htmlEncode(XS.format(texts.more, arg.num)));
					//},
					slotLabelContent: function(arg) { // Customize default slotLabelFormat
						//var btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(arg.view);
						
						//TODO: for weekly timeline customize the first day (level 0) of each month to display the month reference
						//if ('timeline' === btype) {
						//	return me.fcViewFormatDate(arg.view, arg.date, me.fcSlotHeaderFmtOptions(btype), {level: arg.level, viewType: arg.view.type});
						//}
						return arg.text;
					},
					dayHeaderContent: function(arg) { // Customize default dayHeaderFormat
						var btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(arg.view),
							dateFormat = function(date) {
								return Ext.Date.format(date, 'Ymd');
							},
							reformat;
						
						if ('timeGrid' === btype) { // Make formatting dynamic in some cases
							reformat = arg.isToday
								|| (dateFormat(arg.date) === dateFormat(arg.view.activeStart));
							if (reformat) {
								return me.fcViewFormatDate(arg.view, arg.date, me.fcDayHeaderFmtOptions(btype, {detailed: true}));
							}
						}
						return arg.text;
					},
					dayCellContent: function(arg) { // Customize day-number
						var btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(arg.view),
							dateFormat = function(date) {
								return Ext.Date.format(date, 'Ymd');
							},
							reformat;
						
						if ('dayGrid' === btype) { // Make formatting dynamic in some cases
							reformat = arg.isToday
								// Reformats first day-box in previous month
								|| (arg.isOther && dateFormat(arg.date) === dateFormat(arg.view.activeStart))
								// Fixes wrong day display (full month word) on first day-box in bweek-view
								|| ((arg.view.type === 'biweek') && dateFormat(arg.date) === dateFormat(arg.view.activeStart))
								// Reformats the first date of every month
								|| (dateFormat(arg.date) === dateFormat(Ext.Date.getFirstDateOfMonth(arg.date)));
							if (reformat) {
								return me.fcViewFormatDate(arg.view, arg.date, me.fcDayCellFmtOptions(btype, {detailed: true, allow1Digits: true}));
							}
						}
						return arg.dayNumberText;
					},
					/*
					dayCellClassNames: function(arg) {
						// This fixes wrong classNames applied to 2weeks dayView: where isOther carry wrong values.
						var baseType = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(arg.view);
						//fc-day fc-day-mon fc-day-past fc-day-other fc-daygrid-day
						//fc-day fc-day-mon fc-day-past fc-daygrid-day
					},
					*/
					eventClassNames: function(arg) {
						var fn = me.eventClassNamesFunction;
						if (fn && fn.call) {
							return fn.call(me, arg.view.type, arg.event, arg, me);
						} else {
							return [];
						}
					},
					eventDidMount: function(arg) {
						var ttip = me.callRenderer('eventTooltip', arg.view.type, arg.event, arg, me),
							attrs = Sonicle.Utils.generateTooltipAttrs(ttip, Ext.apply(ttip.options || {}, {outputType: 'el'}));
						if (!Ext.isEmpty(attrs)) Ext.fly(arg.el).set(attrs);
					},
					eventContent: function(arg, createElement) {
						var html = me.callRenderer('eventContent', arg.view.type, arg.event, arg, me); // internal default renderer will return `true`
						return html === true ? true : {html: html || ''};
					},
					resourceLabelContent: function(arg) {
						var html = me.callRenderer('resourceLabelContent', arg.view.type, arg.resource, arg, me); // internal default renderer will return `true`
						return html === true ? true : {html: html || ''};
					},
					eventDrop: function(info) {
						me.fcHandleEventDrop(info);
					},
					eventResize: function(info) {
						me.fcHandleEventResize(info);
					}
				}, me.calendarExtraConfig || {}),
				listeners: {
					scope: me,
					eventclick: {fn: me.fcProxyPointerEvent, args: ['eventclick']},
					eventdblclick: {fn: me.fcProxyPointerEvent, args: ['eventdblclick']},
					eventcontextmenu: {fn: me.fcProxyPointerEvent, args: ['eventcontextmenu']},
					dayclick: {fn: me.fcProxyPointerEvent, args: ['dayclick']},
					daydblclick: {fn: me.fcProxyPointerEvent, args: ['daydblclick']},
					daycontextmenu: {fn: me.fcProxyPointerEvent, args: ['daycontextmenu']},
					selectadd: function(s, start, end, allDay) {
						me.fireEvent('selectadd', me, start, end, allDay);
					},
					viewchange: function(s, name, info) {
						me.fireEvent('viewchange', me, name, info);
					}
				}
			}, cfg || {});
		},
		
		createDefaultSource: function() {
			var me = this;
			return {
				id: 'default',
				display: me.eventsForceSolidDisplay ? 'block' : 'auto',
				events: function(fetchInfo, successCallback, failureCallback) {
					if (me.nextFetchWillGetNoItems === true) {
						delete me.nextFetchWillGetNoItems;
						me.setupResources(null);
						successCallback([]);
						
					} else if (me.nextFetchWillGetFromStore === true) {
						delete me.nextFetchWillGetFromStore;
						if (me.store) {
							successCallback(me.toFCData(me.store.getData().items, true).events);
						} else {
							failureCallback({message: 'no store'});
						}
						
					} else {
						me.queryStore(fetchInfo, function(recs, op, success) {
							if (success) {
								var resourcesFromStore = me.buildResourcesFromStore(),
									data = me.toFCData(recs, resourcesFromStore);
								me.setupResources(data.resources);
								successCallback(data.events);
							} else {
								failureCallback({message: op.error});
							}
						}, me);
					}
				}
			};
		},
		
		buildResourcesFromStore: function() {
			return this.showResources === true && !Ext.isDefined(this.resources); 
		},
		
		setupResources: function(resources) {
			var me = this,
				ores = me.lastResources,
				nres = null,
				cal;
			
			if (resources) {
				cal = me.getCalendar();
				if (cal) {
					if (ores) cal.removeResources(Ext.Object.getKeys(ores.ids));
					cal.addResources(resources.items);
					nres = resources;
				}
			}
			me.lastResources = nres;
		},
		
		onStoreLoad: function(store, recs, success) {
			var me = this, cal;
			if (success && !me.storeQuerying) {
				cal = me.getCalendar();
				me.nextFetchWillGetFromStore = true;
				cal.reloadEvents('default');
			}
		},

		onStoreAdd: function(store, recs) {
			var cal = this.getCalendar();
			if (cal) {
				Ext.iterate(recs, function(rec) {
					cal.addEvent(rec.toFCEvent(), 'default');
				});
			}
		},

		onStoreRemove: function(store, recs) {
			var cal = this.getCalendar();
			if (cal) {
				Ext.iterate(recs, function(rec) {
					cal.removeEvent(rec.getId());
				});
			}
		},

		onStoreUpdate: function(store, rec) {
			var cal = this.getCalendar();
			if (cal) {
				cal.removeEvent(rec.getId());
				cal.addEvent(rec.toFCEvent(), 'default');
			}
		},

		onStoreClear: function(store) {
			var cal = this.getCalendar();
			if (cal) {
				this.nextFetchWillGetNoItems = true;
				cal.reloadEvents('default');
			}
		},
		
		queryStore: function(fetchInfo, callback, scope) {
			var me = this,
				store = me.store,
				proxy = store ? store.getProxy() : null;
			
			if (proxy && proxy.type !== 'memory') {
				me.storeQuerying = true;
				Sonicle.Data.loadWithExtraParams(store, me.buildStoreExtraParams(fetchInfo), false, function(records, operation, success) {
					me.storeQuerying = false;
					Ext.callback(callback, scope || me, [records, operation, success]);
				});
			}
		},
		
		lookupStoreEvent: function(id) {
			var store = this.getStore(), rec;
			if (store) rec = store.getById(id);
			return rec;
		},
		
		buildStoreExtraParams: function(fetchInfo) {
			var me = this,
				obj = {};
			obj[me.storeStartParam] = Ext.Date.format(fetchInfo.start, me.dateParamFormat);
			obj[me.storeEndParam] = Ext.Date.format(fetchInfo.end, me.dateParamFormat);
			return obj;
		},
		
		doEventMove: function(op, orec, newStart, newEnd, allDay) {
			var me = this,
				SoD = Sonicle.Date,
				copy = (op === 'copy'),
				rec = copy ? orec.copy(null) : orec;
			
			rec.beginEdit();
			rec.set(rec.startField, SoD.clone(newStart));
			rec.set(rec.endField, SoD.clone(newEnd));
			rec.endEdit();
			if (copy && orec.store) orec.store.add(rec);
			me.fireEvent('event'+op, me, orec);
		},
		
		doEventResize: function(orec, newStart, newEnd, allDay) {
			var me = this,
				SoD = Sonicle.Date;
			
			orec.beginEdit();
			orec.set(orec.startField, SoD.clone(newStart));
			orec.set(orec.endField, SoD.clone(newEnd));
			orec.endEdit();
			me.fireEvent('eventresize', me, orec);
		},
		
		fcSlotHeaderFmtOptions: function(btype, opts) {
			opts = opts || {};
			var me = this;
			if ('timeGrid' === btype) {
				return {hour: 'numeric', minute: '2-digit'}; // 00:00 or 12am
			} else if ('timeline' === btype) {
				if (opts.viewType === 'daytimeline') {
					return {hour: 'numeric', minute: '2-digit'}; // 00:00 or 12am
				} else if (opts.viewType === 'weektimeline') {
					if (opts.level === 0) {
						return me.fcDayHeaderFmtOptions('timeGrid');
					} else if (opts.level === 1) {
						return {hour: 'numeric', minute: '2-digit'}; // 00:00 or 12am
					}
				} else if (opts.viewType === 'monthtimeline') {
					return {day: '2-digit', weekday: 'short', omitCommas: true};
				}
			}
			console.log('fcSlotHeaderFmtOptions: missing options for "' + btype + '"');
			return undefined;
		},
		
		fcDayHeaderFmtOptions: function(btype, opts) {
			opts = opts || {};
			if ('timeGrid' === btype) {
				if (opts.detailed === true) {
					return {month: 'short', day: '2-digit', weekday: 'short', omitCommas: true};
				} else {
					return {day: '2-digit', weekday: 'short', omitCommas: true};
				}
			} else if ('dayGrid' === btype) {
				return {weekday: 'long', omitCommas: true};
			}
			console.log('fcDayHeaderFmtOptions: missing options for "' + btype + '"');
			return undefined;
		},
		
		fcDayCellFmtOptions: function(btype, opts) {
			opts = opts || {};
			if ('dayGrid' === btype) {
				if (opts.detailed === true) {
					return {month: 'short', day: opts.allow1Digits === true ? 'numeric' : '2-digit', omitCommas: true};
				} else {
					return {day: '2-digit'};
				}
			}
			console.log('fcDayCellFmtOptions: missing options for "' + btype + '"');
			return {};
		},
		
		fcTimeFmtOptions: function(opts) {
			if (this.use24HourTime === true) {
				return Ext.apply(opts || {}, {
					hour12: false,
					omitZeroMinute: false
				});
			} else {
				return Ext.apply(opts || {}, {
					hour12: true,
					omitZeroMinute: true,
					meridiem: 'short'
				});
			}
		},
		
		fcViewFormatDate: function(view, date, options) {
			// Directly call formatDate reaching calendar from view's context.
			// This avoids calls to component wrapper.
			return view.calendar.formatDate(date, this.fcTimeFmtOptions(options));
		},
		
		fcViewFormatRange: function(view, start, end, options) {
			// Directly call formatDate reaching calendar from view's context.
			// This avoids calls to component wrapper.
			return view.calendar.formatRange(start, end, this.fcTimeFmtOptions(options));
		},
		
		fcProxyPointerEvent: function(name) {
			var me = this,
				XA = Ext.Array,
				args = arguments,
				rec;
			
			if (Sonicle.String.startsWith(name, 'event')) {
				rec = me.lookupStoreEvent(args[2]);
				if (rec) me.fireEventArgs(name, XA.push([me, rec], XA.slice(args, 3, args.length-1)));
			} else {
				me.fireEventArgs(name, XA.push([me], XA.slice(args, 2, args.length-1)));
			}
		},
		
		fcHandleEventDrop: function(info) {
			var me = this,
				op = me.getCalendar().dragZone.dragOperation('drag', info.jsEvent),
				rec = me.lookupStoreEvent(info.event.id);
			
			if (rec) {
				if (me.fireEvent('beforeevent'+op, me, rec, info.event.start, info.event.end, info.event.allDay) !== false) {
					me.doEventMove(op, rec, info.event.start, info.event.end, info.event.allDay);
				} else {
					info.revert();
				}
			}
		},
		
		fcHandleEventResize: function(info) {
			var me = this,
				rec = me.lookupStoreEvent(info.event.id);
			
			if (rec) {
				if (me.fireEvent('beforeeventresize', me, rec, info.event.start, info.event.end, info.event.allDay) !== false) {
					me.doEventResize(rec, info.event.start, info.event.end, info.event.allDay);
				} else {
					info.revert();
				}
			}
		},
		
		toFCData: function(recs, resources) {
			var events = [],
				resItems, resIds,
				res;
			
			if (resources === true) {
				resItems = [];
				resIds = {};
			}
			Ext.iterate(recs, function(rec) {
				events.push(rec.toFCEvent());
				if (resources === true && Ext.isFunction(rec.toFCResource)) {
					res = rec.toFCResource();
					if (!resIds[res.id]) {
						resIds[res.id] = true;
						resItems.push(res);
					}
				}
			});
			if (resources === true) {
				resItems = Ext.Array.sort(resItems, function(a, b) {
					return a > b ? 1 : (a === b) ? 0 : -1;
				});
			}
			
			return {
				events: events,
				resources: {
					items: resItems,
					ids: resIds
				}
			};
		},
		
		toResourceOrder: function(s) {
			var SoS = Sonicle.String,
				parsed = SoS.parseArray(s, undefined, function(v) {
					return SoS.parseArray(v, undefined, undefined, ' ');
				}),
				sort = [];
			
			Ext.iterate(parsed, function(value) {
				if (Ext.isArray(value) && !Ext.isEmpty(value)) {
					if (value.length > 1 && value[1].toUpperCase() === 'DESC') {
						sort += ('-'+value[0]);
					} else {
						sort += value[0];
					}
				}
			});
			
			return SoS.join(',', sort);
		},
		
		/**
		 * Internal method to call a named renderer.
		 * @param {String} name
		 * @param {Mixed} arg1
		 * @param {Mixed} arg2
		 * @param {Mixed} argX
		 * @returns {Mixed}
		 */
		callRenderer: function(name, arg1, arg2, argX) {
			var me = this,
				renderer = me[me.rendererNames[name]], ret;
			if (renderer && renderer.call) {
				ret = renderer.apply(me, Ext.Array.slice(arguments, 1));
			}
			return ret;
		}
	},
	
	statics: {
		currentMonthYearOnlyHeaderTextRenderer: function(fcViewType, fcViewDate, fcViewStart, fcViewEnd, fcArg, context) {
			var SoD = Sonicle.Date,
				baseCls = context.toolbarHeaderTextCls(),
				date, html = '';
			html += '<span class="'+baseCls+'-cmyo">';
			date = SoD.parse(fcViewDate, 'Y-m-d');
			if (Ext.isDate(date)) {
				html += '<span data-part="view-month">' + Sonicle.String.htmlEncode(SoD.format(date, 'F')) + '</span>';
				html += ' ';
				html += '<span data-part="view-year">' + SoD.format(date, 'Y') + '</span>';
			}
			html += '</span>';
			return html;
		},
		
		appointmentEventClassNamesFunction: function(fcViewType, fcEvent, fcArg, context) {
			return ['so-cal-appo'];
		},
		
		resourceLabelWithSwatchContentRenderer: function(fcViewType, fcResource, fcArg, context) {
			var fcExProps = fcResource.extendedProps,
				html = '';
			html += Sonicle.String.htmlEncode(fcArg.fieldValue);
			html += '<div class="so-cal-appo-swatch" style="border-color:' + fcExProps.color + ';"></div>';
			return html;
		},
		
		appointmentEventContentRenderer: function(fcViewType, fcEvent, fcArg, context) {
			var SoS = Sonicle.String,
				SoD = Sonicle.Date,
				icons = context.eventIconsCls,
				btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(fcArg.view),
				fcExProps = fcEvent.extendedProps,
				html = '', tags;
			
			if (SoS.isIn(btype, ['timeGrid'])) {
				var diff = SoD.diff(fcEvent.start, fcEvent.end || fcEvent.start, 'minutes', true),
					spanSlots = Math.ceil(diff/context.slotResolution),
					multislot = (btype === 'dayGrid') ? false : diff > context.slotResolution;
				
				html +=	'<div class="so-cal-appo-title';
				if (spanSlots > 2) html += ' so-cal-appo-title-spanning';
				html += '">';
				if (fcExProps.hasOtherTz) {
					html +=	'<span class="so-cal-appo-title-icon">';
					html +=	'<i class="' + icons.timezone + '" role="img"></i>';
					html +=	'</span>';
				} else if (fcExProps.isRecurring || fcExProps.isBroken) {
					html +=	'<span class="so-cal-appo-title-icon">';
					html +=	'<i class="' + (fcExProps.isBroken ? icons.broken : icons.recurring) + '" role="img"></i>';
					html +=	'</span>';
				}
				html +=	SoS.htmlEncode(fcEvent.title);
				if (!Ext.isEmpty(fcExProps.location)) {
					html +=	' ';
					html +=	'<span class="so-cal-appo-location">' + '@' + SoS.htmlEncode(fcExProps.location) + '</span>';
				}
				tags = Sonicle.form.field.Tag.buildTagsData(context.tagsStore, context.tagNameField, context.tagColorField, -1, fcExProps.tags);
				if (!Ext.isEmpty(tags)) {
					html +=	'<div class="so-cal-appo-tags">';
					Ext.iterate(tags, function(tag) {
						html +=	'<i class="' + icons.tag + '" style="color:' + tag.color + '" role="img"></i>';
					});
					html +=	'</div>';
				}
				html +=	'</div>';
				if (spanSlots > 1) {
					html +=	'<div class="so-cal-appo-bottomline"></div>';
					html +=	'<div class="so-cal-appo-icons">';
					if (fcExProps.isPrivate) {
						html +=	'<span class="so-cal-appo-icon">';
						html +=	'<i class="' + icons.private + '" role="img"></i>';
						html +=	'</span>';
					}
					if (fcExProps.hasReminder) {
						html +=	'<span class="so-cal-appo-icon">';
						html +=	'<i class="' + icons.reminder + '" role="img"></i>';
						html +=	'</span>';
					}
					if (fcExProps.hasMeeting) {
						html +=	'<span class="so-cal-appo-icon">';
						html +=	'<i class="' + icons.meeting + '" role="img"></i>';
						html +=	'</span>';
					} else if (fcExProps.hasAttendees) {
						html +=	'<span class="so-cal-appo-icon">';
						html +=	'<i class="' + icons.attendees + '" role="img"></i>';
						html +=	'</span>';
					} else if (fcExProps.hasBody) {
						html +=	'<span class="so-cal-appo-icon">';
						html +=	'<i class="' + icons.content + '" role="img"></i>';
						html +=	'</span>';
					}
					html +=	'</div>';
				}
			} else if (SoS.isIn(btype, ['dayGrid'])) {
				if (!fcExProps.isAllDay) {
					html += '<div class="so-cal-appo-swatch" style="border-color:' + fcExProps.color + ';"></div>';
					html += '<div class="so-cal-appo-time">';
					html +=	'</div>';
				}
				html +=	'<div class="so-cal-appo-title">';
				if (fcExProps.hasOtherTz) {
					html +=	'<span class="so-cal-appo-title-icon">';
					html +=	'<i class="' + icons.timezone + '" role="img"></i>';
					html +=	'</span>';
				} else if (fcExProps.isRecurring || fcExProps.isBroken) {
					html +=	'<span class="so-cal-appo-title-icon">';
					html +=	'<i class="' + (fcExProps.isBroken ? icons.broken : icons.recurring) + '" role="img"></i>';
					html +=	'</span>';
				}
				html +=	SoS.htmlEncode(fcEvent.title);
				if (!Ext.isEmpty(fcExProps.location)) {
					html +=	' ';
					html +=	'<span class="so-cal-appo-location">' + '@' + SoS.htmlEncode(fcExProps.location) + '</span>';
				}
				tags = Sonicle.form.field.Tag.buildTagsData(context.tagsStore, context.tagNameField, context.tagColorField, -1, fcExProps.tags);
				if (!Ext.isEmpty(tags)) {
					html +=	'<div class="so-cal-appo-tags">';
					Ext.iterate(tags, function(tag) {
						html +=	'<i class="' + icons.tag + '" style="color:' + tag.color + '" role="img"></i>';
					});
					html +=	'</div>';
				}
				html +=	'</div>';
			} else if (SoS.isIn(btype, ['timeline'])) {
				html +=	'<div class="so-cal-appo-title">';
				html +=	SoS.htmlEncode(fcEvent.title);
				html +=	'</div>';
			} else {
				html = true;
			}
			return html;
		},
		
		appointmentEventTooltipRenderer: function(fcViewType, fcEvent, fcArg, context) {
			var SoS = Sonicle.String,
				SoD = Sonicle.Date,
				SoTag = Sonicle.form.field.Tag,
				icons = context.eventIconsCls,
				fcExProps = fcEvent.extendedProps,
				start = fcExProps.startDate,
				end = fcExProps.endDate || fcExProps.startDate,
				html = '', tags;
			
			html += '<div class="so-cal-appo-hov">';
			html += '<div class="so-cal-appo-hov-group">';
			html += '<div class="so-cal-appo-hov-title">';
			html += SoS.htmlEncode(Ext.String.ellipsis(fcEvent.title, 50));
			html += '</div>';
			html += '<div class="so-cal-appo-hov-when">';
			if (!fcExProps.isAllDay) {
				html += context.fcViewFormatDate(fcArg.view, start, {month: 'short', day: '2-digit'});
				html += '&nbsp;';
				html += context.fcViewFormatDate(fcArg.view, start, {hour: 'numeric', minute: '2-digit'});
				html += '&nbsp;-&nbsp;';
				if (SoD.diffDays(start, end) === 0) {
					html += context.fcViewFormatDate(fcArg.view, end, {hour: 'numeric', minute: '2-digit'});
				} else {
					html += context.fcViewFormatDate(fcArg.view, end, {month: 'short', day: '2-digit'});
					html += '&nbsp;';
					html += context.fcViewFormatDate(fcArg.view, end, {hour: 'numeric', minute: '2-digit'});
				}
			} else {
				var diffDays = SoD.diffDays(start, end) -1;
				html += context.fcViewFormatDate(fcArg.view, start, {month: 'short', day: '2-digit'});
				if (diffDays > 0) {
					html += '&nbsp;-&nbsp;';
					html += context.fcViewFormatDate(fcArg.view, SoD.add(start, {days: diffDays}, true), {month: 'short', day: '2-digit'});
				}
			}
			html += '</div>';
			if (!Ext.isEmpty(fcExProps.location)) {
				html += '<div class="so-cal-appo-hov-where">';
				html += '<i class="' + icons.location + '"></i>';
				html += SoS.htmlEncode(fcExProps.location);
				html += '</div>';
			}
			html += '</div>';
			html += '<div class="so-cal-appo-hov-separator"></div>';
			html += '<div class="so-cal-appo-hov-calendar">';
			html += '<i class="' + icons.calendar + '"></i>';
			html += SoS.htmlEncode(fcExProps.calendarName + (!Ext.isEmpty(fcExProps.calendarOwner) ? ' (' + fcExProps.calendarOwner + ')' : ''));
			html += '</div>';
			if (!Ext.isEmpty(fcExProps.organizer)) {
				html += '<div class="so-cal-appo-hov-separator"></div>';
				html += '<div class="so-cal-appo-hov-organizer">';
				html += '<i class="' + icons.organizer + '"></i>';
				html += SoS.htmlEncode(fcExProps.organizer);
				html += '</div>';
			}
			tags = SoTag.buildTagsData(context.tagsStore, context.tagNameField, context.tagColorField, -1, fcExProps.tags);
			if (!Ext.isEmpty(tags)) {
				html += '<div class="so-cal-appo-hov-tags">';
				html += SoTag.generateTagsMarkup(tags);
				html += '</div>';
			}
			if (!Ext.isEmpty(fcExProps.description)) {
				html += SoS.htmlEncode(Ext.String.ellipsis(fcExProps.description, 250));
			}
			html += '</div>';
			
			return {
				title: '',
				text: html
			};
		},
		
		/*
		appointmentEventTooltipRenderer: function(fcView, fcEvent, fcArg, context) {
			var SoS = Sonicle.String,
				SoD = Sonicle.Date,
				SoTag = Sonicle.form.field.Tag,
				icons = context.eventIconsCls,
				fcExProps = fcEvent.extendedProps,
				start = fcEvent.start,
				end = fcEvent.end || fcEvent.start,
				html = '', tags;
			
			html += '<i class="' + icons.datetime + '"></i>&nbsp;';
			if (!fcExProps.isAllDay) {
				html += context.fcViewFormatDate(fcArg.view, start, {month: 'short', day: '2-digit'});
				html += '&nbsp;';
				html += context.fcViewFormatDate(fcArg.view, start, {hour: 'numeric', minute: '2-digit'});
				html += '&nbsp;-&nbsp;';
				if (SoD.diffDays(start, end) === 0) {
					html += context.fcViewFormatDate(fcArg.view, end, {hour: 'numeric', minute: '2-digit'});
				} else {
					html += context.fcViewFormatDate(fcArg.view, end, {month: 'short', day: '2-digit'});
					html += '&nbsp;';
					html += context.fcViewFormatDate(fcArg.view, end, {hour: 'numeric', minute: '2-digit'});
				}
			} else {
				html += context.fcViewFormatDate(fcArg.view, start, {month: 'short', day: '2-digit'});
				if ((SoD.diffDays(start, end) -1) > 0) {
					html += '&nbsp;-&nbsp;';
					html += context.fcViewFormatDate(fcArg.view, end, {month: 'short', day: '2-digit'});
				}
			}
			if (!Ext.isEmpty(fcExProps.location)) {
				html += '<br>';
				html += '<i class="' + icons.location + '"></i>&nbsp;';
				html += SoS.htmlEncode(fcExProps.location);
			}
			if (!Ext.isEmpty(fcExProps.organizer)) {
				html += '<br>';
				html += '<i class="' + icons.organizer + '"></i>&nbsp;';
				html += SoS.htmlEncode(fcExProps.organizer);
			}
			
			html += '<br>';
			html += '<i class="' + icons.calendar + '"></i>&nbsp;';
			html += SoS.htmlEncode(fcExProps.calendarName);
			
			tags = SoTag.buildTagsData(context.tagsStore, context.tagNameField, context.tagColorField, -1, fcExProps.tags);
			if (!Ext.isEmpty(tags)) {
				html += '<br>' +  SoTag.generateTagsMarkup(tags);
			}
			
			if (!Ext.isEmpty(fcExProps.description)) {
				html += '<br><br>';
				html += SoS.htmlEncode(Ext.String.ellipsis(fcExProps.description, 250));
			}
			
			return {
				title: Ext.String.ellipsis(fcEvent.title, 50),
				text: html
			};
		},
		*/
		
		appointmentOrigEventClassNamesFunction: function(fcViewType, fcArg, context) {
			return ['so-cal-appo-o'];
		},
		
		appointmentOrigEventContentRenderer: function(fcViewType, fcEvent, fcArg, context) {
			var SoS = Sonicle.String,
				icons = context.eventIconsCls,
				btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(fcArg.view),
				fcExProps = fcEvent.extendedProps,
				html = '', tags;
			
			if (SoS.isIn(btype, ['timeGrid', 'dayGrid'])) {
				html +=	'<div class="so-cal-appo-o-icons">';
				if (fcExProps.isRecurring || fcExProps.isBroken) {
					html +=	'<i class="' + (fcExProps.isBroken ? icons.broken : icons.recurring) + '"></i>';
				}
				if (fcExProps.hasOtherTz) {
					html +=	'<i class="' + icons.timezone + '"></i>';
				}
				if (fcExProps.isPrivate) {
					html +=	'<i class="' + icons.private + '"></i>';
				}
				if (fcExProps.hasReminder) {
					html +=	'<i class="' + icons.reminder + '"></i>';
				}
				if (fcExProps.hasAttendees) {
					html +=	'<i class="' + icons.attendees + '"></i>';
				} else if (fcExProps.hasMeeting) {
					html +=	'<i class="' + icons.meeting + '"></i>';
				} else if (fcExProps.hasBody) {
					html +=	'<i class="' + icons.content + '"></i>';
				}
				html +=	'</div>';
				html +=	'<span class="so-cal-appo-o-title">';
				html +=		SoS.htmlEncode(fcEvent.title);
				html +=	'</span>';
				if (!Ext.isEmpty(fcExProps.location)) {
					html +=	'<span class="so-cal-appo-o-location">';
					html +=		SoS.htmlEncode(fcExProps.location);
					html +=	'</span>';
				}
				tags = Sonicle.form.field.Tag.buildTagsData(context.tagsStore, context.tagNameField, context.tagColorField, -1, fcExProps.tags);
				if (!Ext.isEmpty(tags)) {
					html +=	'<div class="so-cal-appo-o-tags">';
					Ext.iterate(tags, function(tag) {
						html +=	'<i class="' + icons.tag + '" style="color:' + tag.color + '"></i>';
					});
					html +=	'</div>';
				}
				
			} else {
				html = true;
			}
			return html;
		}
	}
});