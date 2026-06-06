{**
 * Classic Gucci — listing PLP vuoto (categoria / ricerca)
 * Fuori da .page-not-found per evitare scroll interno e griglia tagliata
 *}
{if isset($category)}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun articolo in questa categoria'}
    {assign var='gucciPlpEmptyText' value='Resta in contatto: nuovi articoli verranno aggiunti a breve.'}
  {else}
    {l s='No products available yet' d='Shop.Theme.Catalog' assign='gucciPlpEmptyTitle'}
    {l s='Stay tuned! More products will be shown here as they are added.' d='Shop.Theme.Catalog' assign='gucciPlpEmptyText'}
  {/if}
{elseif isset($page) && $page.page_name == 'search'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun risultato per la tua ricerca'}
    {assign var='gucciPlpEmptyText' value='Prova con altre parole chiave.'}
  {else}
    {l s='No matches were found for your search' d='Shop.Theme.Catalog' assign='gucciPlpEmptyTitle'}
    {l s='Please try other keywords to describe what you are looking for.' d='Shop.Theme.Catalog' assign='gucciPlpEmptyText'}
  {/if}
{/if}

<div class="gucci-plp-empty-listing">
  {include file='catalog/_partials/gucci-plp-empty.tpl'}
</div>

{if isset($page) && $page.page_name == 'search'}
  {if $language.iso_code == 'it'}
    {assign var='gucciSearchEmptyTitle' value='Selezione'}
  {else}
    {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciSearchEmptyTitle'}
  {/if}
  {include
    file='_partials/gucci-featured-products-strip.tpl'
    wrapperClass='gucci-search-empty-products'
    hookName='displayNotFound'
    widgetHook='displayHome'
    sectionTitle=$gucciSearchEmptyTitle
  }
{/if}
