{**
 * Classic Gucci — più venduti (home: 4 prodotti)
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='I più venduti'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='Best sellers' d='Modules.Bestsellers.Shop' assign='gucciSectionTitle'}
    {l s='All best sellers' d='Modules.Bestsellers.Shop' assign='gucciSectionLinkLabel'}
  {/if}
  {assign var='gucciAllProductsLink' value=''}
  {if isset($allProductsLink) && $allProductsLink}
    {assign var='gucciAllProductsLink' value=$allProductsLink}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='bestsellers'
    maxProducts=4
    allProductsLink=$gucciAllProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
