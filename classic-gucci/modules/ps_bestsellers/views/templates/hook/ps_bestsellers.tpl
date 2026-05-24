{**
 * Classic Gucci — più venduti
 *}
{if $products}
  {l s='Best Sellers' d='Shop.Theme.Catalog' assign='gucciSectionTitle'}
  {l s='View all' d='Shop.Theme.Actions' assign='gucciSectionLinkLabel'}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='bestsellers'
    allProductsLink=$allBestSellers
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
