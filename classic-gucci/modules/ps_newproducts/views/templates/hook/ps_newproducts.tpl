{**
 * Classic Gucci — disabilitato su home (solo Selezione / ps_featuredproducts)
 * Se il modulo è agganciato altrove, usa gucci-home-products-section nel child.
 *}
{if $products|count && (!isset($page.page_name) || $page.page_name != 'index')}
  {if $language.iso_code == 'it'}
    {assign var='gucciSectionTitle' value='Novità'}
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
    allProductsLink=$allProductsLink
    allProductsLabel=$gucciSectionLinkLabel
  }
{/if}
