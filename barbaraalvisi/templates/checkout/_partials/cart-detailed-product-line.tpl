{**
 * Barbara Alvisi — riga prodotto nel carrello
 *}
<article
  class="barbaraalvisi-cart-line cart-item product-line-grid"
  data-id-product="{$product.id_product|intval}"
  data-id-product-attribute="{$product.id_product_attribute|intval}"
  data-id-customization="{$product.id_customization|default:0|intval}"
>
  <a href="{$product.url|escape:'html':'UTF-8'}" class="barbaraalvisi-cart-line__media">
    {if $product.default_image}
      <picture>
        {if !empty($product.default_image.bySize.cart_default.sources.avif)}<source srcset="{$product.default_image.bySize.cart_default.sources.avif}" type="image/avif">{/if}
        {if !empty($product.default_image.bySize.cart_default.sources.webp)}<source srcset="{$product.default_image.bySize.cart_default.sources.webp}" type="image/webp">{/if}
        <img src="{$product.default_image.bySize.cart_default.url}" alt="{$product.name|escape:'htmlall':'UTF-8'}" loading="lazy">
      </picture>
    {else}
      <picture>
        {if !empty($urls.no_picture_image.bySize.cart_default.sources.avif)}<source srcset="{$urls.no_picture_image.bySize.cart_default.sources.avif}" type="image/avif">{/if}
        {if !empty($urls.no_picture_image.bySize.cart_default.sources.webp)}<source srcset="{$urls.no_picture_image.bySize.cart_default.sources.webp}" type="image/webp">{/if}
        <img src="{$urls.no_picture_image.bySize.cart_default.url}" alt="{$product.name|escape:'htmlall':'UTF-8'}" loading="lazy">
      </picture>
    {/if}
  </a>

  <div class="barbaraalvisi-cart-line__info">
    <div class="barbaraalvisi-cart-line__head">
      <a class="barbaraalvisi-cart-line__title" href="{$product.url|escape:'html':'UTF-8'}">{$product.name}</a>
      {if empty($product.is_gift)}
        <a
          class="barbaraalvisi-cart-line__remove remove-from-cart"
          rel="nofollow"
          href="{$product.remove_from_cart_url|escape:'html':'UTF-8'}"
          data-link-action="delete-from-cart"
          data-id-product="{$product.id_product|escape:'javascript'}"
          data-id-product-attribute="{$product.id_product_attribute|escape:'javascript'}"
          data-id-customization="{$product.id_customization|default:0|escape:'javascript'}"
          aria-label="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}"
          title="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}"
        >
          <span aria-hidden="true">&times;</span>
        </a>
      {/if}
    </div>

    <div class="barbaraalvisi-cart-line__unit-price">
      {if $product.has_discount}
        <span class="barbaraalvisi-cart-line__regular-price">{$product.regular_price}</span>
      {/if}
      <span class="barbaraalvisi-cart-line__price">{$product.price}</span>
    </div>

    {foreach from=$product.attributes key="attribute" item="value"}
      {assign var='barbaraalvisiAttrLabel' value=$attribute}
      {assign var='barbaraalvisiAttrValue' value=$value}
      {if $language.iso_code == 'it'}
        {if $attribute == 'Size'}{assign var='barbaraalvisiAttrLabel' value='Taglia'}{/if}
        {if $attribute == 'Color'}{assign var='barbaraalvisiAttrLabel' value='Colore'}{/if}
        {if $attribute == 'Dimension'}{assign var='barbaraalvisiAttrLabel' value='Dimensione'}{/if}
        {if $value == 'White'}{assign var='barbaraalvisiAttrValue' value='Bianco'}{/if}
        {if $value == 'Black'}{assign var='barbaraalvisiAttrValue' value='Nero'}{/if}
      {/if}
      <p class="barbaraalvisi-cart-line__attr"><span>{$barbaraalvisiAttrLabel}:</span> {$barbaraalvisiAttrValue}</p>
    {/foreach}

    {hook h='displayCartExtraProductInfo' product=$product}
  </div>

  <div class="barbaraalvisi-cart-line__qty">
    {if !empty($product.is_gift)}
      <span class="barbaraalvisi-cart-line__qty-label">
        {if $language.iso_code == 'it'}Quantità:{else}{l s='Quantity:' d='Shop.Theme.Checkout'}{/if} {$product.quantity}
      </span>
    {elseif !empty($product.up_quantity_url) && !empty($product.down_quantity_url)}
      <span class="barbaraalvisi-cart-line__qty-label">
        {if $language.iso_code == 'it'}Quantità{else}{l s='Quantity' d='Shop.Theme.Checkout'}{/if}
      </span>
      <div
        class="barbaraalvisi-cart-line__qty-controls barbaraalvisi-cart-qty"
        data-up-url="{$product.up_quantity_url|escape:'html_attr':'UTF-8'}"
        data-down-url="{$product.down_quantity_url|escape:'html_attr':'UTF-8'}"
        data-update-url="{$product.update_quantity_url|default:''|escape:'html_attr':'UTF-8'}"
      >
        <button
          type="button"
          class="barbaraalvisi-cart-qty-btn"
          data-qty-action="down"
          aria-label="{if $language.iso_code == 'it'}Diminuisci quantità{else}{l s='Decrease quantity' d='Shop.Theme.Actions'}{/if}"
        >
          &minus;
        </button>
        <input
          class="js-cart-line-product-quantity barbaraalvisi-cart-qty-input"
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          min="1"
          value="{$product.quantity|intval}"
          data-product-id="{$product.id_product|intval}"
          data-down-url="{$product.down_quantity_url|escape:'html_attr':'UTF-8'}"
          data-up-url="{$product.up_quantity_url|escape:'html_attr':'UTF-8'}"
          data-update-url="{$product.update_quantity_url|default:''|escape:'html_attr':'UTF-8'}"
          aria-label="{if $language.iso_code == 'it'}Quantità prodotto{else}{l s='Product quantity' d='Shop.Theme.Checkout'}{/if}"
        >
        <button
          type="button"
          class="barbaraalvisi-cart-qty-btn"
          data-qty-action="up"
          aria-label="{if $language.iso_code == 'it'}Aumenta quantità{else}{l s='Increase quantity' d='Shop.Theme.Actions'}{/if}"
        >
          +
        </button>
      </div>
    {else}
      <span class="barbaraalvisi-cart-line__qty-label">
        {if $language.iso_code == 'it'}Quantità:{else}{l s='Quantity:' d='Shop.Theme.Checkout'}{/if} {$product.quantity}
      </span>
    {/if}
  </div>

  <div class="barbaraalvisi-cart-line__total">
    {if !empty($product.is_gift)}
      <span class="barbaraalvisi-cart-line__gift">{if $language.iso_code == 'it'}Omaggio{else}{l s='Gift' d='Shop.Theme.Checkout'}{/if}</span>
    {else}
      <span class="barbaraalvisi-cart-line__total-value">{$product.total}</span>
    {/if}
  </div>
</article>
