{**
 * Classic Gucci — modal carrello stile drawer
 *}
<div id="blockcart-modal" class="modal fade gucci-cart-modal" tabindex="-1" role="dialog" aria-labelledby="gucciCartModalLabel" aria-hidden="true">
  <div class="modal-dialog gucci-cart-modal-dialog" role="document">
    <div class="modal-content gucci-cart-modal-content">
      <div class="gucci-cart-modal-header">
        <h4 class="gucci-cart-modal-title" id="gucciCartModalLabel">
          {if $language.iso_code == 'it'}Aggiunto al carrello{else}{l s='Product successfully added to your shopping cart' d='Shop.Theme.Checkout'}{/if}
        </h4>
        <button type="button" class="gucci-cart-modal-close btn-unstyle" data-dismiss="modal" aria-label="{if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Global'}{/if}">
          <i class="material-icons" aria-hidden="true">close</i>
        </button>
      </div>

      <div class="modal-body gucci-cart-modal-body">
        <div class="gucci-cart-modal-product">
          {if $product.default_image}
            <img
              src="{$product.default_image.medium.url}"
              alt="{$product.default_image.legend}"
              title="{$product.default_image.legend}"
              loading="lazy"
              class="gucci-cart-modal-image"
            >
          {else}
            <img
              src="{$urls.no_picture_image.bySize.medium_default.url}"
              loading="lazy"
              class="gucci-cart-modal-image"
              alt="{$product.name}"
            >
          {/if}

          <div class="gucci-cart-modal-details">
            <p class="gucci-cart-modal-name">{$product.name}</p>
            <p class="gucci-cart-modal-price">{$product.price}</p>
            {foreach from=$product.attributes item="property_value" key="property"}
              <span class="gucci-cart-modal-attr">{$property}: {$property_value}</span>
            {/foreach}
            <span class="gucci-cart-modal-qty">
              {if $language.iso_code == 'it'}Quantità:{else}{l s='Quantity:' d='Shop.Theme.Checkout'}{/if} {$product.cart_quantity}
            </span>
          </div>
        </div>

        <div class="gucci-cart-modal-summary">
          {if $cart.products_count > 1}
            <p>{if $language.iso_code == 'it'}{$cart.products_count} articoli nel carrello{else}{l s='There are %products_count% items in your cart.' sprintf=['%products_count%' => $cart.products_count] d='Shop.Theme.Checkout'}{/if}</p>
          {else}
            <p>{if $language.iso_code == 'it'}1 articolo nel carrello{else}{l s='There is %products_count% item in your cart.' sprintf=['%products_count%' => $cart.products_count] d='Shop.Theme.Checkout'}{/if}</p>
          {/if}
          <p class="gucci-cart-modal-subtotal">
            <span>{if $language.iso_code == 'it'}Subtotale{else}{l s='Subtotal:' d='Shop.Theme.Checkout'}{/if}</span>
            <span>{$cart.subtotals.products.value}</span>
          </p>
          {hook h='displayCartModalContent' product=$product}
        </div>

        <div class="gucci-cart-modal-actions">
          <button type="button" class="gucci-btn gucci-btn--outline" data-dismiss="modal">
            {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
          </button>
          <a href="{$cart_url}" class="gucci-btn gucci-btn--primary">
            {if $language.iso_code == 'it'}Vai al carrello{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
          </a>
        </div>
      </div>

      <div class="gucci-cart-modal-cross-selling">
        {if $language.iso_code == 'it'}
          {assign var='gucciModalSelectionTitle' value='Selezione'}
        {else}
          {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciModalSelectionTitle'}
        {/if}
        {include
          file='_partials/gucci-featured-products-strip.tpl'
          wrapperClass='gucci-cart-modal-products'
          hookName='displayCartModalFooter'
          widgetHook='displayHome'
          sectionTitle=$gucciModalSelectionTitle
        }
      </div>
    </div>
  </div>
</div>
