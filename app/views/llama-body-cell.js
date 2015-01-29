import Em from 'ember';
import LlamaCell from './llama-cell';
import ArrowKeysMixin from 'llama-table/mixins/arrow-keys';
var get = Em.get;
var addObserver = Em.addObserver;
var removeObserver = Em.removeObserver;

var LlamaBodyCell = LlamaCell.extend(ArrowKeysMixin, {
	layoutName: 'llama-body-cell',
	classNames: 'llama-body-cell',
	attributeBindings: ['tabindex'],
	tabindex: 0,

	// column definition
	column: null,

	// table definition
	row: null,

	observedFields: function () {
		var observes = this.get('column.observes');
		if (!Em.isEmpty(observes)) {
			return observes;
		}
		var id = this.get('column.name');
		return id;
	}.property(),

	didInsertElement: function () {
		var row = this.get('row');
		var observes = this.get('observedFields');
		addObserver(row, observes, this, 'updateValue');
	},

	willDestroyElement: function () {
		var row = this.get('row');
		var observes = this.get('observedFields');
		removeObserver(row, observes, this, 'updateValue');
	},

	updateValue: function () {
		var id = this.get('column.name');
		var row = this.get('row');
		var value = get(row, id);
		this.set('value', value);
	}.on('init').observes('column'),

	getColumnIndex: function () {
		var column = this.get('column');
		var columns = this.get('controller.columns');
		return columns.indexOf(column);
	},

	getRowIndex: function () {
		var row = this.get('row');
		var rows = this.get('controller.rows');
		return rows.indexOf(row);
	},

	mouseEnter: function () {
		var $this = this.$();
		var $body = $this.closest('.llama-body');
		var $columns = $body.find('.llama-column');
		var index = $this.index();
		$columns.each(function () {
			var $column = Em.$(this);
			var $cells = $column.find('.llama-cell');
			var $cell = $cells.eq(index);
			$cell.addClass('hover');
		});
	},

	mouseLeave: function () {
		var $this = this.$();
		var $body = $this.closest('.llama-body');
		var $columns = $body.find('.llama-column');
		var index = $this.index();
		$columns.each(function () {
			var $column = Em.$(this);
			var $cells = $column.find('.llama-cell');
			var $cell = $cells.eq(index);
			$cell.removeClass('hover');
		});
	},

	actions: {
		keyLeft: function () {
			var row = this.getRowIndex();
			var col = this.getColumnIndex();
			this.get('controller').send('focusLeft', row, col);
		},
		keyUp: function () {
			var row = this.getRowIndex();
			var col = this.getColumnIndex();
			this.get('controller').send('focusUp', row, col);
		},
		keyRight: function () {
			var row = this.getRowIndex();
			var col = this.getColumnIndex();
			this.get('controller').send('focusRight', row, col);
		},
		keyDown: function () {
			var row = this.getRowIndex();
			var col = this.getColumnIndex();
			this.get('controller').send('focusDown', row, col);
		}
	}
});

export default LlamaBodyCell;
