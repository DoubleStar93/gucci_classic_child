{**
 * Classic Gucci — toolbar PLP (Filtra + conteggio + Ordina)
 *}
<div id="js-product-list-top" class="gucci-plp-toolbar">
  <div class="gucci-plp-toolbar-inner">
    <div class="gucci-plp-actions">
      {if !empty($listing.rendered_facets)}
        <div class="gucci-plp-filter">
          <button id="search_filter_toggler" class="gucci-plp-filter-btn btn-unstyle js-search-toggler" type="button">
            {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
          </button>
        </div>
      {/if}

      <p class="gucci-plp-toolbar-meta">
        {if $language.iso_code == 'it'}
          {$listing.pagination.items_shown_from}–{$listing.pagination.items_shown_to} di {$listing.pagination.total_items}
          {if $listing.pagination.total_items == 1} articolo{else} articoli{/if}
        {else}
          {l s='Showing %from%-%to% of %total% item(s)' d='Shop.Theme.Catalog' sprintf=[
            '%from%' => $listing.pagination.items_shown_from,
            '%to%' => $listing.pagination.items_shown_to,
            '%total%' => $listing.pagination.total_items
          ]}
        {/if}
      </p>

      {block name='sort_by'}
        <div class="gucci-plp-sort">
          {include file='catalog/_partials/sort-orders.tpl' sort_orders=$listing.sort_orders}
        </div>
      {/block}
    </div>
  </div>
</div>
