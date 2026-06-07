{**
 * Classic Gucci — nuovi prodotti in homepage
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Nuovi arrivi'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='New products' d='Modules.Newproducts.Shop' assign='gucciSectionTitle'}
    {l s='All new products' d='Modules.Newproducts.Shop' assign='gucciSectionLinkLabel'}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='newproducts'
    maxProducts=4
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
