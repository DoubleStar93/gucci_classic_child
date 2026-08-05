{**
 * Barbara Alvisi — filtri PLP stile drawer
 *}
{extends file='parent:catalog/_partials/facets.tpl'}

{block name='facets_title'}
  <p class="barbaraalvisi-facets-title">
    {if $language.iso_code == 'it'}Filtra per{else}{l s='Filter By' d='Shop.Theme.Actions'}{/if}
  </p>
{/block}

{block name='facets_clearall_button'}
  {if $activeFilters|count}
    <div class="barbaraalvisi-facets-clear">
      <button data-search-url="{$clear_all_link}" class="barbaraalvisi-facets-clear-btn btn-unstyle js-search-filters-clear-all">
        {if $language.iso_code == 'it'}Cancella tutto{else}{l s='Clear all' d='Shop.Theme.Actions'}{/if}
      </button>
    </div>
  {/if}
{/block}
