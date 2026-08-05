{**
 * Classic Gucci — prodotti in vetrina
 *}
{if $products}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Prodotti in vetrina'}
  {else}
    {assign var='gucciSectionTitle' value='Popular products'}
  {/if}
  <section class="featured-products gucci-home-section gucci-home-section--products clearfix" data-type="popularproducts">
    <header class="gucci-home-section__header">
      <h2 class="gucci-home-section__title products-section-title">{$gucciSectionTitle}</h2>
    </header>
    <div class="products gucci-plp-grid gucci-product-grid" data-gucci-product-grid>
      {foreach from=$products item="product" key="position"}
        {include
          file='catalog/_partials/miniatures/product.tpl'
          product=$product
          position=$position
          productClasses='gucci-plp-cell gucci-product-miniature'
          scope='parent'
        }
      {/foreach}
    </div>
  </section>
{/if}
