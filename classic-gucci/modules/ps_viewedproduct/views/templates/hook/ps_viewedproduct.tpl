{**
 * Classic Gucci — prodotti visti (griglia come homepage)
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciViewedTitle' value='Visti di recente'}
  {else}
    {l s='Viewed products' d='Modules.Viewedproduct.Shop' assign='gucciViewedTitle'}
  {/if}
  {include
    file='_partials/gucci-product-grid-section.tpl'
    products=$products
    sectionTitle=$gucciViewedTitle
    sectionClass='gucci-pdp-viewed-products'
    titleClass='gucci-pdp-viewed-products-title'
  }
{/if}
