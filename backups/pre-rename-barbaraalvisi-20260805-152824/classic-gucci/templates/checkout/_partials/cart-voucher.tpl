{**
 * Classic Gucci — codice promozionale carrello/checkout
 *}
{extends file='parent:checkout/_partials/cart-voucher.tpl'}

{block name='cart_voucher'}
    <div class="block-promo">
      <div class="cart-voucher js-cart-voucher">
        {if $cart.vouchers.added}
          {block name='cart_voucher_list'}
            <ul class="promo-name card-block">
              {foreach from=$cart.vouchers.added item=voucher}
                <li class="cart-summary-line">
                  <span class="label">{$voucher.name}</span>
                  <div class="float-xs-right">
                    <span>{$voucher.reduction_formatted}</span>
                    {if isset($voucher.code) && $voucher.code !== ''}
                      <a href="{$voucher.delete_url}" data-link-action="remove-voucher" title="{if $language.iso_code == 'it'}Rimuovi{else}{l s='Remove' d='Shop.Theme.Actions'}{/if}">
                        <i class="material-icons">&#xE872;</i>
                      </a>
                    {/if}
                  </div>
                </li>
              {/foreach}
            </ul>
          {/block}
        {/if}

        <p>
          <a class="promo-code-button collapse-button" href="#promo-code" aria-expanded="false">
            {if $language.iso_code == 'it'}Hai un codice promozionale?{else}{l s='Have a promo code?' d='Shop.Theme.Checkout'}{/if}
          </a>
        </p>

        <div class="promo-code collapse" id="promo-code">
          {block name='cart_voucher_form'}
            <form action="{$urls.pages.cart}" data-link-action="add-voucher" method="post">
              <input type="hidden" name="token" value="{$static_token}">
              <input type="hidden" name="addDiscount" value="1">
              <input class="promo-input" type="text" name="discount_name" placeholder="{if $language.iso_code == 'it'}Codice promozionale{else}{l s='Promo code' d='Shop.Theme.Checkout'}{/if}">
              <button type="submit" class="btn btn-primary">
                <span>{if $language.iso_code == 'it'}Aggiungi{else}{l s='Add' d='Shop.Theme.Actions'}{/if}</span>
              </button>
            </form>
          {/block}

          {block name='cart_voucher_notifications'}{/block}

          <a class="collapse-button promo-code-button cancel-promo" href="#promo-code" aria-expanded="true">
            {if $language.iso_code == 'it'}Chiudi{else}{l s='Close' d='Shop.Theme.Checkout'}{/if}
          </a>

          {if $cart.discounts|count > 0}
            <p>
              {if $language.iso_code == 'it'}Approfitta delle nostre offerte esclusive:{else}{l s='Take advantage of our exclusive offers:' d='Shop.Theme.Actions'}{/if}
            </p>
            <ul>
              {foreach from=$cart.discounts item=discount}
                <li>
                  <a href="{$discount.add_url}" data-link-action="add-voucher">
                    {$discount.code} - {$discount.name}
                  </a>
                </li>
              {/foreach}
            </ul>
          {/if}
        </div>
      </div>
    </div>
{/block}
