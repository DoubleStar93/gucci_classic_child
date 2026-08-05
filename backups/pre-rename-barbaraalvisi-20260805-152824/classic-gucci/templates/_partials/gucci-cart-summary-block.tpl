{**
 * Riepilogo carrello — articoli, subtotale, soglia spedizione gratuita.
 * Hook qui garantisce variabili Smarty prima del render (pagina carrello + modal).
 *}
{hook h='displayShoppingCart'}
<div class="gucci-cart-summary-block"{if isset($gucci_free_shipping_threshold_amount) && $gucci_free_shipping_threshold_amount > 0} data-gucci-free-shipping-threshold="{$gucci_free_shipping_threshold_amount|floatval}"{/if}>
  {if $cart.products_count > 0}
    {if $cart.products_count > 1}
      <p class="gucci-cart-summary-count">{if $language.iso_code == 'it'}{$cart.products_count} ARTICOLI NEL CARRELLO{else}{l s='There are %products_count% items in your cart.' sprintf=['%products_count%' => $cart.products_count] d='Shop.Theme.Checkout'}{/if}</p>
    {else}
      <p class="gucci-cart-summary-count">{if $language.iso_code == 'it'}1 ARTICOLO NEL CARRELLO{else}{l s='There is %products_count% item in your cart.' sprintf=['%products_count%' => $cart.products_count] d='Shop.Theme.Checkout'}{/if}</p>
    {/if}

    {if isset($cart.subtotals.products.value) && $cart.subtotals.products.value|count_characters > 0}
      <p class="gucci-cart-summary-subtotal">
        <span class="gucci-cart-summary-subtotal-label">{if $language.iso_code == 'it'}SUBTOTALE{else}{l s='Subtotal' d='Shop.Theme.Checkout'}{/if}</span>
        <span class="gucci-cart-summary-subtotal-value">{$cart.subtotals.products.value}</span>
      </p>
    {/if}
  {/if}

  {if $cart.products_count > 0}
    {include file='_partials/gucci-free-shipping-hint.tpl'}
  {/if}
</div>
