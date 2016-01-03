import Em from 'ember';
import ResizeColumns from 'llama-table/mixins/resize-columns';
import CellTypes from 'llama-table/mixins/cell-types';
import ViewConstructors from 'llama-table/mixins/view-constructors';
import FocusPosition from 'llama-table/mixins/focus-position';
import Columns from 'llama-table/controllers/columns';
import Rows from 'llama-table/controllers/rows';
import { defaultValue } from 'llama-table/computed';
var get = Em.get;
var observer = Em.observer;
var computed = Em.computed;
var alias = computed.alias;
var eq = computed.equal;
var collect = computed.collect;
var throttle = Em.run.throttle;

var SortedController = Em.ArrayProxy.extend({
	content: null,
	sortProperties: null,
	arrangedContent: Em.computed.sort('content', 'sortProperties')
});

var SCROLL_INTERVAL = 1000 / 60; // 60 fps
var SCROLL_IMMEDIATE = false; // invoke on trailing edge

/**
 * Llama Table Ember component.
 * See https://github.com/luxbet/ember-cli-llama-table.
 * @module components
 * @class LlamaTable
 * @constructor
 * @extends Ember.Component
 * @uses ResizeColumnsMixin
 * @uses CellTypesMixin
 * @uses ViewConstructorsMixin
 * @uses FocusPositionMixin
 */
