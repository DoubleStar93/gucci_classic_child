{**
 * Classic Gucci — solo griglia PLP (toolbar in product_list_top del listing)
 *}
<div class="products gucci-plp-grid">
  {foreach from=$listing.products item="product" key="position"}
    {include file='catalog/_partials/miniatures/product.tpl' product=$product position=$position productClasses=$productClass}
  {/foreach}
</div>
