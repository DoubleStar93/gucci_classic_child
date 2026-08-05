{**
 * Barbara Alvisi — prodotti della stessa categoria (PDP)
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiCategoryProductsTitle' value='Della stessa categoria'}
  {else}
    {assign var='barbaraalvisiCategoryProductsTitle' value='More from this category'}
  {/if}
  {if $products|@count > 8}
    {assign var='barbaraalvisiGridProducts' value=$products|array_slice:0:8}
  {else}
    {assign var='barbaraalvisiGridProducts' value=$products}
  {/if}
  <section class="barbaraalvisi-product-grid-section barbaraalvisi-pdp-category-products barbaraalvisi-pdp-related clearfix">
    <header class="barbaraalvisi-product-grid-section__header">
      <p class="barbaraalvisi-product-grid-section__title barbaraalvisi-pdp-category-products-title">
        {$barbaraalvisiCategoryProductsTitle}
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
