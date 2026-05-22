{**
 * Classic Gucci — carrello icona minimal
 *}
<div id="_desktop_cart" class="gucci-cart">
  <div class="blockcart cart-preview {if $cart.products_count > 0}active{else}inactive{/if}" data-refresh-url="{$refresh_url}">
    <div class="header">
      <a
        rel="nofollow"
        aria-label="{l s='Shopping cart' d='Shop.Theme.Checkout'}"
        href="{$cart_url}"
        title="{l s='Cart' d='Shop.Theme.Checkout'}"
      >
        <i class="material-icons shopping-cart" aria-hidden="true">shopping_bag</i>
        {if $cart.products_count > 0}
          <span class="cart-products-count">{$cart.products_count}</span>
        {/if}
      </a>
    </div>
  </div>
</div>
