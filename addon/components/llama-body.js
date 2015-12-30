import Em from 'ember';
var on = Em.on;
var observer = Em.observer;
var computed = Em.computed;
var alias = computed.alias;

var LlamaBody = Em.Component.extend({
	layoutName: 'components/llama-body',
	classNames: ['llama-body'],
	isEmpty: alias('root.isEmpty'),
	isLoading: alias('root.isLoading'),

	columngroups: null,
	rows: null,

	contentView: computed({
		get: function () {
			var View = this.get('root.ContentView');
			return this.createChildView(View, {
				root: this.get('root'),
				columngroups: this.get('columngroups'),
				rows: this.get('rows')
			});
		}
	}),

	subcontentView: computed({
		get: function () {
			var View = this.get('root.SubcontentView');
			return this.createChildView(View, {
				root: this.get('root'),
				rows: this.get('rows')
			});
		}
	}),

	emptyView: computed({
		get: function () {
			var View = this.get('root.EmptyView');
			return this.createChildView(View, {
				root: this.get('root')
			});
		}
	}),

	loadingView: computed({
		get: function () {
			var View = this.get('root.LoadingView');
			return this.createChildView(View, {
				root: this.get('root')
			});
		}
	}),

	// init: function () {
	// 	this._super();
	// 	this.pushObject(this.get('contentView'));
	// },

	// toggleSubcontent: on('init', observer('root.hasSubcontent', function () {
	// 	var hasSubcontent = this.get('root.hasSubcontent');
	// 	if (hasSubcontent) {
	// 		this.pushObject(this.get('subcontentView'));
	// 	}
	// 	else {
	// 		this.removeObject(this.get('subcontentView'));
	// 	}
	// })),

	// toggleEmpty: on('init', observer('isEmpty', 'isLoading', function () {
	// 	var isEmpty = this.get('isEmpty');
	// 	var isLoading = this.get('isLoading');
	// 	var emptyView = this.get('emptyView');
	// 	var loadingView = this.get('loadingView');
	// 	if (!isEmpty) {
	// 		this.removeObjects([emptyView, loadingView]);
	// 	}
	// 	else if (isLoading) {
	// 		this.removeObject(emptyView);
	// 		this.pushObject(loadingView);
	// 	}
	// 	else {
	// 		this.removeObject(loadingView);
	// 		this.pushObject(emptyView);
	// 	}
	// }))
});

export default LlamaBody;
