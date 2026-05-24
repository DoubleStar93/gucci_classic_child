{**
 * Classic Gucci — CTA checkout nel carrello
 *}
{block name='cart_detailed_actions'}
  <div class="checkout cart-detailed-actions card-block">
    {if $cart.minimalPurchaseRequired}
      <div class="alert alert-warning" role="alert">
        {$cart.minimalPurchaseRequired}
      </div>
      <div class="text-sm-center">
        <button type="button" class="gucci-btn gucci-btn--primary" disabled>
          {if $language.iso_code == 'it'}Procedi al checkout{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
        </button>
      </div>
    {elseif empty($cart.products)}
      <div class="text-sm-center">
        <button type="button" class="gucci-btn gucci-btn--primary" disabled>
          {if $language.iso_code == 'it'}Procedi al checkout{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
        </button>
      </div>
    {else}
      <div class="text-sm-center">
        <a href="{$urls.pages.order}" class="gucci-btn gucci-btn--primary">
          {if $language.iso_code == 'it'}Procedi al checkout{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
        </a>
        {hook h='displayExpressCheckout'}
      </div>
    {/if}
  </div>
{/block}
