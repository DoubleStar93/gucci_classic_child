{**
 * Barbara Alvisi — totali carrello (override)
 * Spedizione: BarbaraalvisiCartShipping via hook displayShoppingCart (fissa + soglia gratuita).
 *}
{block name='cart_detailed_totals'}
<div class="cart-detailed-totals js-cart-detailed-totals">

  <div class="card-block cart-summary-subtotals-container js-cart-summary-subtotals-container">

    {foreach from=$cart.subtotals item="subtotal"}
      {if $subtotal && $subtotal.type !== 'tax'}
        {assign var='barbaraalvisiShowSubtotal' value=false}
        {if $subtotal.type === 'shipping'}
          {assign var='barbaraalvisiShowSubtotal' value=true}
        {elseif $subtotal.value|count_characters > 0}
          {assign var='barbaraalvisiShowSubtotal' value=true}
        {/if}

        {if $barbaraalvisiShowSubtotal}
          {if $subtotal.type !== 'products'}
          <div class="cart-summary-line" id="cart-subtotal-{$subtotal.type}">
            <span class="label">
              {if $subtotal.type === 'shipping' && $language.iso_code == 'it'}
                SPEDIZIONE
              {else}
                {$subtotal.label}
              {/if}
            </span>
            <span class="value">
              {if 'discount' == $subtotal.type}-&nbsp;{/if}
              {if $subtotal.type === 'shipping' && isset($barbaraalvisi_shipping_value) && $barbaraalvisi_shipping_value|count_characters > 0}
                {$barbaraalvisi_shipping_value}
              {elseif $subtotal.type === 'shipping' && isset($barbaraalvisi_shipping_amount) && $barbaraalvisi_shipping_amount <= 0 && $subtotal.value|count_characters > 0}
                {$subtotal.value}
              {elseif $subtotal.type === 'shipping' && $subtotal.value|count_characters == 0}
                {if $language.iso_code == 'it'}GRATIS{else}{l s='Free' d='Shop.Theme.Checkout'}{/if}
              {else}
                {$subtotal.value}
              {/if}
            </span>
            {if $subtotal.type === 'shipping'}
              <div>
                <small class="value">{hook h='displayCheckoutSubtotalDetails' subtotal=$subtotal}</small>
              </div>
            {/if}
          </div>
          {/if}
        {/if}
      {/if}
    {/foreach}

  </div>

  {block name='cart_summary_totals'}
    {include file='checkout/_partials/cart-summary-totals.tpl' cart=$cart}
  {/block}

  {block name='cart_voucher'}
    {include file='checkout/_partials/cart-voucher.tpl'}
  {/block}

</div>
{/block}
