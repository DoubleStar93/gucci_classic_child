{**
 * Barbara Alvisi — subtotali checkout sidebar
 *}
<div class="barbaraalvisi-checkout-summary-lines js-cart-summary-subtotals">
  {foreach from=$cart.subtotals item="subtotal"}
    {if $subtotal && $subtotal.value|count_characters > 0 && $subtotal.type !== 'tax'}
      <div class="barbaraalvisi-checkout-summary-line cart-summary-line" id="cart-subtotal-{$subtotal.type}">
        <span class="label">
          {if $language.iso_code == 'it'}
            {if $subtotal.type == 'products'}Totale parziale{elseif $subtotal.type == 'shipping'}Spedizione{else}{$subtotal.label}{/if}
          {else}
            {$subtotal.label}
          {/if}
        </span>
        <span class="value">{if 'discount' == $subtotal.type}-&nbsp;{/if}{$subtotal.value}</span>
      </div>
    {/if}
  {/foreach}
</div>
