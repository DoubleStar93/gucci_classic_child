{**
 * Classic Gucci — prodotti della stessa categoria (PDP)
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciCategoryProductsTitle' value='Della stessa categoria'}
  {else}
    {l s='More from this category' d='Shop.Theme.Catalog' assign='gucciCategoryProductsTitle'}
  {/if}
  {include
    file='_partials/gucci-product-grid-section.tpl'
    products=$products
    sectionTitle=$gucciCategoryProductsTitle
    sectionClass='gucci-pdp-category-products gucci-pdp-related'
    titleClass='gucci-pdp-category-products-title'
  }
{/if}
