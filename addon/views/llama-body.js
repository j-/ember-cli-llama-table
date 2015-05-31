import Em from 'ember';
var observer = Em.observer;
var computed = Em.computed;
var alias = computed.alias;

var LlamaBody = Em.ContainerView.extend({
	classNames: ['llama-body'],
	isEmpty: alias('controller.isEmpty'),
	isLoading: alias('controller.isLoading'),

	columngroups: null,
	rows: null,

	contentView: computed({
		get: function () {
			var controller = this.get('controller');
			var View = controller.get('ContentView');
			return this.createChildView(View, {
				controller: controller,
				columngroups: this.get('columngroups'),
				rows: this.get('rows')
			});
		}
	}),

	subcontentView: computed({
		get: function () {
			var controller = this.get('controller');
			var View = controller.get('SubcontentView');
			return this.createChildView(View, {
				controller: controller,
				rows: this.get('rows')
			});
		}
	}),

	emptyView: computed({
		get: function () {
			var controller = this.get('controller');
			var View = controller.get('EmptyView');
			return this.createChildView(View, {
				controller: controller
			});
		}
	}),

	loadingView: computed({
		get: function () {
			var controller = this.get('controller');
			var View = controller.get('LoadingView');
			return this.createChildView(View, {
				controller: controller
			});
		}
	}),

	init: function () {
		this._super();
		this.pushObject(this.get('contentView'));
	},

	toggleSubcontent: observer('controller.hasSubcontent', function () {
		var hasSubcontent = this.get('controller.hasSubcontent');
		if (hasSubcontent) {
			this.pushObject(this.get('subcontentView'));
		}
		else {
			this.removeObject(this.get('subcontentView'));
		}
	}).on('init'),

	toggleEmpty: observer('isEmpty', 'isLoading', function () {
		var isEmpty = this.get('isEmpty');
		var isLoading = this.get('isLoading');
		var emptyView = this.get('emptyView');
		var loadingView = this.get('loadingView');
		if (!isEmpty) {
			this.removeObjects([emptyView, loadingView]);
		}
		else if (isLoading) {
			this.removeObject(emptyView);
			this.pushObject(loadingView);
		}
		else {
			this.removeObject(loadingView);
			this.pushObject(emptyView);
		}
	}).on('init')
});

export default LlamaBody;