var LlamaTable = Em.Component.extend(ResizeColumns, CellTypes, ViewConstructors, FocusPosition, {
	classNames: ['llama-table-component'],
	classNameBindings: ['isSortable', 'isResizable', 'datasetIsEmpty:is-empty', 'isLoading', 'hasSubcontent', 'showHeader', 'showFooter'],

	/**
	 * Column definitions array
	 * @property {Object[]} columns
	 * @public
	 * @see https://github.com/luxbet/ember-cli-llama-table/wiki/Column-definition
	 */
	columns: null,

	/**
	 * Row values array
	 * @property {Object[]} rows
	 * @public
	 */
	rows: null,

	/**
	 * Component configuration
	 * @property {Object} config
	 * @public
	 * @optional
	 * @see https://github.com/luxbet/ember-cli-llama-table/wiki/Table-configuration
	 */
	config: computed({
		get: function () {
			return {};
		}
	}),

	/**
	 * Column definitions array with added sorting functionality.
	 * @property {Ember.ArrayProxy} sortedColumns
	 */
	sortedColumns: computed({
		get: function () {
			return Columns.create({
				parentController: this,
				container: this.get('container'),
				sortProperties: ['order'],
				sortAscending: true,
				content: Em.A(this.get('columns'))
			});
		}
	}),

	/**
	 * Row values array with added sorting functionality. Uses a custom
	 *   'RowsController' if table has subcontent. Does not construct this
	 *   custom controller if it is not necessary.
	 * @property {Ember.ArrayProxy} sortedRows
	 */
	sortedRows: computed({
		get: function () {
			var options = {
				parentController: this,
				container: this.get('container'),
				sortProperties: this.get('sortProperties') || Em.A(),
				sortAscending: this.get('sortAscending'),
				content: Em.A(this.get('rows'))
			};
			// if `sortFunction` is present it will be called
			// even if the value itself is falsy and not a function
			var sortFunction = this.get('config.sortFunction');
			if (typeof sortFunction === 'function') {
				options.sortFunction = sortFunction;
			}
			var orderBy = this.get('config.orderBy');
			if (typeof orderBy === 'function') {
				options.orderBy = orderBy;
			}
			var Controller = SortedController;
			if (this.get('hasSubcontent')) {
				Controller = Rows;
			}
			return Controller.create(options);
		}
	}),

	/**
	 * Reference to the currently hovered row. Used to highlight rows.
	 * @property {Object} hoverRow
	 */
	hoverRow: null,

	/**
	 * Maximum height of table before introducing vertical scrollbars.
	 * @property {Number} maxHeight
	 */
	maxHeight: alias('config.maxHeight'),

	/**
	 * Enables sorting columns by clicking headers.
	 * @property {Boolean} isSortable
	 * @optional
	 * @default true
	 */
	isSortable: defaultValue('config.isSortable', true),

	/**
	 * Enables resizing columns by dragging header boundaries.
	 * @property {Boolean} isResizable
	 * @optional
	 * @default true
	 */
	isResizable: defaultValue('config.isResizable', true),

	/**
	 * Table is empty when there are no rows
	 * @property {Boolean} datasetIsEmpty
	 */
	datasetIsEmpty: eq('rows.length', 0),

	/**
	 * Can show a loading state.
	 * @property {Boolean} isLoading
	 * @optional
	 * @default false
	 */
	isLoading: defaultValue('config.isLoading', false),

	/**
	 * Column names to sort table by.
	 * @property {String[]} sortProperties
	 */
	sortProperties: alias('config.sortProperties'),

	/**
	 * Triggers a row sort properties update. Observes the `sortProperties`
	 *   property.
	 * @method updateSortProperties
	 */
	updateSortProperties: observer('sortProperties', function () {
		this.set('sortedRows.sortProperties', this.get('sortProperties'));
	}),

	/**
	 * Sort columns in ascending order.
	 * @property {Boolean} sortAscending
	 * @optional
	 * @default true
	 */
	sortAscending: defaultValue('config.sortAscending', true),

	/**
	 * Triggers a row sort order update. Observes the `sortAscending` property.
	 * @method updateRowSortOrder
	 */
	updateRowSortOrder: observer('sortAscending', function () {
		this.set('sortedRows.sortAscending', this.get('sortAscending'));
	}),

	/**
	 * Column definitions grouped into sets.
	 * @property {Object[][]} columngroups
	 */
	columngroups: collect('sortedColumns'),

	/**
	 * Allows row click actions to propagate.
	 * @property {Boolean} enableRowClick
	 * @optional
	 * @default false
	 */
	enableRowClick: defaultValue('config.enableRowClick', false),

	/**
	 * Rows can be expanded to show additional content.
	 * @property {Boolean} hasSubcontent
	 * @optional
	 * @default false
	 */
	hasSubcontent: defaultValue('config.hasSubcontent', false),

	/**
	 * Limit focus to editable cells only.
	 * @property {Boolean} onlyFocusEditable
	 * @optional
	 * @default false
	 */
	onlyFocusEditable: defaultValue('config.onlyFocusEditable', false),

	/**
	 * When the leftmost cell is focused and a `focusLeft` action is triggered,
	 *   focus the rightmost cell instead of firing an `outOfBounds` action,
	 *   and vice-versa.
	 * @property {Boolean} wrapFocusHorizontal
	 * @optional
	 * @default false
	 */
	wrapFocusHorizontal: defaultValue('config.wrapFocusHorizontal', false),

	/**
	 * When the topmost cell is focused and a `focusTop` action is triggered,
	 *   focus the bottommost cell instead of firing an `outOfBounds` action,
	 *   and vice-versa.
	 * @property {Boolean} wrapFocusVertical
	 * @optional
	 * @default false
	 */
	wrapFocusVertical: defaultValue('config.wrapFocusVertical', false),

	/**
	 * Text to display when the table is empty.
	 * @property {String} emptyText
	 * @optional
	 * @default "No records to display"
	 */
	emptyText: defaultValue('config.emptyText', 'No records to display'),

	/**
	 * Text to display when table data is loading.
	 * @property {String} loadingText
	 * @optional
	 * @default "Loading..."
	 */
	loadingText: defaultValue('config.loadingText', 'Loading\u2026'),

	/**
	 * Sync the horizontal scroll position of this table.
	 * @property {Number} scrollLeft
	 * @optional
	 * @default 0
	 */
	scrollLeft: defaultValue('config.scrollLeft', 0),

	/**
	 * Sync the vertical scroll position of this table.
	 * @property {Number} scrollTop
	 * @optional
	 * @default 0
	 */
	scrollTop: defaultValue('config.scrollTop', 0),

	/**
	 * Table view. Contains header and footer.
	 * @property {Ember.View} tableView
	 */
	tableView: computed({
		get: function () {
			var TableView = this.get('TableView');
			return this.createChildView(TableView, {
				root: this,
				columngroups: this.get('columngroups'),
				rows: this.get('sortedRows')
			});
		}
	}),

	/**
	 * Header container view.
	 * @property {Ember.View} headerView
	 */
	headerView: alias('tableView.headerView'),

	/**
	 * Show headers at the bottom of the table, too.
	 * @property {Boolean} dualHeaders
	 * @optional
	 * @default false
	 */
	dualHeaders: defaultValue('config.dualHeaders', false),

	/**
	 * Show header above body. Always true.
	 * @property {Boolean} showHeader
	 */
	showHeader: true,

	/**
	 * Show footer below body.
	 * @property {Boolean} showFooter
	 * @optional
	 * @default false
	 */
	showFooter: defaultValue('config.showFooter', false),

	/**
	 * Controller to use for calculating footer values.
	 * @property {Ember.Object} footerController
	 * @optional
	 */
	footerController: alias('config.footerController'),

	/**
	 * Footer view.
	 * @property {Ember.View} footerView
	 */
	footerView: alias('tableView.footerView'),

	/**
	 * Body container view.
	 * @property {Ember.View} bodyView
	 */
	bodyView: alias('tableView.bodyView.contentView'),

	/**
	 * Columngroup views in body container.
	 * @property {Ember.View} bodyColumngroupViews
	 */
	bodyColumngroupViews: alias('bodyView.columngroupViews'),

	/**
	 * Get an array of visible column views from all body columngroups.
	 * @method getBodyColumnViews
	 * @return {Ember.View[]} Array of column views
	 */
	getBodyColumnViews: function () {
		var columngroupViews = this.get('bodyColumngroupViews');
		var columns = Em.A();
		columngroupViews.forEach(function (view) {
			var columnViews = view.get('columnViews').filterBy('isVisible');
			columns.pushObjects(columnViews);
		});
		return columns;
	},

	/**
	 * Destroy created objects.
	 * @method willDestroy
	 */
	willDestroy: function () {
		this.get('sortedColumns').destroy();
		this.get('sortedRows').destroy();
		this.get('tableView').destroy();
		this._super();
	},

	/**
	 * Find the current scroll position of the table and synchronize with all
	 *   views watching this position.
	 * @method syncScroll
	 */
	syncScroll: function () {
		var table = this.get('tableView');
		var $table = Em.$(table.$());
		this.setProperties({
			scrollLeft: $table.scrollLeft(),
			scrollTop: $table.scrollTop()
		});
	},

	actions: {
		scrollX: function (pos) {
			this.set('scrollLeft', pos);
		},
		scrollY: function (pos) {
			this.set('scrollTop', pos);
		},
		syncScroll: function () {
			throttle(this, this.syncScroll, SCROLL_INTERVAL, SCROLL_IMMEDIATE);
		},
		sortBy: function (column) {
			var sortProperties = this.get('sortProperties');
			var sortProperty = Em.makeArray(sortProperties)[0];
			if (columnNamesMatch(column, sortProperty)) {
				column = toggleColumnDescending(sortProperty);
			}
			this.set('sortProperties', [column]);
		},
		stopHighlightingRows: function () {
			this.set('hoverRow', null);
		},
		highlightRow: function (row) {
			this.set('hoverRow', row);
		},
		tabKey: function () {
			this.send('focusRight');
		},
		reverseTabKey: function () {
			this.send('focusLeft');
		},
		enterKey: function () {
			this.send('focusDown');
		},
		reverseEnterKey: function () {
			this.send('focusUp');
		},
		cellClick: function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('cellClick');
			this.sendAction.apply(this, args);
		},
		rowClick: function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('rowClick');
			this.sendAction.apply(this, args);
		}
	}
});

