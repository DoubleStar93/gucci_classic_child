{**
 * Classic Gucci — header categoria PLP
 *}
<div id="js-product-list-header" class="gucci-plp-header">
  {if $listing.pagination.items_shown_from == 1}
    <h1 class="gucci-plp-title">{$category.name}</h1>
    {if $category.description}
      <div class="gucci-plp-description" id="category-description">{$category.description nofilter}</div>
    {/if}
  {/if}
</div>
