{**
 * Classic Gucci — ordinamento PLP
 *}
<div class="products-sort-order dropdown">
  <button
    class="gucci-plp-sort-btn btn-unstyle select-title"
    rel="nofollow"
    data-toggle="dropdown"
    aria-haspopup="true"
    aria-expanded="false"
  >
    {if $language.iso_code == 'it'}Ordina{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}
    <i class="material-icons" aria-hidden="true">expand_more</i>
  </button>
  <div class="dropdown-menu">
    {foreach from=$sort_orders item=sort_order}
      {if $language.iso_code == 'it'}
        {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$sort_order.label scope='parent'}
        {assign var='gucciSortLabel' value=$gucciLabelOut}
      {else}
        {assign var='gucciSortLabel' value=$sort_order.label}
      {/if}
      <a
        rel="nofollow"
        href="{$sort_order.url}"
        class="select-list {if $sort_order.current}current{/if}"
      >
        {$gucciSortLabel|escape:'htmlall':'UTF-8'}
      </a>
    {/foreach}
  </div>
</div>
