{**
 * Classic Gucci — nuovi prodotti
 *}
{if $products}
  {l s='New products' d='Shop.Theme.Catalog' assign='gucciSectionTitle'}
  {l s='View all' d='Shop.Theme.Actions' assign='gucciSectionLinkLabel'}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='newproducts'
    allProductsLink=$allNewProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
