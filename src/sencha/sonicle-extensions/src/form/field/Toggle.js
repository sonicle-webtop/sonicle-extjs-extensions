/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Sonicle.form.field.Toggle', {
	extend: 'Ext.slider.Single',
	//alias: ['widget.sotogglefield'],
	
	minValueCls: 'so-'+'form-toggle-field-off',
	maxValueCls: 'so-'+'form-toggle-field-on',
	cls: 'so-'+'form-toggle-field',
	
	width: 50,
	
	constructor: function(cfg) {
		this.callParent([Ext.apply(cfg || {}, {
				minValue: 0,
				maxValue: 1,
				increment: 1
		})]);
	},
	
	initComponent: function() {
		var me = this;
		this.callParent(arguments);
		me.on('change', me.onChange, me);
	},
	
	applyMinValue: function() {
		return 0;
	},
	
	applyMaxValue: function() {
		return 1;
	},
	
	applyIncrement: function() {
		return 1;
	},
	
	updateMinValueCls: function(newValue, oldValue) {
		var el = this.el;
		console.log('updateMinValueCls');
		if (el && oldValue && el.hasCls(oldValue)) {
			el.replaceCls(oldValue, newValue);
		}
	},
	
	updateMaxValueCls: function(newValue, oldValue) {
		var el = this.el;
		console.log('updateMaxValueCls');
		if (el && oldValue && el.hasCls(oldValue)) {
			el.replaceCls(oldValue, newValue);
		}
	},
	
	getValue: function() {
		console.log('getValue');
		return this.callParent() ? true : false;
	},
	
	setValue: function(value, animate) {
		console.log('setValue');
		this.callParent([value ? 1 : 0, animate]);
	},
	
	toggle: function() {
		var me = this,
				value = me.getValue();
		console.log('toggle');
		me.setValue((value == 1) ? 0 : 1);
		return me;
	},
	
	onChange: function(s, newValue, thumb) {
		var isOn = newValue > 0,
				onCls = s.maxValueCls,
				offCls = s.minValueCls,
				el = s.el;
		console.log('onChange');
		if (el) {
			el.addCls(isOn ? onCls : offCls);
			el.removeCls(isOn ? offCls : onCls);
		}
	}
	
	/*
	.so-form-toggle-field .x-slider-thumb {
	background-color: #fafafa;
	background-image: none;
	border-color: black;
	border-radius: 50%;
	box-shadow: 0 2px 1px -3px rgba(0, 0, 0, 0.14), 0 2px 2px 0px rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
}
	*/
});

