/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by:
 *	http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *	https://github.com/kelektiv/node-uuid
 */
Ext.define('Sonicle.UUID', {
	singleton: true,
	requires: [
		'Sonicle.Crypto'
	],
	
	seedBytes: null,
	nodeId: null,
	clockseq: null,
	
	v1: Ext.emptyFn(),
	v4: Ext.emptyFn(),
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		
		me.seedBytes = Sonicle.Crypto.getRandomBytes(16);
		// Create and 48-bit node id, (47 random bits + multicast bit = 1)
		me.nodeId = [
			me.seedBytes[0] | 0x01,
			me.seedBytes[1], me.seedBytes[2], me.seedBytes[3], me.seedBytes[4], me.seedBytes[5]
		];
		// Randomize (14 bit) clockseq
		me.clockseq = (me.seedBytes[6] << 8 | me.seedBytes[7]) & 0x3fff;
		
		me.v1 = Ext.data.identifier.Uuid.createSequential(
			me.buildSalt(me.nodeId),
			new Date().getTime(),
			me.clockseq
		);
		me.v4 = Ext.data.identifier.Uuid.createRandom();
	},
	
	privates: {
		buildSalt: function(bytes) {
			var u8 = new Uint8Array(bytes),
					u32bytes = u8.buffer.slice(-4); // last four bytes as a new `ArrayBuffer`
			return new Uint32Array(u32bytes)[0];
		}
	}
});

