{**
 * Barbara Alvisi — riepilogo ordine checkout (sidebar)
 *}
<section class="barbaraalvisi-checkout-summary barbaraalvisi-checkout-summary-card js-cart">
  {block name='hook_checkout_summary_top'}
    {include file='checkout/_partials/cart-summary-top.tpl' cart=$cart}
  {/block}

  {block name='cart_summary_products'}
    {include file='checkout/_partials/cart-summary-products.tpl' cart=$cart}
  {/block}

  {block name='cart_summary_subtotals'}
    {include file='checkout/_partials/cart-summary-subtotals.tpl' cart=$cart}
  {/block}

  {block name='cart_summary_totals'}
    {include file='checkout/_partials/cart-summary-totals.tpl' cart=$cart}
  {/block}

  {block name='cart_summary_voucher'}{/block}
</section>
