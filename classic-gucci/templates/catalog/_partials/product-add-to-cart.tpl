{**
 * Classic Gucci — bottone aggiungi al carrello + disponibilità
 *}
<div class="product-add-to-cart js-product-add-to-cart gucci-product-add-to-cart">
  {if !$configuration.is_catalog}
    <span class="control-label">{if $language.iso_code == 'it'}Quantità{else}{l s='Quantity' d='Shop.Theme.Catalog'}{/if}</span>

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
          aria-label="{if $language.iso_code == 'it'}Quantità{else}{l s='Quantity' d='Shop.Theme.Actions'}{/if}"
        >
      </div>
    </div>

    <div class="add">
      <button
        class="btn btn-primary add-to-cart gucci-add-to-cart gucci-btn gucci-btn--primary{if !$product.add_to_cart_url} gucci-add-to-cart--unavailable{/if}"
        data-button-action="add-to-cart"
        type="submit"
        {if !$product.add_to_cart_url}
          disabled
          aria-disabled="true"
        {/if}
      >
        {if !$product.add_to_cart_url}
          {if $language.iso_code == 'it'}Non disponibile{else}{l s='Out of stock' d='Shop.Theme.Catalog'}{/if}
        {else}
          {if $language.iso_code == 'it'}Aggiungi al carrello{else}{l s='Add to cart' d='Shop.Theme.Actions'}{/if}
        {/if}
      </button>
    </div>

    {block name='product_availability'}
      <div
        id="product-availability"
        class="js-product-availability gucci-product-availability gucci-product-availability--{$product.availability|default:'unavailable'|escape:'html':'UTF-8'}"
        {if !$product.add_to_cart_url || !$product.show_availability || !$product.availability_message}hidden{/if}
      >
        <p class="gucci-product-availability__text">{$product.availability_message}</p>
        {if !empty($product.availability_submessage)}
          <p class="gucci-product-availability__sub">{$product.availability_submessage}</p>
        {/if}
      </div>
    {/block}
  {/if}
</div>
