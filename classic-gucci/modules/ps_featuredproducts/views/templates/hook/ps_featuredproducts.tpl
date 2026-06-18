{**
 * Classic Gucci — prodotti in vetrina
 *}
{if $products}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Prodotti in vetrina'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {assign var='gucciSectionTitle' value='Popular products'}
    {assign var='gucciSectionLinkLabel' value='View all'}
  {/if}
  {assign var='gucciAllProductsLink' value=''}
  {if isset($allProductsLink) && $allProductsLink}
    {assign var='gucciAllProductsLink' value=$allProductsLink}
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
    {if !empty($gucciAllProductsLink) && !empty($gucciSectionLinkLabel)}
      <p class="gucci-home-section__footer">
        <a class="gucci-home-section__link all-product-link" href="{$gucciAllProductsLink|escape:'htmlall':'UTF-8'}">
          {$gucciSectionLinkLabel}
        </a>
      </p>
    {/if}
  </section>
{/if}
