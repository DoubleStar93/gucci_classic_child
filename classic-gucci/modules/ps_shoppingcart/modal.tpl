{**

 * Classic Gucci — modal carrello stile drawer

 *}

<div id="blockcart-modal" class="modal fade gucci-cart-modal" tabindex="-1" role="dialog" aria-label="{if $language.iso_code == 'it'}Carrello{else}{l s='Shopping Cart' d='Shop.Theme.Checkout'}{/if}" aria-hidden="true">

  <div class="modal-dialog gucci-cart-modal-dialog" role="document">

    <div class="modal-content gucci-cart-modal-content">

      <div class="gucci-cart-modal-header">

        {include

          file='_partials/gucci-panel-close.tpl'

          extraClass='gucci-cart-modal-close'

          closeAttr='data-dismiss="modal"'

        }

      </div>



      <div class="modal-body gucci-cart-modal-body">

        <div class="gucci-cart-modal-products-list">

          {if !empty($cart.products) && $cart.products|@count}

            {foreach from=$cart.products item=lineProduct}

              {include file='_partials/gucci-cart-modal-product-line.tpl' lineProduct=$lineProduct}

            {/foreach}

          {elseif !empty($product)}

            {include file='_partials/gucci-cart-modal-product-line.tpl' lineProduct=$product}

          {/if}

        </div>



        <div class="gucci-cart-modal-summary">

          {if $cart.products_count > 1}

            <p>{if $language.iso_code == 'it'}{$cart.products_count} articoli nel carrello{else}{l s='There are %products_count% items in your cart.' sprintf=['%products_count%' => $cart.products_count] d='Shop.Theme.Checkout'}{/if}</p>

          {else}

            <p>{if $language.iso_code == 'it'}1 articolo nel carrello{else}{l s='There is %products_count% item in your cart.' sprintf=['%products_count%' => $cart.products_count] d='Shop.Theme.Checkout'}{/if}</p>

          {/if}

          <p class="gucci-cart-modal-subtotal">

            <span>{if $language.iso_code == 'it'}Subtotale{else}{l s='Subtotal:' d='Shop.Theme.Checkout'}{/if}</span>

            <span class="gucci-cart-modal-subtotal-value">{$cart.subtotals.products.value}</span>

          </p>

          {hook h='displayCartModalContent' product=$product}

        </div>



        <div class="gucci-cart-modal-actions">

          <button type="button" class="gucci-btn gucci-btn--outline" data-dismiss="modal">

            {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}

          </button>

          <a href="{$cart_url}" class="gucci-btn gucci-btn--primary">

            {if $language.iso_code == 'it'}Vai al carrello{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}

          </a>

        </div>

      </div>

    </div>

  </div>

</div>

