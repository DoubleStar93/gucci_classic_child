{**
 * Classic Gucci — header categoria PLP
 *}
<div id="js-product-list-header" class="gucci-plp-header">
  {if $listing.pagination.items_shown_from == 1}
    {include file='_partials/gucci-it-label.tpl' gucciLabelIn=$category.name scope='parent'}
    <h1 class="gucci-plp-title">{$gucciLabelOut|escape:'htmlall':'UTF-8'}</h1>
    {if $listing.pagination.total_items > 0}
      <p class="gucci-plp-header-count">
        {$listing.pagination.total_items}
        {if $language.iso_code == 'it'}
          {if $listing.pagination.total_items == 1}articolo{else}articoli{/if}
        {else}
          {if $listing.pagination.total_items == 1}{l s='product' d='Shop.Theme.Catalog'}{else}{l s='products' d='Shop.Theme.Catalog'}{/if}
        {/if}
      </p>
    {/if}
  {/if}
</div>
