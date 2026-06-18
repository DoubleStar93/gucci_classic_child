{**
 * Classic Gucci — listing PLP vuoto (categoria / ricerca)
 * Fuori da .page-not-found per evitare scroll interno e griglia tagliata
 *}
{if isset($category)}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun articolo in questa categoria'}
    {assign var='gucciPlpEmptyText' value='Resta in contatto: nuovi articoli verranno aggiunti a breve.'}
  {else}
    {assign var='gucciPlpEmptyTitle' value='No products available yet'}
    {assign var='gucciPlpEmptyText' value='Stay tuned! More products will be shown here as they are added.'}
  {/if}
{elseif isset($page) && $page.page_name == 'search'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun risultato per la tua ricerca'}
    {assign var='gucciPlpEmptyText' value='Prova con altre parole chiave.'}
  {else}
    {assign var='gucciPlpEmptyTitle' value='No matches were found for your search'}
    {assign var='gucciPlpEmptyText' value='Please try other keywords to describe what you are looking for.'}
  {/if}
{elseif isset($page) && $page.page_name == 'best-sales'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun articolo più venduto al momento'}
    {assign var='gucciPlpEmptyText' value='Non appena ci saranno vendite, i capi più richiesti compariranno qui.'}
  {else}
    {assign var='gucciPlpEmptyTitle' value='No best sellers at the moment'}
    {assign var='gucciPlpEmptyText' value='Our most popular items will appear here as soon as orders are placed.'}
  {/if}
{elseif isset($page) && $page.page_name == 'new-products'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun nuovo arrivo al momento'}
    {assign var='gucciPlpEmptyText' value='Torna presto: stiamo preparando nuovi capi per te.'}
  {else}
    {assign var='gucciPlpEmptyTitle' value='No new products at the moment'}
    {assign var='gucciPlpEmptyText' value='Check back soon for new arrivals.'}
  {/if}
{elseif isset($page) && $page.page_name == 'prices-drop'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessuna offerta al momento'}
    {assign var='gucciPlpEmptyText' value='Le promozioni attive verranno mostrate qui.'}
  {else}
    {assign var='gucciPlpEmptyTitle' value='No special offers at the moment'}
    {assign var='gucciPlpEmptyText' value='Active promotions will be listed here.'}
  {/if}
{/if}

<div class="gucci-plp-empty-listing">
  {include file='catalog/_partials/gucci-plp-empty.tpl'}
</div>

{if isset($page) && ($page.page_name == 'search' || $page.page_name == 'best-sales' || $page.page_name == 'new-products' || $page.page_name == 'prices-drop')}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyFeaturedTitle' value='Prodotti in vetrina'}
  {else}
    {assign var='gucciPlpEmptyFeaturedTitle' value='Popular products'}
  {/if}
  {if $page.page_name == 'search'}
    {assign var='gucciPlpEmptyFeaturedClass' value='gucci-search-empty-products'}
    {assign var='gucciPlpEmptyFeaturedHook' value='displayNotFound'}
  {elseif $page.page_name == 'best-sales'}
    {assign var='gucciPlpEmptyFeaturedClass' value='gucci-best-sales-empty-products'}
    {assign var='gucciPlpEmptyFeaturedHook' value='displayNotFound'}
  {elseif $page.page_name == 'new-products'}
    {assign var='gucciPlpEmptyFeaturedClass' value='gucci-new-products-empty-products'}
    {assign var='gucciPlpEmptyFeaturedHook' value='displayNotFound'}
  {else}
    {assign var='gucciPlpEmptyFeaturedClass' value='gucci-prices-drop-empty-products'}
    {assign var='gucciPlpEmptyFeaturedHook' value='displayNotFound'}
  {/if}
  {include
    file='_partials/gucci-featured-products-strip.tpl'
    wrapperClass=$gucciPlpEmptyFeaturedClass
    hookName=$gucciPlpEmptyFeaturedHook
    widgetHook='displayHome'
    sectionTitle=$gucciPlpEmptyFeaturedTitle
  }
{/if}
