{**
 * Classic Gucci — prodotti in vetrina
 *}
{if $products}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Prodotti in vetrina'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciSectionTitle'}
    {l s='View all' d='Shop.Theme.Actions' assign='gucciSectionLinkLabel'}
  {/if}
  {assign var='gucciAllProductsLink' value=''}
  {if isset($allProductsLink) && $allProductsLink}
    {assign var='gucciAllProductsLink' value=$allProductsLink}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='popularproducts'
    allProductsLink=$gucciAllProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
