{**
 * Classic Gucci — filtri attivi minimal
 *}
{extends file='parent:catalog/_partials/active_filters.tpl'}

{block name='active_filters_title'}
  <p class="gucci-plp-active-filters-title">
    {if $language.iso_code == 'it'}Filtri attivi{else}{l s='Active filters' d='Shop.Theme.Global'}{/if}
  </p>
{/block}
