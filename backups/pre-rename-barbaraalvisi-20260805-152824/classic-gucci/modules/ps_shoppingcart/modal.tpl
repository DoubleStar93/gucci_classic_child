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

          closeAttr='data-gucci-cart-modal-close'

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
          {hook h='displayCartModalContent' product=$product}
          {include file='_partials/gucci-cart-summary-block.tpl'}
        </div>



        <div class="gucci-cart-modal-actions">

          <button type="button" class="gucci-btn gucci-btn--outline" data-gucci-cart-modal-close>

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

