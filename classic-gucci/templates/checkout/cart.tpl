{**
 * Classic Gucci — carrello
 *}
{extends file='parent:checkout/cart.tpl'}

{block name='content'}
  <section id="main" class="gucci-cart-page">
    <header class="gucci-cart-header">
      <h1 class="gucci-cart-title">
        {if $language.iso_code == 'it'}Carrello{else}{l s='Shopping Cart' d='Shop.Theme.Checkout'}{/if}
      </h1>
    </header>

    <div class="cart-grid row gucci-cart-grid">
      <div class="cart-grid-body col-lg-8">
        <div class="gucci-cart-container">
          {block name='cart_overview'}
            {include file='checkout/_partials/cart-detailed.tpl' cart=$cart}
          {/block}
        </div>

        {block name='continue_shopping'}
          <a class="gucci-cart-continue" href="{$urls.pages.index}">
            {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
          </a>
        {/block}

        {block name='hook_shopping_cart_footer'}{/block}
      </div>

      <div class="cart-grid-right col-lg-4">
        {block name='cart_summary'}
          <div class="gucci-cart-summary">
            {block name='hook_shopping_cart'}
              {hook h='displayShoppingCart'}
            {/block}

            {block name='cart_totals'}
              {include file='checkout/_partials/cart-detailed-totals.tpl' cart=$cart}
            {/block}

            {block name='cart_actions'}
              {include file='checkout/_partials/cart-detailed-actions.tpl' cart=$cart}
            {/block}
          </div>
        {/block}

        {block name='hook_reassurance'}{/block}
      </div>
    </div>

    {hook h='displayCrossSellingShoppingCart'}
  </section>
{/block}
