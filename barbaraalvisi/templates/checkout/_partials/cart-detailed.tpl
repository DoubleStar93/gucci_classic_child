{**
 * Barbara Alvisi — lista prodotti carrello
 *}
<div class="cart-overview barbaraalvisi-cart-overview">
  {foreach from=$cart.products item=product}
    {include file='checkout/_partials/cart-detailed-product-line.tpl' product=$product}
  {/foreach}
</div>
