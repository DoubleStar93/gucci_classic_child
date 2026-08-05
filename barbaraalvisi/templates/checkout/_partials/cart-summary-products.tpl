{**
 * Barbara Alvisi — prodotti nel riepilogo checkout
 *}
<div class="barbaraalvisi-checkout-summary-products js-cart-summary-products">
  {if $cart.products_count > 1}
  <p class="barbaraalvisi-checkout-summary-count">
    {if $language.iso_code == 'it'}{$cart.products_count} articoli{else}{$cart.summary_string}{/if}
  </p>
  {else}
  <p class="barbaraalvisi-checkout-summary-count">
    {if $language.iso_code == 'it'}1 articolo{else}{$cart.summary_string}{/if}
  </p>
  {/if}

  {block name='cart_summary_product_list'}
    <ul class="barbaraalvisi-checkout-summary-product-list" id="cart-summary-product-list">
      {foreach from=$cart.products item=product}
        <li class="barbaraalvisi-checkout-summary-product-item">
          {include file='checkout/_partials/cart-summary-product-line.tpl' product=$product}
        </li>
      {/foreach}
    </ul>
  {/block}
</div>
