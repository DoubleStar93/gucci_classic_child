{**

 * Barbara Alvisi — modal carrello stile drawer

 *}

<div id="blockcart-modal" class="modal fade barbaraalvisi-cart-modal" tabindex="-1" role="dialog" aria-label="{if $language.iso_code == 'it'}Carrello{else}{l s='Shopping Cart' d='Shop.Theme.Checkout'}{/if}" aria-hidden="true">

  <div class="modal-dialog barbaraalvisi-cart-modal-dialog" role="document">

    <div class="modal-content barbaraalvisi-cart-modal-content">

      <div class="barbaraalvisi-cart-modal-header">

        {include

          file='_partials/barbaraalvisi-panel-close.tpl'

          extraClass='barbaraalvisi-cart-modal-close'

          closeAttr='data-barbaraalvisi-cart-modal-close'

        }

      </div>



      <div class="modal-body barbaraalvisi-cart-modal-body">

        <div class="barbaraalvisi-cart-modal-products-list">

          {if !empty($cart.products) && $cart.products|@count}

            {foreach from=$cart.products item=lineProduct}

              {include file='_partials/barbaraalvisi-cart-modal-product-line.tpl' lineProduct=$lineProduct}

            {/foreach}

          {elseif !empty($product)}

            {include file='_partials/barbaraalvisi-cart-modal-product-line.tpl' lineProduct=$product}

          {/if}

        </div>



        <div class="barbaraalvisi-cart-modal-summary">
          {hook h='displayCartModalContent' product=$product}
          {include file='_partials/barbaraalvisi-cart-summary-block.tpl'}
        </div>



        <div class="barbaraalvisi-cart-modal-actions">

          <button type="button" class="barbaraalvisi-btn barbaraalvisi-btn--outline" data-barbaraalvisi-cart-modal-close>

            {if $language.iso_code == 'it'}Continua lo shopping{else}{l s='Continue shopping' d='Shop.Theme.Actions'}{/if}

          </button>

          <a href="{$cart_url}" class="barbaraalvisi-btn barbaraalvisi-btn--primary">

            {if $language.iso_code == 'it'}Vai al carrello{else}{l s='Proceed to checkout' d='Shop.Theme.Actions'}{/if}

          </a>

        </div>

      </div>

    </div>

  </div>

</div>

