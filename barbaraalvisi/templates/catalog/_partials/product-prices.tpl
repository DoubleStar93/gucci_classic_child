{**
 * Barbara Alvisi — prezzo minimalista
 *}
{if $product.show_price}
  <div class="product-prices barbaraalvisi-product-prices js-product-prices">
    {block name='product_price'}
      <div class="product-price {if $product.has_discount}has-discount{/if}">
        <span class="barbaraalvisi-price-current" content="{$product.rounded_display_price}">
          {capture name='custom_price'}{hook h='displayProductPriceBlock' product=$product type='custom_price' hook_origin='product_sheet'}{/capture}
          {if '' !== $smarty.capture.custom_price}
            {$smarty.capture.custom_price nofilter}
          {else}
            {$product.price}
          {/if}
        </span>
      </div>
    {/block}
    {hook h='displayProductPriceBlock' product=$product type="weight" hook_origin='product_sheet'}
  </div>
{/if}
