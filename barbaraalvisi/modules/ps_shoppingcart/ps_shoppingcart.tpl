{**
 * Barbara Alvisi — carrello icona minimal
 *}
<div id="_desktop_cart" class="barbaraalvisi-cart">
  <div class="blockcart cart-preview {if $cart.products_count > 0}active{else}inactive{/if}" data-refresh-url="{$refresh_url}">
    <div class="header">
      <a
        rel="nofollow"
        aria-label="{if $language.iso_code == 'it'}Carrello{else}{l s='Shopping cart' d='Shop.Theme.Checkout'}{/if}"
        href="{$cart_url}"
        title="{if $language.iso_code == 'it'}Carrello{else}{l s='Cart' d='Shop.Theme.Checkout'}{/if}"
      >
        <i class="material-icons shopping-cart" aria-hidden="true">shopping_bag</i>
        {if $cart.products_count > 0}
          <span class="cart-products-count">{$cart.products_count}</span>
        {/if}
      </a>
    </div>
  </div>
</div>
