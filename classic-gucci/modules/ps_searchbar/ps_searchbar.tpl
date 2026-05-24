{**
 * Classic Gucci — ricerca solo icona (stile gucci.com)
 *}
<div id="search_widget" class="gucci-search search-widget" data-search-controller-url="{$search_controller_url}">
  <form method="get" action="{$search_controller_url}" class="gucci-search-form">
    <input type="hidden" name="controller" value="search">
    <input
      type="text"
      name="s"
      value="{$search_string}"
      placeholder="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}"
      aria-label="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}"
      class="gucci-search-input"
    >
    <button type="submit" class="gucci-search-submit btn-unstyle" aria-label="{if $language.iso_code == 'it'}Cerca{else}{l s='Search' d='Shop.Theme.Catalog'}{/if}">
      <i class="material-icons search" aria-hidden="true">search</i>
    </button>
  </form>
</div>
