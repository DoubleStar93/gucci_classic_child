{**
 * Classic Gucci — pagina 404
 *}
{extends file='parent:errors/not-found.tpl'}

{block name="error_content"}
  {if isset($category)}
    {if $language.iso_code == 'it'}
      {assign var='gucciPlpEmptyTitle' value='Nessun articolo in questa categoria'}
      {assign var='gucciPlpEmptyText' value='Resta in contatto: nuovi articoli verranno aggiunti a breve.'}
    {else}
      {assign var='gucciPlpEmptyTitle' value='No products available yet'}
      {assign var='gucciPlpEmptyText' value='Stay tuned! More products will be shown here as they are added.'}
    {/if}
    {include file='catalog/_partials/gucci-plp-empty.tpl'}
  {elseif isset($page) && $page.page_name == 'search'}
    {assign var='gucciSearchQuery' value=$smarty.get.s|default:''|strip_tags}
    {if $language.iso_code == 'it'}
      {assign var='gucciPlpEmptyTitle' value='Nessun risultato per la tua ricerca'}
      {assign var='gucciPlpEmptyText' value='Prova con altre parole chiave.'}
    {else}
      {assign var='gucciPlpEmptyTitle' value='No matches were found for your search'}
      {assign var='gucciPlpEmptyText' value='Please try other keywords to describe what you are looking for.'}
    {/if}
    {include file='catalog/_partials/gucci-plp-empty.tpl'}
  {elseif isset($errorContent) && $errorContent|trim}
    {$errorContent nofilter}
  {else}
  <h1 class="gucci-error-title">
    {if $language.iso_code == 'it'}Pagina non trovata{else}{l s='This page could not be found' d='Shop.Theme.Global'}{/if}
  </h1>
  <p class="gucci-error-text">
    {if $language.iso_code == 'it'}La pagina che cerchi non esiste o non è più disponibile.{else}{l s='Try to search our catalog, you may find what you are looking for!' d='Shop.Theme.Global'}{/if}
  </p>
  <p class="gucci-error-actions">
    <a href="{$urls.pages.index}" class="gucci-btn gucci-btn--primary">
      {if $language.iso_code == 'it'}Torna alla home{else}{l s='Back to Home' d='Shop.Theme.Global'}{/if}
    </a>
  </p>
  {/if}
{/block}

{block name='search'}
  {if isset($category) || (isset($page) && $page.page_name == 'search')}
  {else}
  <form class="gucci-error-search" method="get" action="{$link->getPageLink('search', true)|escape:'html':'UTF-8'}">
    <input type="hidden" name="controller" value="search">
    <label class="gucci-error-search__label" for="gucci-error-search-input">
      {if $language.iso_code == 'it'}Cerca nel catalogo{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}
    </label>
    <div class="gucci-error-search__row">
      <input
        id="gucci-error-search-input"
        type="search"
        name="s"
        class="gucci-search-input"
        placeholder="{if $language.iso_code == 'it'}Cosa stai cercando?{else}{l s='Search our catalog' d='Shop.Theme.Catalog'}{/if}"
        autocomplete="off"
      >
      <button type="submit" class="gucci-btn gucci-btn--outline">
        {if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Actions'}{/if}
      </button>
    </div>
  </form>
  {/if}
{/block}

{block name='hook_not_found'}
  {if $language.iso_code == 'it'}
    {assign var='gucciNotFoundSelectionTitle' value='Prodotti in vetrina'}
  {else}
    {assign var='gucciNotFoundSelectionTitle' value='Popular products'}
  {/if}
  {include
    file='_partials/gucci-featured-products-strip.tpl'
    wrapperClass='gucci-not-found-products'
    hookName='displayNotFound'
    widgetHook='displayHome'
    sectionTitle=$gucciNotFoundSelectionTitle
  }
{/block}
