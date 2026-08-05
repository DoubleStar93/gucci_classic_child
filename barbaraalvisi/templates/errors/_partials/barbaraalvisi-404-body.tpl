{**
 * Barbara Alvisi — corpo pagina 404 (senza wrapper .page-not-found Classic)
 *}
<div class="barbaraalvisi-404-page">
  <div class="barbaraalvisi-404-page__hero barbaraalvisi-page-content">
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
  </div>

  {if $language.iso_code == 'it'}
    {assign var='barbaraalvisi404ProductsTitle' value='Potrebbe interessarti'}
  {else}
    {assign var='barbaraalvisi404ProductsTitle' value='You may also like'}
  {/if}
  {include
    file='_partials/barbaraalvisi-featured-products-strip.tpl'
    wrapperClass='barbaraalvisi-404-products'
    hookName='displayNotFound'
    widgetHook='displayHome'
    sectionTitle=$barbaraalvisi404ProductsTitle
  }
</div>
