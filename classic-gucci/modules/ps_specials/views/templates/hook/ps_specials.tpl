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
  {assign var='gucciAllProductsLink' value=''}
  {if isset($allProductsLink) && $allProductsLink}
    {assign var='gucciAllProductsLink' value=$allProductsLink}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='onsale'
    maxProducts=4
    allProductsLink=$gucciAllProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
