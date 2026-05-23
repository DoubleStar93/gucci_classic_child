{**
 * Classic Gucci — checkout
 *}
{extends file='parent:checkout/checkout.tpl'}

{block name='content'}
  <section id="content" class="gucci-checkout-page">
    <header class="gucci-checkout-header">
      <h1 class="gucci-checkout-title">
        {if $language.iso_code == 'it'}Checkout{else}{l s='Checkout' d='Shop.Theme.Actions'}{/if}
      </h1>
    </header>

    <div class="row gucci-checkout-grid">
      <div class="cart-grid-body col-xs-12 col-lg-8">
        {block name='checkout_process'}
          {render file='checkout/checkout-process.tpl' ui=$checkout_process}
        {/block}
      </div>
      <div class="cart-grid-right col-xs-12 col-lg-4">
        {block name='cart_summary'}
          <div class="gucci-checkout-summary js-cart">
            {include file='checkout/_partials/cart-summary.tpl' cart=$cart}
          </div>
        {/block}
        {block name='hook_reassurance'}{/block}
      </div>
    </div>
  </section>
{/block}