/**
 * Matches sort definition. Has two groups: 1) column name, and 2) optional
 *   `:desc` indicating a descending order sort.
 * @private
 * @type RegExp
 */
var columnNameExp = /^(.*?)(\:desc)?$/;

/**
 * Determines if two column names are the same, ignoring any trailing `:desc`.
 * @private
 * @method columnNamesMatch
 * @param {String} left Column name, possibly ending in `:desc`.
 * @param {String} right Column name, possibly ending in `:desc`.
 * @return {Boolean} True if both column names are the same string.
 */
function columnNamesMatch (left, right) {
	var matchLeft = String(left || '').match(columnNameExp);
	var matchRight = String(right || '').match(columnNameExp);
	return matchLeft && matchRight && matchLeft[1] === matchRight[1];
}

/**
 * Returns a column name with or without a trailing `:desc`, depending on if it
 *   already has one. Toggles the descending state of that column.
 * @private
 * @method toggleColumnDescending
 * @param {String} column Column name, possibly ending in `:desc`
 * @return {String} New column name, possibly ending in `:desc`
 */
function toggleColumnDescending (column) {
	var columnMatch = String(column || '').match(columnNameExp);
	var columnName = columnMatch[1];
	var isDescending = columnMatch[2] !== undefined;
	return isDescending ? columnName : columnName + ':desc';
}

export default LlamaTable;
