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
{elseif isset($page) && $page.page_name == 'best-sales'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun articolo più venduto al momento'}
    {assign var='gucciPlpEmptyText' value='Non appena ci saranno vendite, i capi più richiesti compariranno qui.'}
  {else}
    {l s='No best sellers at the moment' d='Shop.Theme.Catalog' assign='gucciPlpEmptyTitle'}
    {l s='Our most popular items will appear here as soon as orders are placed.' d='Shop.Theme.Catalog' assign='gucciPlpEmptyText'}
  {/if}
{elseif isset($page) && $page.page_name == 'new-products'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessun nuovo arrivo al momento'}
    {assign var='gucciPlpEmptyText' value='Torna presto: stiamo preparando nuovi capi per te.'}
  {else}
    {l s='No new products at the moment' d='Shop.Theme.Catalog' assign='gucciPlpEmptyTitle'}
    {l s='Check back soon for new arrivals.' d='Shop.Theme.Catalog' assign='gucciPlpEmptyText'}
  {/if}
{elseif isset($page) && $page.page_name == 'prices-drop'}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyTitle' value='Nessuna offerta al momento'}
    {assign var='gucciPlpEmptyText' value='Le promozioni attive verranno mostrate qui.'}
  {else}
    {l s='No special offers at the moment' d='Shop.Theme.Catalog' assign='gucciPlpEmptyTitle'}
    {l s='Active promotions will be listed here.' d='Shop.Theme.Catalog' assign='gucciPlpEmptyText'}
  {/if}
{/if}

<div class="gucci-plp-empty-listing">
  {include file='catalog/_partials/gucci-plp-empty.tpl'}
</div>

{if isset($page) && ($page.page_name == 'search' || $page.page_name == 'best-sales' || $page.page_name == 'new-products' || $page.page_name == 'prices-drop')}
  {if $language.iso_code == 'it'}
    {assign var='gucciPlpEmptyFeaturedTitle' value='Prodotti in vetrina'}
  {else}
    {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciPlpEmptyFeaturedTitle'}
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
