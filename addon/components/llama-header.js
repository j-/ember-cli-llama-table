import Em from 'ember';
var get = Em.get;
var set = Em.set;
var observer = Em.observer;
var alias = Em.computed.alias;
var filterBy = Em.computed.filterBy;

var LlamaHeader = Em.Component.extend({
	layoutName: 'components/llama-header',
	classNames: 'llama-header',
	itemViewClass: alias('root.HeaderColumngroupView'),
	columngroupViews: filterBy('childViews', 'isVisible', true),
	contentBinding: 'columngroups',
	scrollTop: alias('root.scrollTop'),

	columngroups: null,

	didInsertElement: function () {
		this._super();
		this.updateScrollPosition();
	},

	// createChildView: function (View, attrs) {
	// 	var columns = get(attrs, 'content');
	// 	set(attrs, 'root', this.get('root'));
	// 	set(attrs, 'columns', columns);
	// 	return this._super(View, attrs);
	// },

	updateScrollPosition: observer('scrollTop', function () {
		var $header = Em.$(this.$());
		$header.css('marginTop', this.get('scrollTop'));
	})
});

export default LlamaHeader;
