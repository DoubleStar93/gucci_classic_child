{**
 * Classic Gucci — toolbar PLP (conteggio + ordinamento)
 *}
<div id="js-product-list-top" class="gucci-plp-toolbar">
  <div class="gucci-plp-toolbar-inner">
    <div class="gucci-plp-count hidden-sm-down">
      {if $listing.pagination.total_items > 1}
        <p>{$listing.pagination.total_items} {if $language.iso_code == 'it'}articoli{else}{l s='products' d='Shop.Theme.Catalog'}{/if}</p>
      {elseif $listing.pagination.total_items > 0}
        <p>{if $language.iso_code == 'it'}1 articolo{else}{l s='There is 1 product.' d='Shop.Theme.Catalog'}{/if}</p>
      {/if}
    </div>

    <div class="gucci-plp-actions">
      {block name='sort_by'}
        {include file='catalog/_partials/sort-orders.tpl' sort_orders=$listing.sort_orders}
      {/block}

      {if !empty($listing.rendered_facets)}
        <div class="gucci-plp-filter hidden-md-up">
          <button id="search_filter_toggler" class="gucci-plp-filter-btn btn-unstyle js-search-toggler" type="button">
            {if $language.iso_code == 'it'}Filtra{else}{l s='Filter' d='Shop.Theme.Actions'}{/if}
          </button>
        </div>
      {/if}
    </div>
  </div>

  <div class="gucci-plp-showing hidden-md-up">
    {l s='Showing %from%-%to% of %total% item(s)' d='Shop.Theme.Catalog' sprintf=[
      '%from%' => $listing.pagination.items_shown_from,
      '%to%' => $listing.pagination.items_shown_to,
      '%total%' => $listing.pagination.total_items
    ]}
  </div>
</div>
