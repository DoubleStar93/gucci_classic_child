{**
 * Barbara Alvisi — carrello
 *}
{extends file='parent:checkout/cart.tpl'}

{block name='content'}
  <section id="main">
    <div class="barbaraalvisi-cart-page{if $cart.products_count == 0} barbaraalvisi-cart-page--empty{/if}">
    <header class="barbaraalvisi-cart-header">
      <h1 class="barbaraalvisi-cart-title">
        {if $language.iso_code == 'it'}Carrello{else}{l s='Shopping Cart' d='Shop.Theme.Checkout'}{/if}
      </h1>
      {if $cart.products_count > 0}
        <p class="barbaraalvisi-cart-subtitle">
          {$cart.products_count}
          {if $language.iso_code == 'it'}
            {if $cart.products_count == 1} articolo{else} articoli{/if}
          {else}
            {if $cart.products_count == 1} {l s='item' d='Shop.Theme.Checkout'}{else} {l s='items' d='Shop.Theme.Checkout'}{/if}
          {/if}
        </p>
      {/if}
    </header>

    <div class="cart-grid row barbaraalvisi-cart-grid">
      <div class="cart-grid-body col-lg-8">
        <div class="barbaraalvisi-cart-container">
          {block name='cart_overview'}
            {include file='checkout/_partials/cart-detailed.tpl' cart=$cart}
          {/block}
        </div>

        {block name='continue_shopping'}{/block}

        {block name='hook_shopping_cart_footer'}{/block}
      </div>

      <div class="cart-grid-right col-lg-4">
        {block name='cart_summary'}
          <div class="barbaraalvisi-cart-summary">
            {block name='hook_shopping_cart'}{/block}

            {include file='_partials/barbaraalvisi-cart-summary-block.tpl'}

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
    </div>

    {block name='display_crossselling'}
      {include
        file='_partials/barbaraalvisi-featured-products-strip.tpl'
        wrapperClass='barbaraalvisi-cart-cross-selling'
        hookName='displayCrossSellingShoppingCart'
        widgetHook='displayHome'
      }
    {/block}

  </section>
{/block}
