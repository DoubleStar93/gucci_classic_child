{**
 * Classic Gucci — header categoria PLP
 *}
<div id="js-product-list-header" class="gucci-plp-header">
  {if $listing.pagination.items_shown_from == 1}
    {include file='catalog/_partials/gucci-plp-hero.tpl' category=$category}
  {else}
    <div class="gucci-plp-header-compact">
      {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$category.name scope='parent'}
      <h1 class="gucci-plp-title">{$gucciLabelOut|escape:'htmlall':'UTF-8'}</h1>
    </div>
  {/if}
</div>
