{**
 * Classic Gucci — disabilitato su home (solo Selezione / ps_featuredproducts)
 *}
{if $products|count && (!isset($page.page_name) || $page.page_name != 'index')}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Più venduti'}
    {assign var='gucciSectionLinkLabel' value='Vedi tutto'}
  {else}
    {l s='Best sellers' d='Modules.Bestsellers.Shop' assign='gucciSectionTitle'}
    {l s='All best sellers' d='Modules.Bestsellers.Shop' assign='gucciSectionLinkLabel'}
  {/if}
  {include
    file='_partials/gucci-home-products-section.tpl'
    products=$products
    sectionTitle=$gucciSectionTitle
    sectionType='bestsellers'
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
