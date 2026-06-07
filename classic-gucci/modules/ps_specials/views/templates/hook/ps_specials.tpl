{**
 * Classic Gucci — offerte speciali in homepage
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Offerte'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='On sale' d='Modules.Specials.Shop' assign='gucciSectionTitle'}
    {l s='All sale products' d='Modules.Specials.Shop' assign='gucciSectionLinkLabel'}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='onsale'
    maxProducts=4
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
