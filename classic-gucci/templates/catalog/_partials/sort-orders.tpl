{**
 * Classic Gucci — trigger ordinamento PLP (drawer destro)
 *}
<button
  id="gucci-sort-toggler"
  class="gucci-plp-action-btn btn-unstyle"
  type="button"
  data-gucci-sort-open
  aria-expanded="false"
  aria-controls="gucci-sort-drawer"
>
  {if $language.iso_code == 'it'}Ordina{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}
</button>
