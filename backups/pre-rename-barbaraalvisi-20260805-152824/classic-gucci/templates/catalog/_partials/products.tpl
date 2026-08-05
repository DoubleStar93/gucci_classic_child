{**
 * Classic Gucci — listing prodotti (griglia homepage + paginazione)
 * Wrapper #js-product-list richiesto per AJAX filtri/ordinamento
 *}
<div id="js-product-list" class="gucci-plp-list">
  {include
    file='catalog/_partials/productlist.tpl'
    products=$listing.products
    productClass=$productClass|default:'gucci-plp-cell gucci-product-miniature'
  }

  {block name='pagination'}
    {include file='_partials/pagination.tpl' pagination=$listing.pagination}
  {/block}

  <div id="js-product-list-bottom" class="gucci-plp-list-bottom"></div>
</div>
