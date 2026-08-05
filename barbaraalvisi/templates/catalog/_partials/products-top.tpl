{**
 * Barbara Alvisi — toolbar PLP (Filtra + conteggio + Ordina)
 *}
<div id="js-product-list-top" class="barbaraalvisi-plp-toolbar">
  <div class="barbaraalvisi-plp-toolbar-inner">
    <div class="barbaraalvisi-plp-actions">
      {if !empty($listing.rendered_facets)}
        <div class="barbaraalvisi-plp-filter">
          <button
            id="search_filter_toggler"
            class="barbaraalvisi-plp-action-btn btn-unstyle"
            type="button"
            data-barbaraalvisi-filters-open
            aria-expanded="false"
            aria-controls="barbaraalvisi-filters-drawer"
          >
            {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
          </button>
        </div>
      {/if}

      {block name='sort_by'}
        <div class="barbaraalvisi-plp-sort">
          {include file='catalog/_partials/sort-orders.tpl' sort_orders=$listing.sort_orders}
        </div>
      {/block}
    </div>
  </div>
</div>
