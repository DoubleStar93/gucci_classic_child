{**
 * Classic Gucci — toolbar PLP (Filtra + conteggio + Ordina)
 *}
<div id="js-product-list-top" class="gucci-plp-toolbar">
  <div class="gucci-plp-toolbar-inner">
    <div class="gucci-plp-actions">
      {if !empty($listing.rendered_facets)}
        <div class="gucci-plp-filter">
          <button
            id="search_filter_toggler"
            class="gucci-plp-action-btn btn-unstyle"
            type="button"
            data-gucci-filters-open
            aria-expanded="false"
            aria-controls="gucci-filters-drawer"
          >
            {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
          </button>
        </div>
      {/if}

      {block name='sort_by'}
        <div class="gucci-plp-sort">
          {include file='catalog/_partials/sort-orders.tpl' sort_orders=$listing.sort_orders}
        </div>
      {/block}
    </div>
  </div>
</div>
