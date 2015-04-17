import Em from 'ember';
import ScrollXYMixin from 'llama-table/mixins/scroll-xy';
import { iif, compact } from 'llama-table/computed';
var observer = Em.observer;
var computed = Em.computed;
var alias = computed.alias;
var collect = computed.collect;
var and = computed.and;
var not = computed.not;

var LlamaBody = Em.ContainerView.extend(ScrollXYMixin, {
	classNames: ['llama-body'],
	isEmpty: alias('controller.isEmpty'),
	isLoading: alias('controller.isLoading'),
	notLoading: not('controller.isLoading'),
	scrollLeft: alias('controller.scrollLeft'),
	scrollTop: alias('controller.scrollTop'),

	dynamicChildViews: compact(
		// always show content
		alias('contentView'),
		// only show subcontent if this table has subcontent
		iif(alias('controller.hasSubcontent'), alias('subcontentView')),
		// show empty message if no records and not loading
		iif(and('isEmpty', 'notLoading'), alias('emptyView')),
		// show loading message if no records and loading
		iif(and('isEmpty', 'isLoading'), alias('loadingView'))
	),

	columngroups: null,
	rows: null,

	updateChildViews: observer('dynamicChildViews', function () {
		while (this.get('childViews.length')) {
			this.popObject();
		}
		this.get('dynamicChildViews').forEach(function (view) {
			this.pushObject(view);
		}, this);
	}).on('init'),

	contentView: computed(function () {
		var View = this.get('controller.ContentView');
		return this.createChildView(View, {
			columngroups: this.get('columngroups'),
			rows: this.get('rows')
		});
	}),

	subcontentView: computed(function () {
		var View = this.get('controller.SubcontentView');
		return this.createChildView(View, {
			rows: this.get('rows')
		});
	}),

	emptyView: computed(function () {
		var View = this.get('controller.EmptyView');
		return this.createChildView(View, {});
	}),

	loadingView: computed(function () {
		var View = this.get('controller.LoadingView');
		return this.createChildView(View, {});
	}),

	updateScrollPosition: observer('didInsertElement', function () {
		var $body = this.$();
		if ($body && $body.length > 0) {
			$body.scrollLeft(this.get('scrollLeft'));
			$body.scrollTop(this.get('scrollTop'));
		}
	}),

	actions: {
		scrollX: function (pos) {
			this.set('scrollLeft', pos);
		},
		scrollY: function (pos) {
			this.set('scrollTop', pos);
		}
	}
});

export default LlamaBody;
