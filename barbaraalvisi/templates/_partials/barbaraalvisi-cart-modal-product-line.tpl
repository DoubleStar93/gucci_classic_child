{**
 * Riga prodotto nel modal carrello — quantità + rimuovi
 *}
{assign var='barbaraalvisiModalQty' value=$lineProduct.quantity|default:$lineProduct.cart_quantity|default:1}

<div
  class="barbaraalvisi-cart-modal-product"
  data-id-product="{$lineProduct.id_product|intval}"
  data-id-product-attribute="{$lineProduct.id_product_attribute|intval}"
  data-id-customization="{$lineProduct.id_customization|default:0|intval}"
>
  <a href="{$lineProduct.url|escape:'html':'UTF-8'}" class="barbaraalvisi-cart-modal-product__media">
    {if !empty($lineProduct.default_image.medium.url)}
      <img
        src="{$lineProduct.default_image.medium.url}"
        alt="{$lineProduct.name|escape:'htmlall':'UTF-8'}"
        loading="lazy"
        class="barbaraalvisi-cart-modal-image"
      >
    {elseif !empty($lineProduct.cover.medium.url)}
      <img
        src="{$lineProduct.cover.medium.url}"
        alt="{$lineProduct.name|escape:'htmlall':'UTF-8'}"
        loading="lazy"
        class="barbaraalvisi-cart-modal-image"
      >
    {else}
      <img
        src="{$urls.no_picture_image.bySize.medium_default.url}"
        alt="{$lineProduct.name|escape:'htmlall':'UTF-8'}"
        loading="lazy"
        class="barbaraalvisi-cart-modal-image"
      >
    {/if}
  </a>

  <div class="barbaraalvisi-cart-modal-details">
    <div class="barbaraalvisi-cart-modal-details__top">
      <a href="{$lineProduct.url|escape:'html':'UTF-8'}" class="barbaraalvisi-cart-modal-name">{$lineProduct.name}</a>
      {if empty($lineProduct.is_gift) && !empty($lineProduct.remove_from_cart_url)}
        <a
          class="barbaraalvisi-cart-modal-remove remove-from-cart"
          rel="nofollow"
          href="{$lineProduct.remove_from_cart_url|escape:'html':'UTF-8'}"
          data-link-action="delete-from-cart"
          data-id-product="{$lineProduct.id_product|escape:'javascript'}"
          data-id-product-attribute="{$lineProduct.id_product_attribute|escape:'javascript'}"
          data-id-customization="{$lineProduct.id_customization|default:0|escape:'javascript'}"
          aria-label="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}"
          title="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}"
        >
          <span aria-hidden="true">&times;</span>
        </a>
      {/if}
    </div>

    <p class="barbaraalvisi-cart-modal-price">{$lineProduct.price}</p>

    {foreach from=$lineProduct.attributes item="property_value" key="property"}
      <span class="barbaraalvisi-cart-modal-attr">{$property}: {$property_value}</span>
    {/foreach}

    {if !empty($lineProduct.is_gift)}
      <span class="barbaraalvisi-cart-modal-qty-label">
        {if $language.iso_code == 'it'}Quantità:{else}{l s='Quantity:' d='Shop.Theme.Checkout'}{/if} {$barbaraalvisiModalQty}
      </span>
    {elseif !empty($lineProduct.up_quantity_url) && !empty($lineProduct.down_quantity_url)}
      <div
        class="barbaraalvisi-cart-modal-qty"
        data-up-url="{$lineProduct.up_quantity_url|escape:'html_attr':'UTF-8'}"
        data-down-url="{$lineProduct.down_quantity_url|escape:'html_attr':'UTF-8'}"
        data-update-url="{$lineProduct.update_quantity_url|default:''|escape:'html_attr':'UTF-8'}"
      >
        <span class="barbaraalvisi-cart-modal-qty-label">
          {if $language.iso_code == 'it'}Quantità{else}{l s='Quantity' d='Shop.Theme.Checkout'}{/if}
        </span>
        <div class="barbaraalvisi-cart-modal-qty-controls barbaraalvisi-cart-qty">
          <button
            type="button"
            class="barbaraalvisi-cart-modal-qty-btn"
            data-qty-action="down"
            aria-label="{if $language.iso_code == 'it'}Diminuisci quantità{else}{l s='Decrease quantity' d='Shop.Theme.Actions'}{/if}"
          >
            &minus;
          </button>
          <input
            class="js-cart-line-product-quantity barbaraalvisi-cart-modal-qty-input"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            min="1"
            value="{$barbaraalvisiModalQty|intval}"
            data-product-id="{$lineProduct.id_product|intval}"
            data-down-url="{$lineProduct.down_quantity_url|escape:'html_attr':'UTF-8'}"
            data-up-url="{$lineProduct.up_quantity_url|escape:'html_attr':'UTF-8'}"
            data-update-url="{$lineProduct.update_quantity_url|default:''|escape:'html_attr':'UTF-8'}"
            aria-label="{if $language.iso_code == 'it'}Quantità prodotto{else}{l s='Product quantity' d='Shop.Theme.Checkout'}{/if}"
          >
          <button
            type="button"
            class="barbaraalvisi-cart-modal-qty-btn"
            data-qty-action="up"
            aria-label="{if $language.iso_code == 'it'}Aumenta quantità{else}{l s='Increase quantity' d='Shop.Theme.Actions'}{/if}"
          >
            +
          </button>
        </div>
      </div>
    {else}
      <span class="barbaraalvisi-cart-modal-qty-label">
        {if $language.iso_code == 'it'}Quantità:{else}{l s='Quantity:' d='Shop.Theme.Checkout'}{/if} {$barbaraalvisiModalQty}
      </span>
    {/if}
  </div>
</div>
