{**
 * Classic Gucci — riepilogo prodotti (checkout sidebar)
 *}
<div class="cart-summary-products js-cart-summary-products">
  <p>{$cart.summary_string}</p>

  <p>
    <a href="#cart-summary-product-list" data-toggle="collapse" class="js-show-details" aria-expanded="false">
      {if $language.iso_code == 'it'}Mostra dettagli{else}{l s='show details' d='Shop.Theme.Actions'}{/if}
      <i class="material-icons" aria-hidden="true">expand_more</i>
    </a>
  </p>

  {block name='cart_summary_product_list'}
    <div class="collapse" id="cart-summary-product-list">
      <ul class="media-list">
        {foreach from=$cart.products item=product}
          <li class="media">{include file='checkout/_partials/cart-summary-product-line.tpl' product=$product}</li>
        {/foreach}
      </ul>
    </div>
  {/block}
</div>
