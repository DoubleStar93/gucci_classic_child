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
      placeholder="{l s='Search' d='Shop.Theme.Catalog'}"
      aria-label="{l s='Search' d='Shop.Theme.Catalog'}"
      class="gucci-search-input"
    >
    <button type="submit" class="gucci-search-submit btn-unstyle" aria-label="{l s='Search' d='Shop.Theme.Catalog'}">
      <i class="material-icons search" aria-hidden="true">search</i>
    </button>
  </form>
</div>
