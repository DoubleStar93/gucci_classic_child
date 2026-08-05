{**
 * Barbara Alvisi — più venduti PLP
 *}
{extends file='catalog/listing/product-list.tpl'}

{block name='product_list_header'}
  <div id="js-product-list-header" class="barbaraalvisi-plp-header">
    <h1 class="barbaraalvisi-plp-title">
      {if $language.iso_code == 'it'}Più venduti{else}{l s='Best sellers' d='Shop.Theme.Catalog'}{/if}
    </h1>
    {if $listing.pagination.total_items > 0}
      <p class="barbaraalvisi-plp-header-count">
        {$listing.pagination.total_items}
        {if $language.iso_code == 'it'}
          {if $listing.pagination.total_items == 1}articolo{else}articoli{/if}
        {else}
          {if $listing.pagination.total_items == 1}{l s='product' d='Shop.Theme.Catalog'}{else}{l s='products' d='Shop.Theme.Catalog'}{/if}
        {/if}
      </p>
    {/if}
  </div>
{/block}
