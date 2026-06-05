{**
 * Classic Gucci — carrello
 *}
{extends file='parent:checkout/cart.tpl'}

{block name='content'}
  <section id="main" class="gucci-cart-page{if $cart.products_count == 0} gucci-cart-page--empty{/if}">
    <header class="gucci-cart-header">
      <h1 class="gucci-cart-title">
        {if $language.iso_code == 'it'}Carrello{else}{l s='Shopping Cart' d='Shop.Theme.Checkout'}{/if}
      </h1>
      {if $cart.products_count > 0}
        <p class="gucci-cart-subtitle">
          {$cart.products_count}
          {if $language.iso_code == 'it'}
            {if $cart.products_count == 1} articolo{else} articoli{/if}
          {else}
            {if $cart.products_count == 1} {l s='item' d='Shop.Theme.Checkout'}{else} {l s='items' d='Shop.Theme.Checkout'}{/if}
          {/if}
        </p>
      {/if}
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

    {block name='display_crossselling'}
      {if $language.iso_code == 'it'}
        {assign var='gucciCartSelectionTitle' value='Selezione'}
      {else}
        {l s='Popular Products' d='Shop.Theme.Catalog' assign='gucciCartSelectionTitle'}
      {/if}
      {include
        file='_partials/gucci-featured-products-strip.tpl'
        wrapperClass='gucci-cart-cross-selling'
        hookName='displayCrossSellingShoppingCart'
        widgetHook='displayHome'
        sectionTitle=$gucciCartSelectionTitle
      }
    {/block}

  </section>
{/block}
