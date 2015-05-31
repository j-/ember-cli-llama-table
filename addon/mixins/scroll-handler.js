import Em from 'ember';
var get = Em.get;
var run = Em.run;

/**
 * Enables custom 'scroll' event.
 * @module mixins
 * @constructor
 * @class ScrollHandlerMixin
 * @extends Ember.Mixin
 */
var ScrollHandlerMixin = Em.Mixin.create({
	didInsertElement: function () {
		this._super();
		var context = this;
		Em.$(this.$()).on('scroll.scroll-handler-mixin', function (e) {
			context.handleEvent('scroll', e);
		});
	},
	willDestroyElement: function () {
		Em.$(this.$()).off('scroll.scroll-handler-mixin');
		this._super();
	}
});

export default ScrollHandlerMixin;
