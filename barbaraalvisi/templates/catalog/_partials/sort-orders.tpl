{**
 * Barbara Alvisi — trigger ordinamento PLP (drawer destro)
 *}
<button
  id="barbaraalvisi-sort-toggler"
  class="barbaraalvisi-plp-action-btn btn-unstyle"
  type="button"
  data-barbaraalvisi-sort-open
  aria-expanded="false"
  aria-controls="barbaraalvisi-sort-drawer"
>
  {if $language.iso_code == 'it'}Ordina{else}{l s='Sort by' d='Shop.Theme.Global'}{/if}
</button>
