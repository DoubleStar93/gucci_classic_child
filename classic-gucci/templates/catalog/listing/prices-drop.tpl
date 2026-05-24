{**
 * Classic Gucci — offerte / prezzi ribassati PLP
 *}
{extends file='catalog/listing/product-list.tpl'}

{block name='product_list_header'}
  <div id="js-product-list-header" class="gucci-plp-header">
    <h1 class="gucci-plp-title">
      {if $language.iso_code == 'it'}Offerte{else}{l s='Prices drop' d='Shop.Theme.Catalog'}{/if}
    </h1>
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
  </div>
{/block}
