import Em from 'ember';
import ScrollXYMixin from 'llama-table/mixins/scroll-xy';
var observer = Em.observer;
var computed = Em.computed;
var alias = computed.alias;
var bool = computed.bool;

var LlamaTable = Em.ContainerView.extend(ScrollXYMixin, {
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

	footerView: null,

	init: function () {
		this._super();
		this.pushObject(this.get('headerView'));
		this.pushObject(this.get('bodyView'));
	},

	didInsertElement: function () {
		this._super();
		this.toggleDualHeader();
		this.toggleFooter();
		this.setHeight();
		this.updateScrollPosition();
	},

	toggleDualHeader: observer('dualHeaders', function () {
		var dualHeaders = this.get('dualHeaders');
		if (dualHeaders) {
			this.pushObject(this.get('dualHeaderView'));
		}
		else {
			this.removeObject(this.get('dualHeaderView'));
		}
	}),

	toggleFooter: observer('showFooter', function () {
		var showFooter = this.get('showFooter');
		var View, footerView;
		if (showFooter) {
			// create and show footer
			View = this.get('root.FooterView');
			footerView = this.createChildView(View, {
				root: this.get('root'),
				columngroups: this.get('columngroups'),
				rows: this.get('rows')
			});
			this.set('footerView', footerView);
			this.pushObject(footerView);
		}
		else {
			// remove and unset footer
			footerView = this.get('footerView');
			this.removeObject(footerView);
			this.set('footerView', null);
		}
	}),

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
