import Em from 'ember';
import LlamaTable from 'llama-table/components/llama-table-main';
import LlamaHeader from 'llama-table/components/llama-header';
import LlamaHeaderColumngroup from 'llama-table/components/llama-header-columngroup';
import LlamaHeaderColumn from 'llama-table/components/llama-header-column';
import LlamaHeaderCell from 'llama-table/components/llama-header-cell';
import LlamaContent from 'llama-table/components/llama-content';
import LlamaSubcontent from 'llama-table/components/llama-subcontent';
import LlamaEmpty from 'llama-table/components/llama-empty';
import LlamaLoading from 'llama-table/components/llama-loading';
import LlamaBody from 'llama-table/components/llama-body';
import LlamaBodyColumngroup from 'llama-table/components/llama-body-columngroup';
import LlamaBodyColumn from 'llama-table/components/llama-body-column';
import LlamaBodyCell from 'llama-table/components/llama-body-cell';
import LlamaNumberCell from 'llama-table/components/llama-number-cell';
import LlamaEmbed from 'llama-table/components/llama-embed';
import LlamaFooter from 'llama-table/components/llama-footer';
import LlamaFooterColumngroup from 'llama-table/components/llama-footer-columngroup';
import LlamaFooterColumn from 'llama-table/components/llama-footer-column';
import { defaultValue } from 'llama-table/computed';

/**
 * Defines each view used by the component. All views can be overridden.
 * @module mixins
 * @constructor
 * @class ViewConstructorsMixin
 * @extends Ember.Mixin
 */
var ViewConstructorsMixin = Em.Mixin.create({
	TableView: defaultValue('config.TableView', LlamaTable),
	HeaderView: defaultValue('config.HeaderView', LlamaHeader),
	HeaderColumngroupView: defaultValue('config.HeaderColumngroupView', LlamaHeaderColumngroup),
	HeaderColumnView: defaultValue('config.HeaderColumnView', LlamaHeaderColumn),
	HeaderCellView: defaultValue('config.HeaderCellView', LlamaHeaderCell),
	ContentView: defaultValue('config.ContentView', LlamaContent),
	SubcontentView: defaultValue('config.SubcontentView', LlamaSubcontent),
	EmptyView: defaultValue('config.EmptyView', LlamaEmpty),
	LoadingView: defaultValue('config.LoadingView', LlamaLoading),
	BodyView: defaultValue('config.BodyView', LlamaBody),
	BodyColumngroupView: defaultValue('config.BodyColumngroupView', LlamaBodyColumngroup),
	BodyColumnView: defaultValue('config.BodyColumnView', LlamaBodyColumn),
	BodyCellView: defaultValue('config.BodyCellView', LlamaBodyCell),
	NumberCellView: defaultValue('config.NumberCellView', LlamaNumberCell),
	EmbedView: defaultValue('config.EmbedView', LlamaEmbed),
	FooterView: defaultValue('config.FooterView', LlamaFooter),
	FooterColumngroupView: defaultValue('config.FooterColumngroupView', LlamaFooterColumngroup),
	FooterColumnView: defaultValue('config.FooterColumnView', LlamaFooterColumn)
});

export default ViewConstructorsMixin;
