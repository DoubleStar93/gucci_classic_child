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

{block name='product_list'}
  {include file='catalog/_partials/products.tpl' listing=$listing productClass='col-6 col-md-4 col-lg-3 gucci-product-miniature'}
{/block}
