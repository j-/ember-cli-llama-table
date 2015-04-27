import Em from 'ember';
var get = Em.get;
var set = Em.set;
var observer = Em.observer;
var alias = Em.computed.alias;

var LlamaHeader = Em.CollectionView.extend({
	classNames: 'llama-header',
	itemViewClass: alias('controller.HeaderColumngroupView'),
	columngroupViews: alias('childViews'),
	contentBinding: 'columngroups',
	scrollTop: alias('controller.scrollTop'),

	columngroups: null,

	createChildView: function (View, attrs) {
		var columns = get(attrs, 'content');
		set(attrs, 'columns', columns);
		return this._super(View, attrs);
	},

	updateScrollPosition: observer('scrollTop', function () {
		var $header = Em.$(this.$());
		$header.css('marginTop', this.get('scrollTop'));
	}).on('didInsertElement')
});

export default LlamaHeader;
