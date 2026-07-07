{**
 * Classic Gucci — totale checkout sidebar
 *}
<div class="gucci-checkout-summary-total js-cart-summary-totals">
  {block name='cart_summary_total'}
    {if !$configuration.display_prices_tax_incl && $configuration.taxes_enabled}
      <div class="gucci-checkout-summary-line cart-summary-line">
        <span class="label">{$cart.totals.total.label}&nbsp;{$cart.labels.tax_short}</span>
        <span class="value">{$cart.totals.total.value}</span>
      </div>
      <div class="gucci-checkout-summary-line gucci-checkout-summary-line--total cart-summary-line cart-total">
        <span class="label">{$cart.totals.total_including_tax.label}</span>
        <span class="value">{$cart.totals.total_including_tax.value}</span>
      </div>
    {else}
      <div class="gucci-checkout-summary-line gucci-checkout-summary-line--total cart-summary-line cart-total">
        <span class="label">
          {if $language.iso_code == 'it'}Totale{else}{$cart.totals.total.label}{/if}
          {if $configuration.display_taxes_label && $configuration.taxes_enabled}&nbsp;{$cart.labels.tax_short}{/if}
        </span>
        <span class="value">{if isset($gucci_cart_total_value) && $gucci_cart_total_value|count_characters > 0}{$gucci_cart_total_value}{else}{$cart.totals.total.value}{/if}</span>
      </div>
    {/if}
  {/block}

  {block name='cart_summary_tax'}
    {if $cart.subtotals.tax}
      <div class="gucci-checkout-summary-line gucci-checkout-summary-line--tax cart-summary-line">
        <span class="label sub">{l s='%label%:' sprintf=['%label%' => $cart.subtotals.tax.label] d='Shop.Theme.Global'}</span>
        <span class="value sub">{$cart.subtotals.tax.value}</span>
      </div>
    {/if}
  {/block}
</div>
