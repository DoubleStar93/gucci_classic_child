{**
 * Barbara Alvisi — prodotti visti (PDP)
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiViewedTitle' value='Visti di recente'}
  {else}
    {assign var='barbaraalvisiViewedTitle' value='Viewed products'}
  {/if}
  {if $products|@count > 8}
    {assign var='barbaraalvisiGridProducts' value=$products|array_slice:0:8}
  {else}
    {assign var='barbaraalvisiGridProducts' value=$products}
  {/if}
  <section class="barbaraalvisi-product-grid-section barbaraalvisi-pdp-viewed-products clearfix">
    <header class="barbaraalvisi-product-grid-section__header">
      <p class="barbaraalvisi-product-grid-section__title barbaraalvisi-pdp-viewed-products-title">
        {$barbaraalvisiViewedTitle}
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
