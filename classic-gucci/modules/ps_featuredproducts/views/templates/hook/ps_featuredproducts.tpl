{**
 * Classic Gucci — prodotti in vetrina
 *}
{if $products}
  {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciSectionTitle'}
  {l s='View all' d='Shop.Theme.Actions' assign='gucciSectionLinkLabel'}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='popularproducts'
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
