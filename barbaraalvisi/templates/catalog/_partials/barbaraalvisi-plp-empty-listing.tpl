{**
 * Barbara Alvisi — listing PLP vuoto (categoria / ricerca)
 * Fuori da .page-not-found per evitare scroll interno e griglia tagliata
 *}
{if isset($category)}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiPlpEmptyTitle' value='Nessun articolo in questa categoria'}
    {assign var='barbaraalvisiPlpEmptyText' value='Resta in contatto: nuovi articoli verranno aggiunti a breve.'}
  {else}
    {assign var='barbaraalvisiPlpEmptyTitle' value='No products available yet'}
    {assign var='barbaraalvisiPlpEmptyText' value='Stay tuned! More products will be shown here as they are added.'}
  {/if}
{elseif isset($page) && $page.page_name == 'search'}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiPlpEmptyTitle' value='Nessun risultato per la tua ricerca'}
    {assign var='barbaraalvisiPlpEmptyText' value='Prova con altre parole chiave.'}
  {else}
    {assign var='barbaraalvisiPlpEmptyTitle' value='No matches were found for your search'}
    {assign var='barbaraalvisiPlpEmptyText' value='Please try other keywords to describe what you are looking for.'}
  {/if}
{elseif isset($page) && $page.page_name == 'best-sales'}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiPlpEmptyTitle' value='Nessun articolo più venduto al momento'}
    {assign var='barbaraalvisiPlpEmptyText' value='Non appena ci saranno vendite, i capi più richiesti compariranno qui.'}
  {else}
    {assign var='barbaraalvisiPlpEmptyTitle' value='No best sellers at the moment'}
    {assign var='barbaraalvisiPlpEmptyText' value='Our most popular items will appear here as soon as orders are placed.'}
  {/if}
{elseif isset($page) && $page.page_name == 'new-products'}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiPlpEmptyTitle' value='Nessun nuovo arrivo al momento'}
    {assign var='barbaraalvisiPlpEmptyText' value='Torna presto: stiamo preparando nuovi capi per te.'}
  {else}
    {assign var='barbaraalvisiPlpEmptyTitle' value='No new products at the moment'}
    {assign var='barbaraalvisiPlpEmptyText' value='Check back soon for new arrivals.'}
  {/if}
{elseif isset($page) && $page.page_name == 'prices-drop'}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiPlpEmptyTitle' value='Nessuna offerta al momento'}
    {assign var='barbaraalvisiPlpEmptyText' value='Le promozioni attive verranno mostrate qui.'}
  {else}
    {assign var='barbaraalvisiPlpEmptyTitle' value='No special offers at the moment'}
    {assign var='barbaraalvisiPlpEmptyText' value='Active promotions will be listed here.'}
  {/if}
{/if}

<div class="barbaraalvisi-plp-empty-listing">
  {include file='catalog/_partials/barbaraalvisi-plp-empty.tpl'}
</div>

{if isset($page) && ($page.page_name == 'search' || $page.page_name == 'best-sales' || $page.page_name == 'new-products' || $page.page_name == 'prices-drop')}
  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisiPlpEmptyFeaturedTitle' value='Prodotti in vetrina'}
  {else}
    {assign var='barbaraalvisiPlpEmptyFeaturedTitle' value='Popular products'}
  {/if}
  {if $page.page_name == 'search'}
    {assign var='barbaraalvisiPlpEmptyFeaturedClass' value='barbaraalvisi-search-empty-products'}
    {assign var='barbaraalvisiPlpEmptyFeaturedHook' value='displayNotFound'}
  {elseif $page.page_name == 'best-sales'}
    {assign var='barbaraalvisiPlpEmptyFeaturedClass' value='barbaraalvisi-best-sales-empty-products'}
    {assign var='barbaraalvisiPlpEmptyFeaturedHook' value='displayNotFound'}
  {elseif $page.page_name == 'new-products'}
    {assign var='barbaraalvisiPlpEmptyFeaturedClass' value='barbaraalvisi-new-products-empty-products'}
    {assign var='barbaraalvisiPlpEmptyFeaturedHook' value='displayNotFound'}
  {else}
    {assign var='barbaraalvisiPlpEmptyFeaturedClass' value='barbaraalvisi-prices-drop-empty-products'}
    {assign var='barbaraalvisiPlpEmptyFeaturedHook' value='displayNotFound'}
  {/if}
  {include
    file='_partials/barbaraalvisi-featured-products-strip.tpl'
    wrapperClass=$barbaraalvisiPlpEmptyFeaturedClass
    hookName=$barbaraalvisiPlpEmptyFeaturedHook
    widgetHook='displayHome'
    sectionTitle=$barbaraalvisiPlpEmptyFeaturedTitle
  }
{/if}
