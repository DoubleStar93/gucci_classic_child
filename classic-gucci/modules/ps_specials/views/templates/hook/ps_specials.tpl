{**
 * Classic Gucci — offerte speciali
 *}
{if $products}
  {l s='On sale' d='Shop.Theme.Catalog' assign='gucciSectionTitle'}
  {l s='View all' d='Shop.Theme.Actions' assign='gucciSectionLinkLabel'}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='onsale'
    allProductsLink=$allSpecialProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
