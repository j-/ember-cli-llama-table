import Em from 'ember';
import ScrollXYMixin from 'llama-table/mixins/scroll-xy';
var observer = Em.observer;
var computed = Em.computed;
var alias = computed.alias;
var bool = computed.bool;

var LlamaTable = Em.Component.extend(ScrollXYMixin, {
	layoutName: 'components/llama-table-main',
	classNames: 'llama-table',
	dualHeaders: bool('root.dualHeaders'),
	showFooter: bool('root.showFooter'),
	scrollLeft: alias('root.scrollLeft'),
	scrollTop: alias('root.scrollTop'),

	rows: null,
	columngroups: null,

	headerView: computed({
		get: function () {
			var View = this.get('root.HeaderView');
			return this.createChildView(View, {
				root: this.get('root'),
				columngroups: this.get('columngroups')
			});
		}
	}),

	dualHeaderView: computed({
		get: function () {
			var View = this.get('root.HeaderView');
			return this.createChildView(View, {
				root: this.get('root'),
				columngroups: this.get('columngroups')
			});
		}
	}),

	bodyView: computed({
		get: function () {
			var View = this.get('root.BodyView');
			return this.createChildView(View, {
				root: this.get('root'),
				columngroups: this.get('columngroups'),
				rows: this.get('rows')
			});
		}
	}),

	footerView: computed({
		get: function () {
			var View = this.get('root.FooterView');
			return this.createChildView(View, {
				root: this.get('root'),
				columngroups: this.get('columngroups'),
				rows: this.get('rows')
			});
		}
	}),

	didInsertElement: function () {
		this._super();
		this.setHeight();
		this.updateScrollPosition();
	},

	updateScrollPosition: observer('scrollLeft', 'scrollTop', function () {
		var $table = Em.$(this.$());
		$table.scrollLeft(this.get('scrollLeft'));
		$table.scrollTop(this.get('scrollTop'));
	}),

	setHeight: observer('root.maxHeight', function () {
		var $table = Em.$(this.$());
		$table.css('maxHeight', this.get('root.maxHeight'));
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

export default LlamaTable;
