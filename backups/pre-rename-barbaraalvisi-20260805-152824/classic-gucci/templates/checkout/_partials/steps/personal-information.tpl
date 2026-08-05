{**
 * Classic Gucci — step informazioni personali checkout (IT + tab minimal)
 *}
{extends file='parent:checkout/_partials/steps/personal-information.tpl'}

{block name='step_content'}
  {hook h='displayPersonalInformationTop' customer=$customer}

  {if $customer.is_logged && !$customer.is_guest}
    <p class="gucci-checkout-logged-as">
      {if $language.iso_code == 'it'}
        Connesso come <strong>{$customer.firstname|escape:'htmlall':'UTF-8'} {$customer.lastname|escape:'htmlall':'UTF-8'}</strong>.
      {else}
        {l s='Connected as [1]%firstname% %lastname%[/1].' d='Shop.Theme.Customeraccount' sprintf=[
          '[1]' => '<strong>',
          '[/1]' => '</strong>',
          '%firstname%' => $customer.firstname,
          '%lastname%' => $customer.lastname
        ]}
      {/if}
    </p>

    <p class="gucci-checkout-logout-link">
      <a href="{$urls.actions.logout}" class="gucci-checkout-link">
        {if $language.iso_code == 'it'}Non sei tu? Esci{else}{l s='Not you? [1]Log out[/1]' d='Shop.Theme.Customeraccount' sprintf=['[1]' => '', '[/1]' => '']}{/if}
      </a>
    </p>

    {if !isset($empty_cart_on_logout) || $empty_cart_on_logout}
      <p class="gucci-checkout-logout-note">
        {if $language.iso_code == 'it'}Se esci ora, il carrello verrà svuotato.{else}{l s='If you sign out now, your cart will be emptied.' d='Shop.Theme.Checkout'}{/if}
      </p>
    {/if}

    <p class="gucci-checkout-continue-wrap">
      <button type="button" class="gucci-btn gucci-btn--primary continue btn btn-primary" name="continue" data-link-action="register-new-customer">
        {if $language.iso_code == 'it'}Continua{else}{l s='Continue' d='Shop.Theme.Actions'}{/if}
      </button>
    </p>
  {else}
    <ul class="nav nav-tabs gucci-checkout-tabs" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link{if !$show_login_form} active{/if}"
          data-toggle="tab"
          href="#checkout-guest-form"
          role="tab"
          aria-controls="checkout-guest-form"
          {if !$show_login_form} aria-selected="true"{else} aria-selected="false"{/if}
        >
          {if $language.iso_code == 'it'}Ordina come ospite{else}{l s='Order as a guest' d='Shop.Theme.Checkout'}{/if}
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link{if $show_login_form} active{/if}"
          data-toggle="tab"
          data-link-action="show-login-form"
          href="#checkout-login-form"
          role="tab"
          aria-controls="checkout-login-form"
          {if $show_login_form} aria-selected="true"{else} aria-selected="false"{/if}
        >
          {if $language.iso_code == 'it'}Accedi{else}{l s='Sign in' d='Shop.Theme.Actions'}{/if}
        </a>
      </li>
    </ul>

    <div class="tab-content gucci-checkout-tab-panels">
      <div class="tab-pane{if !$show_login_form} active{/if}" id="checkout-guest-form" role="tabpanel" {if $show_login_form}aria-hidden="true"{else}aria-hidden="false"{/if}>
        {render file='checkout/_partials/customer-form.tpl' ui=$register_form guest_allowed=$guest_allowed}
      </div>
      <div class="tab-pane{if $show_login_form} active{/if}" id="checkout-login-form" role="tabpanel" {if !$show_login_form}aria-hidden="true"{else}aria-hidden="false"{/if}>
        {render file='checkout/_partials/login-form.tpl' ui=$login_form}
      </div>
    </div>
  {/if}
{/block}
