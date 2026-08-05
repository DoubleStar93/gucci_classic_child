{**
 * Barbara Alvisi — pagina 404 / listing vuoto / ricerca vuota
 *}
{extends file='parent:errors/not-found.tpl'}

{block name='page_content'}
  <div class="barbaraalvisi-not-found barbaraalvisi-page-content">
    {block name="error_content"}
      {if isset($category)}
        {if $language.iso_code == 'it'}
          {assign var='barbaraalvisiPlpEmptyTitle' value='Nessun articolo in questa categoria'}
          {assign var='barbaraalvisiPlpEmptyText' value='Resta in contatto: nuovi articoli verranno aggiunti a breve.'}
        {else}
          {assign var='barbaraalvisiPlpEmptyTitle' value='No products available yet'}
          {assign var='barbaraalvisiPlpEmptyText' value='Stay tuned! More products will be shown here as they are added.'}
        {/if}
        <div class="barbaraalvisi-error-hero barbaraalvisi-error-hero--listing">
          {include file='catalog/_partials/barbaraalvisi-plp-empty.tpl'}
        </div>
      {elseif isset($page) && $page.page_name == 'search'}
        {assign var='barbaraalvisiSearchQuery' value=$smarty.get.s|default:''|strip_tags}
        {if $language.iso_code == 'it'}
          {assign var='barbaraalvisiPlpEmptyTitle' value='Nessun risultato per la tua ricerca'}
          {assign var='barbaraalvisiPlpEmptyText' value='Prova con altre parole chiave.'}
        {else}
          {assign var='barbaraalvisiPlpEmptyTitle' value='No matches were found for your search'}
          {assign var='barbaraalvisiPlpEmptyText' value='Please try other keywords to describe what you are looking for.'}
        {/if}
        <div class="barbaraalvisi-error-hero barbaraalvisi-error-hero--listing">
          {include file='catalog/_partials/barbaraalvisi-plp-empty.tpl'}
        </div>
      {elseif isset($errorContent) && $errorContent|trim}
        <div class="barbaraalvisi-error-hero barbaraalvisi-error-hero--listing">
          {$errorContent nofilter}
        </div>
      {else}
        <div class="barbaraalvisi-error-hero">
          <p class="barbaraalvisi-error-eyebrow" aria-hidden="true">404</p>
          <h1 class="barbaraalvisi-error-title">
            {if $language.iso_code == 'it'}Pagina non trovata{else}{l s='This page could not be found' d='Shop.Theme.Global'}{/if}
          </h1>
          <p class="barbaraalvisi-error-text">
            {if $language.iso_code == 'it'}
              La pagina che cerchi non esiste o non è più disponibile. Torna alla home o cerca nel catalogo.
            {else}
              {l s='Try to search our catalog, you may find what you are looking for!' d='Shop.Theme.Global'}
            {/if}
          </p>
          <div class="barbaraalvisi-error-actions">
            <a href="{$urls.pages.index}" class="barbaraalvisi-btn barbaraalvisi-btn--primary">
              {if $language.iso_code == 'it'}Torna alla home{else}{l s='Back to Home' d='Shop.Theme.Global'}{/if}
            </a>
            <a href="{$urls.pages.contact}" class="barbaraalvisi-btn barbaraalvisi-btn--outline">
              {if $language.iso_code == 'it'}Contattaci{else}{l s='Contact us' d='Shop.Theme.Global'}{/if}
            </a>
          </div>
        </div>
      {/if}
    {/block}

    {block name='search'}
      {if isset($category) || (isset($page) && $page.page_name == 'search')}
      {else}
        <form class="barbaraalvisi-error-search" method="get" action="{$link->getPageLink('search', true)|escape:'html':'UTF-8'}">
          <input type="hidden" name="controller" value="search">
          <label class="barbaraalvisi-error-search__label" for="barbaraalvisi-error-search-input">
            {if $language.iso_code == 'it'}Cerca nel catalogo{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}
          </label>
          <div class="barbaraalvisi-error-search__row">
            <input
              id="barbaraalvisi-error-search-input"
              type="search"
              name="s"
              class="barbaraalvisi-search-input"
              placeholder="{if $language.iso_code == 'it'}Cosa stai cercando?{else}{l s='Search our catalog' d='Shop.Theme.Catalog'}{/if}"
              autocomplete="off"
            >
            <button type="submit" class="barbaraalvisi-btn barbaraalvisi-btn--outline">
              {if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Actions'}{/if}
            </button>
          </div>
        </form>
      {/if}
    {/block}
  </div>

  {block name='hook_not_found'}
    {if $language.iso_code == 'it'}
      {assign var='barbaraalvisiNotFoundSelectionTitle' value='Potrebbe interessarti'}
    {else}
      {assign var='barbaraalvisiNotFoundSelectionTitle' value='You may also like'}
    {/if}
    {include
      file='_partials/barbaraalvisi-featured-products-strip.tpl'
      wrapperClass='barbaraalvisi-not-found-products'
      hookName='displayNotFound'
      widgetHook='displayHome'
      sectionTitle=$barbaraalvisiNotFoundSelectionTitle
    }
  {/block}
{/block}
