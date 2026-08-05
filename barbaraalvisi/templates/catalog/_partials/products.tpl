{**
 * Barbara Alvisi — listing prodotti (griglia homepage + paginazione)
 * Wrapper #js-product-list richiesto per AJAX filtri/ordinamento
 *}
<div id="js-product-list" class="barbaraalvisi-plp-list">
  {include
    file='catalog/_partials/productlist.tpl'
    products=$listing.products
    productClass=$productClass|default:'barbaraalvisi-plp-cell barbaraalvisi-product-miniature'
  }

  {block name='pagination'}
    {include file='_partials/pagination.tpl' pagination=$listing.pagination}
  {/block}

  <div id="js-product-list-bottom" class="barbaraalvisi-plp-list-bottom"></div>
</div>
