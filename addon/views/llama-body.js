import Em from 'ember';
import ScrollXYMixin from 'llama-table/mixins/scroll-xy';
import CopyController from 'llama-table/controllers/copy';
var get = Em.get;
var set = Em.set;

var LlamaBody = Em.CollectionView.extend(ScrollXYMixin, {
	classNames: 'llama-body',

	content: Em.computed.alias('controller.columngroups'),
	itemViewClass: Em.computed.alias('controller.BodyColumngroupView'),
	columngroupViews: Em.computed.alias('childViews'),
	maxHeight: Em.computed.alias('controller.config.maxHeight'),

	createChildView: function (View, attrs) {
		var columns = get(attrs, 'content');
		set(attrs, 'columns', columns);
		return this._super(View, attrs);
	},

	copyController: function () {
		return CopyController.create();
	}.property(),

	willDestroy: function () {
		this.get('copyController').destroy();
		this._super();
	},

	keyDown: function (e) {
		var controller = this.get('copyController');
		var isCopy = controller.isShortcutCopy(e);
		var isRange = controller.isSelectionRange();
		if (isCopy && !isRange) {
			controller.copy(e.target);
		}
	},

	setMaxHeight: function () {
		this.$().css('max-height', this.get('maxHeight'));
	}.on('didInsertElement').observes('maxHeight'),

	actions: {
		scrollX: function (pos) {
			this.get('controller').send('scrollX', pos);
		},
		scrollY: function (pos) {
			this.get('controller').send('scrollY', pos);
		}
	}
});

export default LlamaBody;
