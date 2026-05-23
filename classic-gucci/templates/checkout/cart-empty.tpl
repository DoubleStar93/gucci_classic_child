{**
 * Classic Gucci — carrello vuoto
 *}
{extends file='checkout/cart.tpl'}

{block name='cart_overview'}
  <div class="gucci-cart-empty">
    <p class="gucci-cart-empty-text">
      {if $language.iso_code == 'it'}Non ci sono articoli nel carrello{else}{l s='There are no more items in your cart' d='Shop.Theme.Checkout'}{/if}
    </p>
    <a class="gucci-btn gucci-btn--outline" href="{$urls.pages.index}">
      {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
    </a>
  </div>
{/block}

{block name='cart_totals'}{/block}
{block name='cart_actions'}{/block}
{block name='hook_shopping_cart_footer'}{/block}
