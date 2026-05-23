{**
 * Classic Gucci — bottone aggiungi al carrello
 *}
<div class="product-add-to-cart js-product-add-to-cart gucci-product-add-to-cart">
  {if !$configuration.is_catalog}
    <span class="control-label">{l s='Quantity' d='Shop.Theme.Catalog'}</span>

    <div class="product-quantity">
      <div class="qty">
        <input
          type="number"
          name="qty"
          id="quantity_wanted"
          inputmode="numeric"
          pattern="[0-9]*"
          {if $product.quantity_wanted}
            value="{$product.quantity_wanted}"
            min="{$product.minimal_quantity}"
          {else}
            value="1"
            min="1"
          {/if}
          class="input-group"
          aria-label="{l s='Quantity' d='Shop.Theme.Actions'}"
        >
      </div>
    </div>

    <div class="add">
      <button
        class="btn btn-primary add-to-cart gucci-add-to-cart"
        data-button-action="add-to-cart"
        type="submit"
        {if !$product.add_to_cart_url}
          disabled
        {/if}
      >
        {if $language.iso_code == 'it'}Aggiungi al carrello{else}{l s='Add to cart' d='Shop.Theme.Actions'}{/if}
      </button>
    </div>
  {/if}
</div>
