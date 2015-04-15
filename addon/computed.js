import Em from 'ember';
var computed = Em.computed;
var get = Em.get;
var set = Em.set;
var isEmpty = Em.isEmpty;
var isBlank = Em.isBlank;
var makeArray = Em.makeArray;

/**
 * Get the value of a descriptor or other data type.
 * @param {*} val Value to test
 * @param {Array} args Optional arguments to send to item if descriptor.
 * @return {*} Result of computation if descriptor, input value otherwise
 */
var getValue = function (val, args) {
	if (isDescriptor(val)) {
		if (!isEmpty(val.altKey)) {
			return get(this, val.altKey);
		}
		else {
			return val.func.apply(this, args);
		}
	}
	return val;
};

/**
 * Determine if the given value is an instance of `Ember.Descriptor`.
 * @param {*} val Value to test
 * @return {Boolean} Value is a descriptor
 */
var isDescriptor = function (val) {
	return val instanceof Em.Descriptor;
};

/**
 * Return an array of keys to listen to.
 * @param {Array} keys Inputs array. Can be strings or descriptors.
 * @return {String[]} All keys and dependent keys to listen to.
 */
var getDependentKeys = function (keys) {
	var result = Em.A();
	makeArray(keys).forEach(function (item) {
		if (typeof item === 'string') {
			result.pushObject(item);
		}
		else if (typeof item._dependentKeys !== 'undefined') {
			result.pushObjects(item._dependentKeys);
		}
	});
	return result.compact().uniq();
};

/**
 * Slice an array-like object.
 * @param {*} arr Objects like arrays, arguments, HTMLCollections etc
 * @param {Number} [start=0] Start index to begin slice
 * @param {Number} [end=arr.length] Index to end slice
 * @return {Array} New slice
 */
var slice = function (arr, start, end) {
	return Array.prototype.slice.call(arr, start, end);
};

export var defaultValue = function (watchKey, defaultValue) {
	return computed(watchKey, function (setKey, value) {
		// setter
		if (arguments.length > 1) {
			try {
				set(this, watchKey, value);
			}
			catch (e) {
				// swallow
			}
			return value;
		}
		// getter
		value = get(this, watchKey);
		return isBlank(value) ? defaultValue : value;
	});
};

export var join = function (watchKey, separator) {
	if (arguments.length < 2) {
		separator = ',';
	}
	return computed(watchKey, function () {
		var value = makeArray(this.get(watchKey));
		var strings = value.map(String);
		var result = strings.join(separator);
		return result;
	});
};

export var fmt = function (pattern) {
	var vals = slice(arguments, 1);
	var descriptors = Em.A(vals).filter(isDescriptor);
	var keys = getDependentKeys(descriptors);
	return computed(keys, function () {
		var computedArgs = slice(arguments);
		var formatArgs = vals.map(function (val) {
			return getValue.call(this, computedArgs);
		}, this);
		formatArgs.unshift(pattern);
		return Em.String.fmt.call(null, formatArgs);
	});
};

export default {
	defaultValue: defaultValue,
	join: join,
	fmt: fmt
};
