{**
 * Classic Gucci — cross-selling PDP (griglia come homepage)
 *}
{if $products|count}
  {if $language.iso_code == 'it'}
    {assign var='gucciCrossSellingTitle' value='Chi ha acquistato questo prodotto ha comprato anche'}
  {else}
    {l s='Customers who bought this product also bought:' d='Modules.Crossselling.Shop' assign='gucciCrossSellingTitle'}
  {/if}
  {include
    file='_partials/gucci-product-grid-section.tpl'
    products=$products
    sectionTitle=$gucciCrossSellingTitle
    sectionClass='gucci-pdp-cross-selling'
    titleClass='gucci-pdp-cross-selling-title'
  }
{/if}
