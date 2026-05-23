{**
 * Classic Gucci — listing prodotti
 *}
{extends file='parent:catalog/listing/product-list.tpl'}

{block name='product_list_header'}
  {if isset($category)}
    {include file='catalog/_partials/category-header.tpl' listing=$listing category=$category}
  {else}
    <div id="js-product-list-header" class="gucci-plp-header">
      <h1 class="gucci-plp-title">{$listing.label}</h1>
    </div>
  {/if}
{/block}

{block name='subcategory_list'}{/block}

{block name='product_list_top'}
  {$smarty.block.parent}
  {if !empty($listing.rendered_facets)}
    <div id="gucci-filters-backdrop" class="gucci-filters-backdrop" aria-hidden="true" hidden></div>
    <aside id="search_filters_wrapper" class="gucci-filters-drawer" aria-hidden="true">
      {$listing.rendered_facets nofilter}
    </aside>
  {/if}
{/block}

{block name='product_list_active_filters'}
  <div class="gucci-plp-active-filters">
    {$listing.rendered_active_filters nofilter}
  </div>
{/block}

{block name='product_list'}
  {include file='catalog/_partials/products.tpl' listing=$listing productClass='col-6 col-lg-4 gucci-product-miniature'}
{/block}
