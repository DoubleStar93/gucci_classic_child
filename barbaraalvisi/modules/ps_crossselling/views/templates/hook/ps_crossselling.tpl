{**
 * Barbara Alvisi — cross-selling PDP
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiCrossSellingTitle' value='Chi ha acquistato questo prodotto ha comprato anche'}
  {else}
    {assign var='barbaraalvisiCrossSellingTitle' value='Customers who bought this product also bought:'}
  {/if}
  {if $products|@count > 8}
    {assign var='barbaraalvisiGridProducts' value=$products|array_slice:0:8}
  {else}
    {assign var='barbaraalvisiGridProducts' value=$products}
  {/if}
  <section class="barbaraalvisi-product-grid-section barbaraalvisi-pdp-cross-selling clearfix">
    <header class="barbaraalvisi-product-grid-section__header">
      <p class="barbaraalvisi-product-grid-section__title barbaraalvisi-pdp-cross-selling-title">
        {$barbaraalvisiCrossSellingTitle}
      </p>
    </header>
    <div class="products barbaraalvisi-plp-grid barbaraalvisi-product-grid" data-barbaraalvisi-product-grid>
      {foreach from=$barbaraalvisiGridProducts item="product" key="position"}
        {include
          file='catalog/_partials/miniatures/product.tpl'
          product=$product
          position=$position
          productClasses='barbaraalvisi-plp-cell barbaraalvisi-product-miniature'
          scope='parent'
        }
      {/foreach}
    </div>
  </section>
{/if}
