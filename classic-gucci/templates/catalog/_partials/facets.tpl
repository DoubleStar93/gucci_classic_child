{**
 * Classic Gucci — filtri PLP stile drawer
 *}
{extends file='parent:catalog/_partials/facets.tpl'}

{block name='facets_title'}
  <p class="gucci-facets-title">
    {if $language.iso_code == 'it'}Filtra per{else}{l s='Filter By' d='Shop.Theme.Actions'}{/if}
  </p>
{/block}

{block name='facets_clearall_button'}
  {if $activeFilters|count}
    <div class="gucci-facets-clear">
      <button data-search-url="{$clear_all_link}" class="gucci-facets-clear-btn btn-unstyle js-search-filters-clear-all">
        {if $language.iso_code == 'it'}Cancella tutto{else}{l s='Clear all' d='Shop.Theme.Actions'}{/if}
      </button>
    </div>
  {/if}
{/block}
