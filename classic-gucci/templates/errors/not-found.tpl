{**
 * Classic Gucci — pagina 404
 *}
{extends file='parent:errors/not-found.tpl'}

{block name="error_content"}
  {if isset($errorContent) && $errorContent|trim}
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
{/block}

{block name='hook_not_found'}
  {if $language.iso_code == 'it'}
    {assign var='gucciNotFoundSelectionTitle' value='Selezione'}
  {else}
    {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciNotFoundSelectionTitle'}
  {/if}
  {include
    file='_partials/gucci-featured-products-strip.tpl'
    wrapperClass='gucci-not-found-products'
    hookName='displayNotFound'
    widgetHook='displayHome'
    sectionTitle=$gucciNotFoundSelectionTitle
  }
{/block}
