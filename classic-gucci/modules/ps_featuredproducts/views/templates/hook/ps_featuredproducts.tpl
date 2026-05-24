{**
 * Classic Gucci — prodotti in vetrina
 *}
{if $products}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Selezione'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciSectionTitle'}
    {l s='View all' d='Shop.Theme.Actions' assign='gucciSectionLinkLabel'}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='popularproducts'
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
