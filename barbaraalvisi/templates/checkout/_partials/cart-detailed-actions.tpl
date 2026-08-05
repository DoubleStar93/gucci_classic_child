{**
 * Barbara Alvisi — CTA checkout nel carrello (come modal: primary + outline)
 *}
{block name='cart_detailed_actions'}
  <div class="cart-detailed-actions barbaraalvisi-cart-summary-actions">
    {if $cart.minimalPurchaseRequired}
      <div class="alert alert-warning" role="alert">
        {$cart.minimalPurchaseRequired}
      </div>
      <button type="button" class="barbaraalvisi-btn barbaraalvisi-btn--primary" disabled>
        {if $language.iso_code == 'it'}Procedi al checkout{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
      </button>
    {elseif empty($cart.products)}
      <button type="button" class="barbaraalvisi-btn barbaraalvisi-btn--primary" disabled>
        {if $language.iso_code == 'it'}Procedi al checkout{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
      </button>
    {else}
      <a href="{$urls.pages.order}" class="barbaraalvisi-btn barbaraalvisi-btn--primary">
        {if $language.iso_code == 'it'}Procedi al checkout{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}
      </a>
      {hook h='displayExpressCheckout'}
    {/if}

    <a href="{$urls.pages.index}" class="barbaraalvisi-btn barbaraalvisi-btn--outline">
      {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}
    </a>
  </div>
{/block}
