//@define Sonicle.calendar.data.EventMappings
/**
 * @class Sonicle.calendar.data.EventMappings
 * A simple object that provides the field definitions for Event records so that they can
 * be easily overridden.
 *
 * To ensure the proper definition of Sonicle.calendar.data.EventModel the override should be
 * written like this:
 *
 *      Ext.define('MyApp.data.EventMappings', {
 *          override: 'Sonicle.calendar.data.EventMappings'
 *      },
 *      function () {
 *          // Update "this" (this === Sonicle.calendar.data.EventMappings)
 *      });
 */
Ext.ns('Sonicle.calendar.data');

Sonicle.calendar.data.EventMappings = {
	Id: {
        name: 'id',
        //mapping: 'id',
        type: 'string'
    },
    EventId: {
        name: 'eventId',
        //mapping: 'eid',
        type: 'int'
    },
    CalendarId: {
        name: 'calendarId',
        //mapping: 'cid',
        type: 'int'
    },
	CalendarName: {
		name: 'calendarName',
		type: 'string'
	},
	Color: {
        name: 'color',
        //mapping: 'color',
        type: 'string'
    },
    Title: {
        name: 'title',
        //mapping: 'tit',
        type: 'string'
    },
	Description: {
		name: 'description',
		type: 'string'
	},
    StartDate: {
        name: 'startDate',
        //mapping: 'start',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s',
		dateWriteFormat: 'Y-m-d H:i:s'
    },
    EndDate: {
        name: 'endDate',
        //mapping: 'end',
        type: 'date',
        dateFormat: 'Y-m-d H:i:s',
		dateWriteFormat: 'Y-m-d H:i:s'
    },
    Location: {
        name: 'location',
        //mapping: 'loc',
        type: 'string'
    },
	Meeting: {
		name: 'meeting',
		type: 'string'
	},
    Notes: {
        name: 'notes',
        //mapping: 'notes',
        type: 'string'
    },
    Url: {
        name: 'Url',
        //mapping: 'url',
        type: 'string'
    },
    IsAllDay: {
        name: 'isAllDay',
        //mapping: 'ad',
        type: 'boolean'
    },
    IsPrivate: {
        name: 'isPrivate',
       // mapping: 'isPvt',
        type: 'boolean'
    },
	Timezone: {
        name: 'timezone',
        //mapping: 'tz',
        type: 'string'
    },
    Reminder: {
        name: 'reminder',
        //mapping: 'rem',
        type: 'int'
    },
	HasAttendees: {
        name: 'hasAtts',
		// mapping: 'hasAtts',
        type: 'boolean'
    },
	HasTimezone: {
        name: 'hasTz',
       // mapping: 'hasTz',
        type: 'boolean'
    },
	HasComments: {
        name: 'hasCmts',
       // mapping: 'hasCmts',
        type: 'boolean'
    },
    IsNew: {
        name: 'isNew',
        //mapping: 'isNew',
        type: 'boolean'
    },
	IsNotifyable: {
		name: 'isNtf',
		type: 'boolean'
	},
	Tags: {
		name: 'tags',
		//mapping: 'owner',
		type: 'string'
	},
	Owner: {
		name: '_owner',
		//mapping: 'owner',
		type: 'string'
	},
	Rights: {
		name: '_rights',
		//mapping: 'rights',
		type: 'string'
	},
	IsReadOnly: {
        name: 'isReadOnly',
		//mapping: 'isRO',
        type: 'boolean'
    },
	IsBroken: {
        name: 'isBroken',
		//mapping: 'isBrk',
        type: 'boolean'
    },
	IsRecurring: {
        name: 'isRecurring',
		//mapping: 'isRec',
        type: 'boolean'
    }
	
	/*
	EventId: {
        name: 'EventId',
        mapping: 'id',
        type: 'int'
    },
    CalendarId: {
        name: 'CalendarId',
        mapping: 'cid',
        type: 'int'
    },
    Title: {
        name: 'Title',
        mapping: 'title',
        type: 'string'
    },
    StartDate: {
        name: 'StartDate',
        mapping: 'start',
        type: 'date',
        dateFormat: 'c'
    },
    EndDate: {
        name: 'EndDate',
        mapping: 'end',
        type: 'date',
        dateFormat: 'c'
    },
    Location: {
        name: 'Location',
        mapping: 'loc',
        type: 'string'
    },
    Notes: {
        name: 'Notes',
        mapping: 'notes',
        type: 'string'
    },
    Url: {
        name: 'Url',
        mapping: 'url',
        type: 'string'
    },
    IsAllDay: {
        name: 'IsAllDay',
        mapping: 'ad',
        type: 'boolean'
    },
    Reminder: {
        name: 'Reminder',
        mapping: 'rem',
        type: 'string'
    },
    IsNew: {
        name: 'IsNew',
        mapping: 'n',
        type: 'boolean'
    }
	*/
};
