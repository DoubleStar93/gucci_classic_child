{**
 * Barbara Alvisi — prodotti in vetrina
 *}
{if $products}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiSectionTitle' value='Prodotti in vetrina'}
  {else}
    {assign var='barbaraalvisiSectionTitle' value='Popular products'}
  {/if}
  <section class="featured-products barbaraalvisi-home-section barbaraalvisi-home-section--products clearfix" data-type="popularproducts">
    <header class="barbaraalvisi-home-section__header">
      <h2 class="barbaraalvisi-home-section__title products-section-title">{$barbaraalvisiSectionTitle}</h2>
    </header>
    <div class="products barbaraalvisi-plp-grid barbaraalvisi-product-grid" data-barbaraalvisi-product-grid>
      {foreach from=$products item="product" key="position"}
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
