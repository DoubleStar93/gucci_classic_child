{**
 * Classic Gucci — disabilitato su home (solo Selezione / ps_featuredproducts)
 *}
{if $products|count && (!isset($page.page_name) || $page.page_name != 'index')}
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
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
